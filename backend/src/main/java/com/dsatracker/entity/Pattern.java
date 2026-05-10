package com.dsatracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "patterns")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pattern {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50, unique = true)
    private String slug;

    @Column(name = "prep_order", nullable = false)
    private Integer prepOrder;

    @Column(name = "week_start", nullable = false)
    private Integer weekStart;

    @Column(name = "phase_label", length = 100)
    private String phaseLabel;

    @Column(name = "sub_heading", length = 200)
    private String subHeading;

    @Column(name = "total_qs")
    private Integer totalQs = 0;

    @Column(name = "must_count")
    private Integer mustCount = 0;
}
