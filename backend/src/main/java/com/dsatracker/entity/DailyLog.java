package com.dsatracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "daily_log", uniqueConstraints = {@UniqueConstraint(name = "uk_dailylog_user_date", columnNames = {"user_id", "log_date"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "log_date")
    private LocalDate logDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "qs_solved")
    @Builder.Default
    private Integer qsSolved = 0;

    @Column(name = "qs_attempted")
    @Builder.Default
    private Integer qsAttempted = 0;

    @Column(name = "minutes_spent")
    @Builder.Default
    private Integer minutesSpent = 0;

    @Column(length = 500)
    private String note;
}
