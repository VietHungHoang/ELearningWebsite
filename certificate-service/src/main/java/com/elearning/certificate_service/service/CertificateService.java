package com.elearning.certificate_service.service;

import java.util.List;

import com.elearning.certificate_service.dto.request.IssueCertificateRequest;
import com.elearning.certificate_service.dto.response.CertificateResponse;

public interface CertificateService {

    /**
     * Sinh file PDF cho chứng chỉ dựa trên thông tin đầu vào
     */
    byte[] generateCertificatePdf(IssueCertificateRequest request);

    /**
     * Lưu bản ghi certificate vào DB (lúc mới phát hành, chưa có url)
     * → sẽ gọi nội bộ issueAndUploadCertificate
     */
    CertificateResponse saveCertificate(IssueCertificateRequest request);

    /**
     * Lấy thông tin certificate theo id
     */
    CertificateResponse getCertificate(Long id);

    /**
     * Sau khi content-service upload file PDF lên cloud, cập nhật URL cho
     * certificate
     */
    CertificateResponse updateUrl(Long id, String url);

    /**
     * Flow: lưu metadata → sinh PDF → upload → update URL → trả response
     */
    CertificateResponse issueAndUploadCertificate(IssueCertificateRequest request);

    List<CertificateResponse> getCertificatesByLearner(Long learnerId); // profile view

    CertificateResponse getCertificateByLearnerAndCourse(Long learnerId, Long courseId); // course page view
}
