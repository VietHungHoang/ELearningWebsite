package com.elearning.certificate_service.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * ContentUploader: lớp tiện ích để giao tiếp với content-service
 * nhằm upload file PDF và nhận lại URL lưu trữ.
 */
@Component
public class ContentUploader {

    private final RestTemplate restTemplate;

    // Lấy URL của content-service từ file application.properties
    @Value("${content.service.url}")
    private String contentServiceUrl;

    public ContentUploader(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Upload PDF sang content-service
     *
     * @param fileName tên file PDF
     * @param pdfBytes nội dung PDF dưới dạng byte[]
     * @return URL file sau khi upload thành công
     */
    public String uploadPdf(String fileName, byte[] pdfBytes) {
        // Mã hóa PDF thành Base64
        String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);

        // Body của request
        Map<String, Object> body = new HashMap<>();
        body.put("fileName", fileName);
        body.put("fileData", base64Pdf);

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        // Gọi API content-service với ParameterizedTypeReference
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                contentServiceUrl,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {
                });

        // Kiểm tra kết quả
        Map<String, Object> responseBody = response.getBody(); // lấy body ra 1 lần

        if (response.getStatusCode().is2xxSuccessful()
                && responseBody != null
                && responseBody.get("url") != null) {

            return responseBody.get("url").toString(); // dùng biến đã kiểm tra
        } else {
            throw new RuntimeException("Upload failed! Response: " + response);
        }
    }

}
