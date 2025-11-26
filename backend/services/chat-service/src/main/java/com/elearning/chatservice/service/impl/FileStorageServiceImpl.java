package com.elearning.chatservice.service.impl;

import com.elearning.chatservice.config.FileUploadConfig;
import com.elearning.chatservice.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private final FileUploadConfig fileUploadConfig;

    @Override
    public String storeFile(MultipartFile file, String conversationId) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = FilenameUtils.getExtension(originalFilename);
        String newFilename = UUID.randomUUID().toString() + "." + extension;

        // Create conversation-specific directory
        Path conversationDir = Paths.get(fileUploadConfig.getUploadDirectory(), conversationId);
        if (!Files.exists(conversationDir)) {
            Files.createDirectories(conversationDir);
        }

        Path targetPath = conversationDir.resolve(newFilename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = "/files/" + conversationId + "/" + newFilename;
        log.info("File stored: {}", fileUrl);

        return fileUrl;
    }

    @Override
    public List<String> storeFiles(List<MultipartFile> files, String conversationId) throws IOException {
        List<String> fileUrls = new ArrayList<>();
        
        for (MultipartFile file : files) {
            String fileUrl = storeFile(file, conversationId);
            fileUrls.add(fileUrl);
        }

        return fileUrls;
    }

    @Override
    public void deleteFile(String fileUrl) {
        try {
            Path filePath = Paths.get(fileUploadConfig.getUploadDirectory(), 
                    fileUrl.replace("/files/", ""));
            Files.deleteIfExists(filePath);
            log.info("File deleted: {}", fileUrl);
        } catch (IOException e) {
            log.error("Failed to delete file: {}", fileUrl, e);
        }
    }

    @Override
    public String getFileContentType(String fileName) {
        String extension = FilenameUtils.getExtension(fileName).toLowerCase();
        
        return switch (extension) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "mp4" -> "video/mp4";
            case "webm" -> "video/webm";
            case "pdf" -> "application/pdf";
            case "doc", "docx" -> "application/msword";
            case "xls", "xlsx" -> "application/vnd.ms-excel";
            case "txt" -> "text/plain";
            default -> "application/octet-stream";
        };
    }

    @Override
    public String generateThumbnail(String fileUrl) throws IOException {
        // TODO: Implement thumbnail generation using ImageMagick or similar library
        // For now, return null (thumbnail generation can be implemented later)
        log.warn("Thumbnail generation not yet implemented for: {}", fileUrl);
        return null;
    }
}
