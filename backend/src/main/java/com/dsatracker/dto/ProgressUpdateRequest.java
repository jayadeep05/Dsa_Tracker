package com.dsatracker.dto;

import lombok.Data;

@Data
public class ProgressUpdateRequest {
    private String status;
    private Integer confidence;
    private Integer timeMinutes;
    private Integer timeSeconds;
    private String personalNote;
    private String bruteNotes;
    private String optimalNotes;
    private Boolean needsRevision;
}
