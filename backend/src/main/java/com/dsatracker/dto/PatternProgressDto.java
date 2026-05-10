package com.dsatracker.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatternProgressDto {
    private Integer id;
    private String name;
    private String slug;
    private Integer prepOrder;
    private Integer weekStart;
    private String phaseLabel;
    private String subHeading;
    private int totalQs;
    private int mustCount;
    private int solved;
    private int mustSolved;
    private int attempted;
    private double percentComplete;
    private double mustPercentComplete;
    private double avgConfidence;
}
