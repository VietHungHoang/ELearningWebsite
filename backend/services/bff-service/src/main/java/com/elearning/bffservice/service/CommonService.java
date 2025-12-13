package com.elearning.bffservice.service;

import com.elearning.bffservice.dto.response.SubjectResponse;
import com.elearning.bffservice.dto.response.TutorFilterResponse;
import com.elearning.bffservice.dto.response.TutorProfileResponse;

import java.util.List;
import java.util.UUID;

public interface CommonService {
    TutorFilterResponse getTutorFilter();
    List<SubjectResponse> getAllSubjects();
}