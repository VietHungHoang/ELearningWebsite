package com.elearning.transcodingservice.service.impl;

import com.elearning.transcodingservice.config.S3Properties;
import com.elearning.transcodingservice.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

@Service
@Slf4j
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

    private final S3Properties s3Properties;
    private final S3Client s3Client;

    @Override
    public void downloadObject(String bucketName, String objectKey, Path dest) {
        log.info("Downloading s3 object {}/{} to {}", bucketName, objectKey, dest);
        try {
            Files.createDirectories(dest.getParent());
            GetObjectRequest req = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();
            s3Client.getObject(req, dest);

            log.info("Downloaded s3 object {}/{} to {}", bucketName, objectKey, dest);
        } catch (Exception e) {
            log.error("Failed to download s3 object {}/{}", bucketName, objectKey, e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public void uploadObject(String bucketName, String objectKey, Path source) {
        log.info("Uploading file {} to s3 {}/{}", source, bucketName, objectKey);
        try {
            PutObjectRequest req = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();
            s3Client.putObject(req, RequestBody.fromFile(source));
            log.info("Uploaded file {} to s3 {}/{}", source, bucketName, objectKey);
        } catch (Exception e) {
            log.error("Failed to upload file {} to s3 {}/{}", source, bucketName, objectKey, e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public void uploadDirectory(String bucketName, Path directory, String baseKey) {
        log.info("Uploading directory {} to s3 bucket {} with base key {}", directory, bucketName, baseKey);
        try (Stream<Path> paths = Files.walk(directory)) {
            paths.filter(Files::isRegularFile).forEach(file -> {
                String relativePath = directory.relativize(file).toString();
                String objectKey = baseKey + "/" + relativePath;
                uploadObject(bucketName, objectKey, file);
            });
            log.info("Uploaded directory {} to s3 bucket {} with base key {}", directory, bucketName, baseKey);
        } catch (IOException e) {
            log.error("Failed to upload directory {} to s3 bucket {}", directory, bucketName, e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public String getVideosRawBucketName() {
        var cfg = s3Properties.getVideosRawConfig();
        return cfg != null ? cfg.getBucketName() : null;
    }

    @Override
    public String getVideosStreamBucketName() {
        var cfg = s3Properties.getVideosStreamConfig();
        return cfg != null ? cfg.getBucketName() : null;
    }
}
