package com.elearning.testservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "tutor_languages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorLanguage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tutor_id", nullable = false)
    private Tutor tutor;

    @Column(name = "language_code", length = 5, nullable = false)
    private String languageCode;

    @Column(name = "proficiency_level", nullable = false)
    private String proficiencyLevel;
}