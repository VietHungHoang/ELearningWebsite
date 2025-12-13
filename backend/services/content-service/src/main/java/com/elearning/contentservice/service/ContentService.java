package com.elearning.contentservice.service;

import com.elearning.contentservice.dto.response.SectionResponse;
import com.elearning.contentservice.model.Section;

import java.util.List;

public interface ContentService {
    List<SectionResponse> getSectionsByCourseId(Long courseId);
    
    Section createBaseSectionForNewCourse(Long courseId);
}