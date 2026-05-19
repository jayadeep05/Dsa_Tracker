package com.dsatracker.service;

import com.dsatracker.dto.CheckpointRequest;
import com.dsatracker.dto.ConceptLogRequest;
import com.dsatracker.entity.CheckpointResult;
import com.dsatracker.entity.ConceptLog;
import com.dsatracker.entity.User;
import com.dsatracker.repository.CheckpointResultRepository;
import com.dsatracker.repository.ConceptLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BackendPrepService {

    private final ConceptLogRepository conceptLogRepository;
    private final CheckpointResultRepository checkpointResultRepository;

    /**
     * Get all concept logs for a user, keyed by topicId for easy frontend consumption.
     */
    public Map<String, ConceptLog> getAllProgress(Integer userId) {
        return conceptLogRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(ConceptLog::getTopicId, log -> log));
    }

    /**
     * Get a single concept log for a specific topic.
     */
    public ConceptLog getTopicProgress(Integer userId, String topicId) {
        return conceptLogRepository.findByUserIdAndTopicId(userId, topicId)
                .orElse(null);
    }

    /**
     * Upsert progress for a topic — creates if not exists, updates if exists.
     */
    @Transactional
    public ConceptLog upsertProgress(User user, String topicId, ConceptLogRequest request) {
        ConceptLog log = conceptLogRepository.findByUserIdAndTopicId(user.getId(), topicId)
                .orElseGet(() -> ConceptLog.builder()
                        .user(user)
                        .topicId(topicId)
                        .build());

        if (request.getStatus() != null) {
            ConceptLog.ConceptStatus newStatus = ConceptLog.ConceptStatus.valueOf(request.getStatus());
            log.setStatus(newStatus);
            if (newStatus == ConceptLog.ConceptStatus.DONE && log.getCompletedAt() == null) {
                log.setCompletedAt(LocalDateTime.now());
            }
        }

        if (request.getNotes() != null) {
            log.setNotes(request.getNotes());
        }

        if (request.getFailureSimDone() != null) {
            log.setFailureSimDone(request.getFailureSimDone());
        }

        return conceptLogRepository.save(log);
    }

    /**
     * Get all checkpoint results for a phase.
     */
    public List<CheckpointResult> getCheckpointResults(Integer userId, String phaseId) {
        return checkpointResultRepository.findByUserIdAndPhaseIdOrderByAttemptedAtDesc(userId, phaseId);
    }

    /**
     * Submit a new checkpoint self-assessment.
     */
    @Transactional
    public CheckpointResult submitCheckpoint(User user, String phaseId, CheckpointRequest request) {
        CheckpointResult result = CheckpointResult.builder()
                .user(user)
                .phaseId(phaseId)
                .score(request.getScore())
                .totalItems(request.getTotalItems())
                .responses(request.getResponses())
                .build();

        return checkpointResultRepository.save(result);
    }

    /**
     * Get summary stats for the backend prep dashboard.
     */
    public Map<String, Long> getStats(Integer userId) {
        long done = conceptLogRepository.countByUserIdAndStatus(userId, ConceptLog.ConceptStatus.DONE);
        long inProgress = conceptLogRepository.countByUserIdAndStatus(userId, ConceptLog.ConceptStatus.IN_PROGRESS);
        long notStarted = conceptLogRepository.countByUserIdAndStatus(userId, ConceptLog.ConceptStatus.NOT_STARTED);

        return Map.of(
                "done", done,
                "inProgress", inProgress,
                "notStarted", notStarted,
                "total", done + inProgress + notStarted
        );
    }
}
