package com.dsatracker.controller;

import com.dsatracker.dto.PatternProgressDto;
import com.dsatracker.dto.QuestionDto;
import com.dsatracker.entity.Pattern;
import com.dsatracker.repository.PatternRepository;
import com.dsatracker.repository.QuestionRepository;
import com.dsatracker.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patterns")
@RequiredArgsConstructor
public class PatternController {

    private final PatternRepository patternRepository;
    private final QuestionRepository questionRepository;
    private final ProgressService progressService;

    @GetMapping
    public List<PatternProgressDto> getAllPatterns(@org.springframework.security.core.annotation.AuthenticationPrincipal com.dsatracker.entity.User user) {
        return patternRepository.findAllByOrderByPrepOrderAsc().stream()
                .map(p -> progressService.toPatternProgressDto(p, user != null ? user.getId() : null))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<List<QuestionDto>> getQuestionsForPattern(@PathVariable Integer id, @org.springframework.security.core.annotation.AuthenticationPrincipal com.dsatracker.entity.User user) {
        List<QuestionDto> questions = questionRepository.findByPatternIdOrderByDisplayOrderAsc(id)
                .stream()
                .map(q -> progressService.toQuestionDto(q, user != null ? user.getId() : null))
                .collect(Collectors.toList());
        return ResponseEntity.ok(questions);
    }
}
