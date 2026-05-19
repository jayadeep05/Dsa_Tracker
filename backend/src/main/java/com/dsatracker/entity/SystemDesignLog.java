package com.dsatracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "system_design_logs",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "topic_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemDesignLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "topic_id", nullable = false, length = 50)
    private String topicId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private SystemDesignStatus status = SystemDesignStatus.NOT_STARTED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime completedAt;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum SystemDesignStatus {
        NOT_STARTED, IN_PROGRESS, DONE
    }
}
