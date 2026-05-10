package com.dsatracker.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    private long totalQuestions;
    private long solved;
    private long attempted;
    private long mustSolved;
    private long mustTotal;
    private double percentComplete;
    private int currentStreak;
    private int longestStreak;
    private int todaySolved;
    private List<PatternProgressDto> patternProgress;
    private List<PatternProgressDto> weakPatterns;
    private QuestionDto nextRecommended;
}
