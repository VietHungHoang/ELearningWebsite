package com.elearning.courseservice.service.impl;

import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.elearning.contentservice.config.S3Properties;
import com.elearning.courseservice.service.S3Service;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service{
    private final S3Client s3Client;
    private final S3Properties s3Properties;

    public String uploadFile(MultipartFile file) {
        try {
            // Tạo một key (tên file) duy nhất để tránh bị ghi đè
            String fileExtension = getFileExtension(file.getOriginalFilename());
            String key = UUID.randomUUID().toString() + fileExtension;

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3Properties.getBucketName())
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // Trả về URL của file vừa upload
            return String.format("https://%s.s3.%s.amazonaws.com/%s", s3Properties.getBucketName(), s3Properties.getRegion(), key);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName != null && fileName.lastIndexOf(".") != -1) {
            return fileName.substring(fileName.lastIndexOf("."));
        }
        return "";
    }
}
