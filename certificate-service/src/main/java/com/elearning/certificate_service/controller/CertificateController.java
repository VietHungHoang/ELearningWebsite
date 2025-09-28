package com.elearning.certificate_service.controller;

import com.elearning.certificate_service.dto.request.IssueCertificateRequest;
import com.elearning.certificate_service.dto.response.ApiResponse;
import com.elearning.certificate_service.dto.response.CertificateResponse;
import com.elearning.certificate_service.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

        private final CertificateService certificateService;

        /**
         * 1. Sinh và upload certificate
         */
        @PostMapping("/issue")
        public ResponseEntity<ApiResponse<CertificateResponse>> issueCertificate(
                        @RequestBody IssueCertificateRequest request) {

                // Toàn bộ logic sinh PDF + upload nằm trong service
                CertificateResponse result = certificateService.issueAndUploadCertificate(request);

                ApiResponse<CertificateResponse> response = ApiResponse.<CertificateResponse>builder()
                                .status(HttpStatus.OK.value())
                                .message("Certificate issued and uploaded successfully")
                                .data(result)
                                .build();

                return ResponseEntity.ok(response);
        }

        /**
         * 2. Lấy danh sách certificate theo learner
         */
        @GetMapping("/learner/{learnerId}")
        public ResponseEntity<ApiResponse<List<CertificateResponse>>> getCertificatesByLearner(
                        @PathVariable Long learnerId) {
                List<CertificateResponse> certs = certificateService.getCertificatesByLearner(learnerId);
                ApiResponse<List<CertificateResponse>> response = ApiResponse.<List<CertificateResponse>>builder()
                                .status(HttpStatus.OK.value())
                                .message("Get learner certificates successfully")
                                .data(certs)
                                .build();
                return ResponseEntity.ok(response);
        }

        /**
         * 3. Lấy certificate theo learner và course
         */
        @GetMapping("/course/{courseId}/learner/{learnerId}")
        public ResponseEntity<ApiResponse<CertificateResponse>> getCertificateByCourse(
                        @PathVariable Long courseId,
                        @PathVariable Long learnerId) {
                CertificateResponse cert = certificateService.getCertificateByLearnerAndCourse(learnerId, courseId);
                ApiResponse<CertificateResponse> response = ApiResponse.<CertificateResponse>builder()
                                .status(HttpStatus.OK.value())
                                .message("Get certificate for course successfully")
                                .data(cert)
                                .build();
                return ResponseEntity.ok(response);
        }
}
