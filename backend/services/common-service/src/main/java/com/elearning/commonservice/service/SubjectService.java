package com.elearning.commonservice.service;

import com.elearning.commonservice.dto.request.SubjectRequest;
import com.elearning.commonservice.dto.response.SubjectResponse;

import java.util.List;
import java.util.UUID;

public interface SubjectService {
    List<SubjectResponse> getAll();

    SubjectResponse create(SubjectRequest request);

    SubjectResponse update(UUID id, SubjectRequest request);

    void delete(UUID id);
}
