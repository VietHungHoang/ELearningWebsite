package com.elearning.certificate_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long learnerId;
    private Long courseId;
    private Long instructorId;
    private String url;

    @CreationTimestamp
    private LocalDateTime issuedAt;  // tự động điền thời gian tạo
}

