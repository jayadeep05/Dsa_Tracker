package com.dsatracker.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionDto {
    private Integer id;
    private Integer patternId;
    private String patternName;
    private String patternSlug;
    private String name;
    private String lcUrl;
    private String difficulty;
    private String importance;
    private String companies;
    private String tags;
    private String insight;
    private Integer displayOrder;
    // Progress fields
    private String status;
    private Integer confidence;
    private Short attempts;
    private Short timeMinutes;
    private Short timeSeconds;
    private String personalNote;
    private String bruteNotes;
    private String optimalNotes;
    private Boolean needsRevision;
    private String solvedAt;
    private String lastReviewed;
}
