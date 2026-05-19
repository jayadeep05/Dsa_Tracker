package com.dsatracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConceptLogRequest {
    private String status;
    private String notes;
    private Boolean failureSimDone;
}
