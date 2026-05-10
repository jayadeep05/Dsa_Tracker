package com.dsatracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pattern_id", nullable = false)
    private Pattern pattern;

    @Column(nullable = false, length = 300)
    private String name;

    @Column(name = "lc_url", length = 500)
    private String lcUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('E','M','H')")
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('must','strong','optional')")
    private Importance importance;

    @Column(length = 500)
    private String companies;

    @Column(length = 500)
    private String tags;

    @Column(columnDefinition = "TEXT")
    private String insight;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    public enum Difficulty {
        E, M, H
    }

    public enum Importance {
        must, strong, optional
    }
}
