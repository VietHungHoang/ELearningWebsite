package com.elearning.certificate_service.service.impl;

import com.elearning.certificate_service.dto.request.IssueCertificateRequest;
import com.elearning.certificate_service.dto.response.CertificateResponse;
import com.elearning.certificate_service.model.Certificate;
import com.elearning.certificate_service.repository.CertificateRepository;
import com.elearning.certificate_service.service.CertificatePdfService;
import com.elearning.certificate_service.service.CertificateService;
import com.elearning.certificate_service.util.ContentUploader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final CertificatePdfService certificatePdfService;
    private final ContentUploader contentUploader;

    @Override
    public byte[] generateCertificatePdf(IssueCertificateRequest request) {
        // nếu cần default fallback, set trực tiếp vào request
        if (request.getLearnerName() == null) {
            request.setLearnerName("Student #" + request.getLearnerId());
        }
        if (request.getCourseName() == null) {
            request.setCourseName("Course #" + request.getCourseId());
        }
        if (request.getInstructorName() == null) {
            request.setInstructorName("Instructor #N/A");
        }

        return certificatePdfService.generateCertificate(request);
    }

    @Override
    public CertificateResponse issueAndUploadCertificate(IssueCertificateRequest request) {
        // 1. Lưu metadata certificate với status PENDING
        Certificate cert = Certificate.builder()
                .learnerId(request.getLearnerId())
                .courseId(request.getCourseId())
                .instructorId(request.getInstructorId())
                .issuedAt(LocalDateTime.now())
                .url(null) // chưa có URL
                .build();

        Certificate saved = certificateRepository.save(cert);

        // 2. Sinh PDF
        byte[] pdfBytes = generateCertificatePdf(request);

        // 3. Upload bất đồng bộ (không chờ kết quả)
        uploadAndUpdateAsync(saved.getId(), pdfBytes);

        // 4. Trả về certificate với trạng thái PENDING
        return mapToResponse(saved);
    }

    // === Async upload ===
    @Async
    public CompletableFuture<Void> uploadAndUpdateAsync(Long certId, byte[] pdfBytes) {
        return CompletableFuture.runAsync(() -> {
            try {
                log.info("Start async upload for cert #{}", certId);
                String fileUrl = contentUploader.uploadPdf("certificate-" + certId + ".pdf", pdfBytes);

                // Sau khi upload xong → update URL
                updateUrl(certId, fileUrl);
                log.info("Upload finished and URL updated for cert #{}", certId);
            } catch (Exception e) {
                log.error("Upload failed for cert #{}: {}", certId, e.getMessage(), e);
            }
        });
    }

    @Override
    public CertificateResponse saveCertificate(IssueCertificateRequest request) {
        return issueAndUploadCertificate(request);
    }

    @Override
    public CertificateResponse updateUrl(Long id, String url) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + id));
        cert.setUrl(url);
        Certificate updated = certificateRepository.save(cert);
        return mapToResponse(updated);
    }

    @Override
    public CertificateResponse getCertificate(Long id) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + id));
        return mapToResponse(cert);
    }

    @Override
    public List<CertificateResponse> getCertificatesByLearner(Long learnerId) {
        return certificateRepository.findByLearnerId(learnerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CertificateResponse getCertificateByLearnerAndCourse(Long learnerId, Long courseId) {
        Certificate cert = certificateRepository.findByLearnerIdAndCourseId(learnerId, courseId)
                .orElseThrow(() -> new RuntimeException("Certificate not found for learner and course"));
        return mapToResponse(cert);
    }

    private CertificateResponse mapToResponse(Certificate cert) {
        return CertificateResponse.builder()
                .id(cert.getId())
                .learnerId(cert.getLearnerId())
                .courseId(cert.getCourseId())
                .instructorId(cert.getInstructorId())
                .issuedAt(cert.getIssuedAt())
                .url(cert.getUrl())
                .status(cert.getUrl() == null ? "PENDING" : "ACTIVE")
                .build();
    }
}
