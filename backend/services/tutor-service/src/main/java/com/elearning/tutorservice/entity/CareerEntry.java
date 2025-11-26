package com.elearning.tutorservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;

@Entity
@Table(name = "career_entries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CareerEntry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tutor_id", nullable = false)
    private Tutor tutor;

    @Column(nullable = false, length = 20)
    private String type; // 'EDUCATION' or 'EXPERIENCE'

    @Column(nullable = false)
    private String title; // Degree name or Position

    @Column(nullable = false)
    private String institution; // School or Company name

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate; // Null if ongoing

    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;
}