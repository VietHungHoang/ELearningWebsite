package com.elearning.quiz.certificate.service;

import com.elearning.quiz.certificate.dto.CertificatePreviewRequest;

public interface CertificatePdfService {
    byte[] generateCourseraStyleCertificate(CertificatePreviewRequest request);
}


