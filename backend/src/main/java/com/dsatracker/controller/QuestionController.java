package com.dsatracker.controller;

import com.dsatracker.dto.ProgressUpdateRequest;
import com.dsatracker.dto.QuestionDto;
import com.dsatracker.entity.DailyLog;
import com.dsatracker.entity.Progress;
import com.dsatracker.entity.Question;
import com.dsatracker.repository.DailyLogRepository;
import com.dsatracker.repository.ProgressRepository;
import com.dsatracker.repository.QuestionRepository;
import com.dsatracker.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionRepository questionRepository;
    private final ProgressRepository progressRepository;
    private final DailyLogRepository dailyLogRepository;
    private final ProgressService progressService;

    @GetMapping("/{id}")
    public ResponseEntity<QuestionDto> getQuestion(@PathVariable Integer id,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsatracker.entity.User user) {
        return questionRepository.findById(id)
                .map(questionObj -> progressService.toQuestionDto(questionObj, user.getId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<QuestionDto> updateProgress(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsatracker.entity.User user,
            @PathVariable Integer id,
            @RequestBody ProgressUpdateRequest req) {

        Progress progress = progressService.findOrCreate(id, user);
        boolean wasSolved = progress.getStatus() == Progress.Status.solved;

        if (req.getStatus() != null) {
            progress.setStatus(Progress.Status.valueOf(req.getStatus()));
        }
        // Confidence only updates confidence - must NOT change status
        if (req.getConfidence() != null) {
            progress.setConfidence(req.getConfidence().byteValue());
        }
        if (req.getTimeMinutes() != null) {
            progress.setTimeMinutes(req.getTimeMinutes().shortValue());
        }
        if (req.getTimeSeconds() != null) {
            progress.setTimeSeconds(req.getTimeSeconds().shortValue());
        }
        if (req.getPersonalNote() != null) {
            progress.setPersonalNote(req.getPersonalNote());
        }
        if (req.getBruteNotes() != null) {
            progress.setBruteNotes(req.getBruteNotes());
        }
        if (req.getOptimalNotes() != null) {
            progress.setOptimalNotes(req.getOptimalNotes());
        }
        if (req.getNeedsRevision() != null) {
            progress.setNeedsRevision(req.getNeedsRevision());
        }

        boolean nowSolved = progress.getStatus() == Progress.Status.solved;
        if (nowSolved && progress.getSolvedAt() == null) {
            progress.setSolvedAt(LocalDateTime.now());
        }
        progress.setLastReviewed(LocalDateTime.now());

        // Increment attempts
        if (progress.getAttempts() == null)
            progress.setAttempts((short) 0);
        progress.setAttempts((short) (progress.getAttempts() + 1));

        progressRepository.save(progress);

        // Update daily log
        if (nowSolved && !wasSolved) {
            updateDailyLog(1, user);
        } else if (!nowSolved && wasSolved) {
            updateDailyLog(-1, user);
        } else if (req.getPersonalNote() != null && req.getStatus() != null && req.getStatus().equals("not_started")) {
            // Notes updated but not solved, we can log an attempt
            updateDailyLog(0, user);
        } else if (req.getStatus() != null
                && (req.getStatus().equals("attempted") || req.getStatus().equals("solved"))) {
            updateDailyLog(0, user);
        }

        Question q = questionRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(progressService.toQuestionDto(q, user.getId()));
    }

    @GetMapping("/search")
    public List<QuestionDto> search(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsatracker.entity.User user,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer pattern,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String importance,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String company) {

        Question.Difficulty diff = null;
        if (difficulty != null && !difficulty.isBlank()) {
            try {
                diff = Question.Difficulty.valueOf(difficulty);
            } catch (Exception ignored) {
            }
        }
        Question.Importance imp = null;
        if (importance != null && !importance.isBlank()) {
            try {
                imp = Question.Importance.valueOf(importance);
            } catch (Exception ignored) {
            }
        }

        return questionRepository.searchQuestions(
                (q != null && q.isBlank()) ? null : q,
                pattern, diff, imp,
                (tag != null && tag.isBlank()) ? null : tag,
                (company != null && company.isBlank()) ? null : company)
                .stream()
                .map(questionObj -> progressService.toQuestionDto(questionObj, user.getId()))
                .collect(Collectors.toList());
    }

    @GetMapping("/needs-revision")
    public List<QuestionDto> getNeedsRevision(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsatracker.entity.User user) {
        return progressRepository.findNeedsRevision(user.getId()).stream()
                .map(p -> progressService.toQuestionDto(p.getQuestion(), user.getId()))
                .collect(Collectors.toList());
    }

    private void updateDailyLog(int solvedDelta, com.dsatracker.entity.User user) {
        LocalDate today = LocalDate.now();
        DailyLog log = dailyLogRepository.findByUserIdAndLogDate(user.getId(), today)
                .orElseGet(() -> dailyLogRepository.save(
                        DailyLog.builder().user(user).logDate(today).qsSolved(0).qsAttempted(0).minutesSpent(0)
                                .build()));

        if (log.getQsSolved() == null)
            log.setQsSolved(0);
        if (log.getQsAttempted() == null)
            log.setQsAttempted(0);

        log.setQsSolved(Math.max(0, log.getQsSolved() + solvedDelta));
        log.setQsAttempted(log.getQsAttempted() + 1);
        dailyLogRepository.save(log);
    }
}
