package com.dsatracker.service;

import com.dsatracker.dto.DashboardResponse;
import com.dsatracker.dto.PatternProgressDto;
import com.dsatracker.dto.QuestionDto;
import com.dsatracker.entity.Pattern;
import com.dsatracker.entity.Progress;
import com.dsatracker.entity.Question;
import com.dsatracker.repository.PatternRepository;
import com.dsatracker.repository.ProgressRepository;
import com.dsatracker.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PatternRepository patternRepository;
    private final QuestionRepository questionRepository;
    private final ProgressRepository progressRepository;
    private final StreakService streakService;
    private final ProgressService progressService;

    public DashboardResponse getDashboard(Integer userId) {
        List<Pattern> patterns = patternRepository.findAllByOrderByPrepOrderAsc();

        long totalQuestions = questionRepository.count();
        long solved = progressRepository.countSolved(userId);
        long attempted = progressRepository.countAttempted(userId);
        long mustSolved = progressRepository.countMustSolved(userId);
        long mustTotal = questionRepository.findMustQuestionsOrdered().size();

        double percentComplete = totalQuestions > 0 ? Math.round((double) solved / totalQuestions * 1000) / 10.0 : 0;

        int currentStreak = streakService.getCurrentStreak(userId);
        int longestStreak = streakService.getLongestStreak(userId);
        int todaySolved = streakService.getTodaySolved(userId);

        List<PatternProgressDto> patternProgress = patterns.stream()
                .map(p -> progressService.toPatternProgressDto(p, userId))
                .collect(Collectors.toList());

        // Weak patterns: avg confidence < 2.5 among patterns that have at least one solved
        List<PatternProgressDto> weakPatterns = patternProgress.stream()
                .filter(p -> p.getSolved() > 0 && p.getAvgConfidence() < 2.5)
                .sorted((a, b) -> Double.compare(a.getAvgConfidence(), b.getAvgConfidence()))
                .collect(Collectors.toList());

        // Next recommended: first must not_started in lowest prep_order pattern with <100% must-do
        QuestionDto nextRecommended = findNextRecommended(patterns, userId);

        return DashboardResponse.builder()
                .totalQuestions(totalQuestions)
                .solved(solved)
                .attempted(attempted)
                .mustSolved(mustSolved)
                .mustTotal(mustTotal)
                .percentComplete(percentComplete)
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .todaySolved(todaySolved)
                .patternProgress(patternProgress)
                .weakPatterns(weakPatterns)
                .nextRecommended(nextRecommended)
                .build();
    }

    private QuestionDto findNextRecommended(List<Pattern> patterns, Integer userId) {
        for (Pattern pattern : patterns) {
            List<Question> mustQuestions = questionRepository.findByPatternIdOrderByDisplayOrderAsc(pattern.getId())
                    .stream()
                    .filter(q -> q.getImportance() == Question.Importance.must)
                    .collect(Collectors.toList());

            if (mustQuestions.isEmpty()) continue;

            // Load all progress for this pattern in ONE query
            List<Progress> patternProgress = progressRepository.findByPatternId(userId, pattern.getId());
            java.util.Map<Integer, Progress> progressMap = patternProgress.stream()
                    .collect(java.util.stream.Collectors.toMap(
                            p -> p.getQuestion().getId(), p -> p
                    ));

            long mustSolvedInPattern = mustQuestions.stream()
                    .filter(q -> {
                        Progress p = progressMap.get(q.getId());
                        return p != null && p.getStatus() == Progress.Status.solved;
                    })
                    .count();

            if (mustSolvedInPattern < mustQuestions.size()) {
                for (Question q : mustQuestions) {
                    Progress p = progressMap.get(q.getId());
                    boolean isNotStarted = p == null || p.getStatus() == Progress.Status.not_started;
                    if (isNotStarted) {
                        return progressService.toQuestionDto(q, userId);
                    }
                }
            }
        }
        return null;
    }
}
