package com.dsatracker.controller;

import com.dsatracker.dto.SystemDesignLogRequest;
import com.dsatracker.entity.SystemDesignLog;
import com.dsatracker.entity.User;
import com.dsatracker.service.SystemDesignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/system-design")
@RequiredArgsConstructor
public class SystemDesignController {

    private final SystemDesignService systemDesignService;

    /**
     * GET /api/system-design/progress — all system design progress for current user
     */
    @GetMapping("/progress")
    public ResponseEntity<Map<String, SystemDesignLog>> getAllProgress(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(systemDesignService.getAllProgress(user.getId()));
    }

    /**
     * GET /api/system-design/progress/{topicId} — single topic progress
     */
    @GetMapping("/progress/{topicId}")
    public ResponseEntity<?> getTopicProgress(
            @AuthenticationPrincipal User user,
            @PathVariable String topicId) {
        SystemDesignLog log = systemDesignService.getTopicProgress(user.getId(), topicId);
        if (log == null) {
            return ResponseEntity.ok(Map.of(
                    "topicId", topicId,
                    "status", "NOT_STARTED",
                    "notes", ""
            ));
        }
        return ResponseEntity.ok(log);
    }

    /**
     * PUT /api/system-design/progress/{topicId} — upsert progress
     */
    @PutMapping("/progress/{topicId}")
    public ResponseEntity<SystemDesignLog> upsertProgress(
            @AuthenticationPrincipal User user,
            @PathVariable String topicId,
            @RequestBody SystemDesignLogRequest request) {
        SystemDesignLog log = systemDesignService.upsertProgress(user, topicId, request);
        return ResponseEntity.ok(log);
    }

    /**
     * GET /api/system-design/stats — summary statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(systemDesignService.getStats(user.getId()));
    }
}
