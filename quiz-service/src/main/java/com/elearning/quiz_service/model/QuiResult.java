package com.elearning.quiz_service.model;

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

    private Long userId; // giả định bạn có userId từ service auth

    private int score;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;
}