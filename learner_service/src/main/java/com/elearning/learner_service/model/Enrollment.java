package com.elearning.learner_service.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "enrollments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long accountId;
    private Long courseId;

    // enrolled / active / complete
    private String status;

    private Long enrolledAt;
    private Long startedAt;
    private Long completedAt;
}
