package com.elearning.commonservice.mapper;

import com.elearning.commonservice.dto.response.SubjectResponse;
import com.elearning.commonservice.entity.Subject;
import org.springframework.stereotype.Component;

@Component
public class SubjectMapper {

    public SubjectResponse toResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .nameVi(subject.getNameVi())
                .nameEn(subject.getNameEn())
                .categoryId(subject.getCategory() != null ? subject.getCategory().getId() : null)
                .createdAt(subject.getCreatedAt())
                .updatedAt(subject.getUpdatedAt())
                .build();
    }
}