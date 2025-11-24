package com.elearning.commonservice.service;

import com.elearning.commonservice.dto.response.SubjectResponse;

import java.util.List;

public interface SubjectService {
    List<SubjectResponse> getAll();
}