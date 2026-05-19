package com.dsatracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "backend_checkpoint_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckpointResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "phase_id", nullable = false, length = 20)
    private String phaseId;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Integer totalItems;

    @Column(columnDefinition = "TEXT")
    private String responses;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime attemptedAt = LocalDateTime.now();
}
