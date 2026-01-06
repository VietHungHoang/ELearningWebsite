package com.elearning.classservice.service.impl;

import com.elearning.classservice.dto.request.ClassMaterialRequest;
import com.elearning.classservice.dto.response.ClassDetailResponse.MaterialInfo;
import com.elearning.classservice.entity.ClassEntity;
import com.elearning.classservice.entity.ClassMaterial;
import com.elearning.classservice.repository.ClassMaterialRepository;
import com.elearning.classservice.repository.ClassRepository;
import com.elearning.classservice.service.ClassMaterialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassMaterialServiceImpl implements ClassMaterialService {

    private final ClassRepository classRepository;
    private final ClassMaterialRepository classMaterialRepository;

    @Override
    @Transactional
    public MaterialInfo addMaterial(UUID userId, UUID classId, ClassMaterialRequest request) {
        log.info("Adding material to class {} by user {}", classId, userId);

        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        if (!classEntity.getTutor().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You are not the tutor of this class");
        }

        ClassMaterial material = ClassMaterial.builder()
                .classEntity(classEntity)
                .name(request.getName())
                .type(request.getType())
                .s3Url(request.getS3Url())
                .fileSize(request.getFileSize())
                .description(request.getDescription())
                .uploadDate(LocalDate.now())
                .build();

        material = classMaterialRepository.save(material);
        log.info("Material saved with ID: {}", material.getId());

        return MaterialInfo.builder()
                .id(material.getId())
                .name(material.getName())
                .type(material.getType())
                .s3Url(material.getS3Url())
                .uploadDate(material.getUploadDate())
                .fileSize(material.getFileSize())
                .description(material.getDescription())
                .build();
    }

    @Override
    @Transactional
    public void deleteMaterial(UUID userId, UUID classId, UUID materialId) {
        log.info("Deleting material {} from class {} by user {}", materialId, classId, userId);

        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        if (!classEntity.getTutor().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You are not the tutor of this class");
        }

        ClassMaterial material = classMaterialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        if (!material.getClassEntity().getId().equals(classId)) {
            throw new RuntimeException("Material does not belong to this class");
        }

        classMaterialRepository.delete(material);
        log.info("Material deleted successfully");
    }

    private String formatFileSize(Long bytes) {
        if (bytes == null || bytes == 0)
            return "0 Bytes";
        long k = 1024;
        String[] sizes = { "Bytes", "KB", "MB", "GB" };
        int i = (int) Math.floor(Math.log(bytes) / Math.log(k));
        return String.format("%.2f %s", bytes / Math.pow(k, i), sizes[i]);
    }
}
