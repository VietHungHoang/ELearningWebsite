package com.elearning.certificate_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateResponse {
    private Long id;
    private Long learnerId;
    private Long courseId;
    private Long instructorId;

    private LocalDateTime issuedAt;
    private String url;
    private String status;
}