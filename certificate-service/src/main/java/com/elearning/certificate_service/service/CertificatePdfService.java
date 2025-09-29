package com.elearning.certificate_service.service;

import com.elearning.certificate_service.dto.request.CertificatePreviewRequest;

public interface CertificatePdfService {
    byte[] generateCertificate(String learnerName, String courseName, String instructorName);

    byte[] generateCourseraStyleCertificate(CertificatePreviewRequest request);
}
