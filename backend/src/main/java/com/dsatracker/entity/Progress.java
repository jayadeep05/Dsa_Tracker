package com.dsatracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "progress", uniqueConstraints = {@UniqueConstraint(name = "uk_progress_user_question", columnNames = {"user_id", "question_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('not_started','attempted','solved','skipped') DEFAULT 'not_started'")
    @Builder.Default
    private Status status = Status.not_started;

    @Column
    @Builder.Default
    private Byte confidence = 0;

    @Column
    @Builder.Default
    private Short attempts = 0;

    @Column(name = "time_minutes")
    @Builder.Default
    private Short timeMinutes = 0;

    @Column(name = "personal_note", columnDefinition = "TEXT")
    private String personalNote;

    @Column(name = "solved_at")
    private LocalDateTime solvedAt;

    @Column(name = "last_reviewed")
    private LocalDateTime lastReviewed;

    @Column(name = "needs_revision")
    @Builder.Default
    private Boolean needsRevision = false;

    public enum Status {
        not_started, attempted, solved, skipped
    }
}
