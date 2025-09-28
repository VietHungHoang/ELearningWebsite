package com.elearning.certificate_service.service;

public interface CertificatePdfService {
    byte[] generateCertificate(String learnerName, String courseName, String instructorName);
}
