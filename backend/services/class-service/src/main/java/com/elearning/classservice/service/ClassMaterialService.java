package com.elearning.classservice.service;

import com.elearning.classservice.dto.request.ClassMaterialRequest;
import com.elearning.classservice.dto.response.ClassDetailResponse.MaterialInfo;

import java.util.UUID;

public interface ClassMaterialService {
    MaterialInfo addMaterial(UUID userId, UUID classId, ClassMaterialRequest request);

    void deleteMaterial(UUID userId, UUID classId, UUID materialId);
}
