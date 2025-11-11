package com.elearning.tutorservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "tutor_subjects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tutor_id", nullable = false)
    private Tutor tutor;

    @Column(name = "category_id", nullable = false)
    private UUID categoryId;

    @Column(name = "subject_name", length = 200, nullable = false)
    private String subjectName;
}