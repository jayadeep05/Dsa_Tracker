package com.dsatracker.dto;

import lombok.Data;

@Data
public class ProgressUpdateRequest {
    private String status;
    private Integer confidence;
    private Integer timeMinutes;
    private String personalNote;
    private Boolean needsRevision;
}
