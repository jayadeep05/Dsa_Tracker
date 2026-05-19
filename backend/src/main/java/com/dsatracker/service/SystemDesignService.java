package com.dsatracker.service;

import com.dsatracker.dto.SystemDesignLogRequest;
import com.dsatracker.entity.SystemDesignLog;
import com.dsatracker.entity.User;
import com.dsatracker.repository.SystemDesignLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SystemDesignService {

    private final SystemDesignLogRepository systemDesignLogRepository;

    /**
     * Get all system design logs for a user, keyed by topicId.
     */
    public Map<String, SystemDesignLog> getAllProgress(Integer userId) {
        return systemDesignLogRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(SystemDesignLog::getTopicId, log -> log));
    }

    /**
     * Get progress for a single topic.
     */
    public SystemDesignLog getTopicProgress(Integer userId, String topicId) {
        return systemDesignLogRepository.findByUserIdAndTopicId(userId, topicId)
                .orElse(null);
    }

    /**
     * Upsert progress for a system design topic.
     */
    @Transactional
    public SystemDesignLog upsertProgress(User user, String topicId, SystemDesignLogRequest request) {
        SystemDesignLog log = systemDesignLogRepository.findByUserIdAndTopicId(user.getId(), topicId)
                .orElseGet(() -> SystemDesignLog.builder()
                        .user(user)
                        .topicId(topicId)
                        .build());

        if (request.getStatus() != null) {
            SystemDesignLog.SystemDesignStatus newStatus = SystemDesignLog.SystemDesignStatus.valueOf(request.getStatus());
            log.setStatus(newStatus);
            if (newStatus == SystemDesignLog.SystemDesignStatus.DONE && log.getCompletedAt() == null) {
                log.setCompletedAt(LocalDateTime.now());
            }
        }

        if (request.getNotes() != null) {
            log.setNotes(request.getNotes());
        }

        return systemDesignLogRepository.save(log);
    }

    /**
     * Get stats for the system design dashboard.
     */
    public Map<String, Long> getStats(Integer userId) {
        long done = systemDesignLogRepository.countByUserIdAndStatus(userId, SystemDesignLog.SystemDesignStatus.DONE);
        long inProgress = systemDesignLogRepository.countByUserIdAndStatus(userId, SystemDesignLog.SystemDesignStatus.IN_PROGRESS);
        long notStarted = systemDesignLogRepository.countByUserIdAndStatus(userId, SystemDesignLog.SystemDesignStatus.NOT_STARTED);

        return Map.of(
                "done", done,
                "inProgress", inProgress,
                "notStarted", notStarted,
                "total", done + inProgress + notStarted
        );
    }
}
