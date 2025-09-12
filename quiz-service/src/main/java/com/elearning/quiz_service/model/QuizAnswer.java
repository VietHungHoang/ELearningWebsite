package com.elearning.quiz_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String answerText;
    private boolean correct;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private QuizQuestion question;
}
