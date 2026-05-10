package com.dsatracker.service;

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
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final QuestionRepository questionRepository;
    private final PatternRepository patternRepository;

    public Progress findOrCreate(Integer questionId, com.dsatracker.entity.User user) {
        return progressRepository.findByUserIdAndQuestionId(user.getId(), questionId)
                .orElseGet(() -> {
                    Question q = questionRepository.findById(questionId)
                            .orElseThrow(() -> new RuntimeException("Question not found: " + questionId));
                    Progress p = Progress.builder().question(q).user(user).build();
                    return progressRepository.save(p);
                });
    }

    public QuestionDto toQuestionDto(Question q, Integer userId) {
        Optional<Progress> progOpt = progressRepository.findByUserIdAndQuestionId(userId, q.getId());
        QuestionDto.QuestionDtoBuilder b = QuestionDto.builder()
                .id(q.getId())
                .patternId(q.getPattern().getId())
                .patternName(q.getPattern().getName())
                .patternSlug(q.getPattern().getSlug())
                .name(q.getName())
                .lcUrl(q.getLcUrl())
                .difficulty(q.getDifficulty().name())
                .importance(q.getImportance().name())
                .companies(q.getCompanies())
                .tags(q.getTags())
                .insight(q.getInsight())
                .displayOrder(q.getDisplayOrder());

        progOpt.ifPresentOrElse(prog -> b
                .status(prog.getStatus().name())
                .confidence(prog.getConfidence() != null ? prog.getConfidence().intValue() : 0)
                .attempts(prog.getAttempts())
                .timeMinutes(prog.getTimeMinutes())
                .personalNote(prog.getPersonalNote())
                .needsRevision(prog.getNeedsRevision())
                .solvedAt(prog.getSolvedAt() != null ? prog.getSolvedAt().toString() : null)
                .lastReviewed(prog.getLastReviewed() != null ? prog.getLastReviewed().toString() : null),
                () -> b.status("not_started").confidence(0).attempts((short) 0).timeMinutes((short) 0)
                        .needsRevision(false));

        return b.build();
    }

    public PatternProgressDto toPatternProgressDto(Pattern pattern, Integer userId) {
        List<Question> questions = questionRepository.findByPatternIdOrderByDisplayOrderAsc(pattern.getId());
        List<Progress> progresses = progressRepository.findByPatternId(userId, pattern.getId());

        Map<Integer, Progress> progressMap = progresses.stream()
                .collect(Collectors.toMap(p -> p.getQuestion().getId(), p -> p));

        int totalQs = questions.size();
        int mustCount = (int) questions.stream().filter(q -> q.getImportance() == Question.Importance.must).count();
        int solved = 0, mustSolved = 0, attempted = 0;
        double confidenceSum = 0;
        int confidenceCount = 0;

        for (Question q : questions) {
            Progress p = progressMap.get(q.getId());
            if (p != null) {
                if (p.getStatus() == Progress.Status.solved) {
                    solved++;
                    if (q.getImportance() == Question.Importance.must)
                        mustSolved++;
                    if (p.getConfidence() != null && p.getConfidence() > 0) {
                        confidenceSum += p.getConfidence();
                        confidenceCount++;
                    }
                } else if (p.getStatus() == Progress.Status.attempted) {
                    attempted++;
                }
            }
        }

        double avgConfidence = confidenceCount > 0 ? confidenceSum / confidenceCount : 0;
        double pct = totalQs > 0 ? (double) solved / totalQs * 100 : 0;
        double mustPct = mustCount > 0 ? (double) mustSolved / mustCount * 100 : 0;

        return PatternProgressDto.builder()
                .id(pattern.getId())
                .name(pattern.getName())
                .slug(pattern.getSlug())
                .prepOrder(pattern.getPrepOrder())
                .weekStart(pattern.getWeekStart())
                .phaseLabel(pattern.getPhaseLabel())
                .subHeading(pattern.getSubHeading())
                .totalQs(totalQs)
                .mustCount(mustCount)
                .solved(solved)
                .mustSolved(mustSolved)
                .attempted(attempted)
                .percentComplete(Math.round(pct * 10.0) / 10.0)
                .mustPercentComplete(Math.round(mustPct * 10.0) / 10.0)
                .avgConfidence(Math.round(avgConfidence * 10.0) / 10.0)
                .build();
    }
}
