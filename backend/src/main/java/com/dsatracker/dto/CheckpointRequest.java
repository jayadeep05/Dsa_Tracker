package com.dsatracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CheckpointRequest {
    private Integer score;
    private Integer totalItems;
    private String responses;
}
