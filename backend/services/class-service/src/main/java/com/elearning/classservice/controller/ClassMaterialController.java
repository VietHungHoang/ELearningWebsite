// package com.elearning.classservice.controller;

// import com.elearning.classservice.dto.request.ClassMaterialRequest;
// import
// com.elearning.classservice.dto.response.ClassDetailResponse.MaterialInfo;
// import com.elearning.classservice.service.ClassMaterialService;
// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.HttpStatus;
// import org.springframework.web.bind.annotation.*;

// import java.util.UUID;

// @RestController
// @RequestMapping("/api/v1/classes/{classId}/materials")
// @RequiredArgsConstructor
// public class ClassMaterialController {

// private final ClassMaterialService classMaterialService;

// @PostMapping
// public ResponseEntity addMaterial(
// @RequestHeader("X-User-Id") String userId,
// @PathVariable UUID classId,
// @Valid @RequestBody ClassMaterialRequest request) {
// MaterialInfo material =
// classMaterialService.addMaterial(UUID.fromString(userId), classId, request);
// return ApiResponse.success(material, "Material added successfully");
// }

// @DeleteMapping("/{materialId}")
// public ApiResponse<Void> deleteMaterial(
// @RequestHeader("X-User-Id") String userId,
// @PathVariable UUID classId,
// @PathVariable UUID materialId) {
// classMaterialService.deleteMaterial(UUID.fromString(userId), classId,
// materialId);
// return ApiResponse.success(null, "Material deleted successfully");
// }
// }
