package com.elearning.quiz_service.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class QuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private int score;

    private LocalDateTime submittedAt;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;
}
