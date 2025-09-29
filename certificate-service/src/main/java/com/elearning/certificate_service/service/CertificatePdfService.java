package com.elearning.certificate_service.service;

import com.elearning.certificate_service.dto.request.IssueCertificateRequest;

public interface CertificatePdfService {
    byte[] generateCertificate(IssueCertificateRequest request);

}
