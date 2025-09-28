package com.elearning.quiz.certificate.controller;

import com.elearning.quiz.certificate.dto.CertificatePreviewRequest;
import com.elearning.quiz.certificate.service.CertificatePdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificatePdfService certificatePdfService;

    public CertificateController(CertificatePdfService certificatePdfService) {
        this.certificatePdfService = certificatePdfService;
    }

    @PostMapping(value = "/preview", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> preview(@RequestBody CertificatePreviewRequest request) {
        byte[] pdf = certificatePdfService.generateCourseraStyleCertificate(request);
        return ResponseEntity
            .ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=certificate-preview.pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }
}


