package com.dsatracker.controller;

import com.dsatracker.dto.CheckpointRequest;
import com.dsatracker.dto.ConceptLogRequest;
import com.dsatracker.entity.CheckpointResult;
import com.dsatracker.entity.ConceptLog;
import com.dsatracker.entity.User;
import com.dsatracker.service.BackendPrepService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/backend")
@RequiredArgsConstructor
public class BackendPrepController {

    private final BackendPrepService backendPrepService;

    /**
     * GET /api/backend/progress — all concept logs for current user
     */
    @GetMapping("/progress")
    public ResponseEntity<Map<String, ConceptLog>> getAllProgress(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(backendPrepService.getAllProgress(user.getId()));
    }

    /**
     * GET /api/backend/progress/{topicId} — single topic progress
     */
    @GetMapping("/progress/{topicId}")
    public ResponseEntity<?> getTopicProgress(
            @AuthenticationPrincipal User user,
            @PathVariable String topicId) {
        ConceptLog log = backendPrepService.getTopicProgress(user.getId(), topicId);
        if (log == null) {
            return ResponseEntity.ok(Map.of(
                    "topicId", topicId,
                    "status", "NOT_STARTED",
                    "notes", "",
                    "failureSimDone", false
            ));
        }
        return ResponseEntity.ok(log);
    }

    /**
     * PUT /api/backend/progress/{topicId} — upsert progress
     */
    @PutMapping("/progress/{topicId}")
    public ResponseEntity<ConceptLog> upsertProgress(
            @AuthenticationPrincipal User user,
            @PathVariable String topicId,
            @RequestBody ConceptLogRequest request) {
        ConceptLog log = backendPrepService.upsertProgress(user, topicId, request);
        return ResponseEntity.ok(log);
    }

    /**
     * GET /api/backend/checkpoint/{phaseId} — get checkpoint results
     */
    @GetMapping("/checkpoint/{phaseId}")
    public ResponseEntity<List<CheckpointResult>> getCheckpointResults(
            @AuthenticationPrincipal User user,
            @PathVariable String phaseId) {
        return ResponseEntity.ok(backendPrepService.getCheckpointResults(user.getId(), phaseId));
    }

    /**
     * POST /api/backend/checkpoint/{phaseId} — submit checkpoint
     */
    @PostMapping("/checkpoint/{phaseId}")
    public ResponseEntity<CheckpointResult> submitCheckpoint(
            @AuthenticationPrincipal User user,
            @PathVariable String phaseId,
            @RequestBody CheckpointRequest request) {
        CheckpointResult result = backendPrepService.submitCheckpoint(user, phaseId, request);
        return ResponseEntity.status(201).body(result);
    }

    /**
     * GET /api/backend/stats — summary stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(backendPrepService.getStats(user.getId()));
    }
}
