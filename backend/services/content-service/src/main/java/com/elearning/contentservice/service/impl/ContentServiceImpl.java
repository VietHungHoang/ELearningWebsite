package com.elearning.contentservice.service.impl;

import com.elearning.contentservice.dto.response.LectureResponse;
import com.elearning.contentservice.dto.response.SectionResponse;
import com.elearning.contentservice.model.Lesson;
import com.elearning.contentservice.model.Section;
import com.elearning.contentservice.repository.LessonRepository;
import com.elearning.contentservice.repository.SectionRepository;
import com.elearning.contentservice.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentServiceImpl implements ContentService {
    
    private final SectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    
    @Override
    public List<SectionResponse> getSectionsByCourseId(Long courseId) {
        List<Section> sections = sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        
        return sections.stream()
                .map(this::mapToSectionResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Section createBaseSectionForNewCourse(Long courseId) {
        Section baseSection = Section.builder()
                .courseId(courseId)
                .title("Introduction")
                .description("Welcome to this course! This is your introduction section.")
                .orderIndex(1)
                .isActive(true)
                .estimatedDurationMinutes(0)
                .build();
                
        return sectionRepository.save(baseSection);
    }
    
    private SectionResponse mapToSectionResponse(Section section) {
        List<Lesson> lessons = lessonRepository.findBySectionIdOrderByOrderIndexAsc(section.getId());
        
        List<LectureResponse> lectureResponses = lessons.stream()
                .map(this::mapToLectureResponse)
                .collect(Collectors.toList());
        
        return SectionResponse.builder()
                .id(section.getId())
                .name(section.getTitle())
                .description(section.getDescription())
                .lectures(lectureResponses)
                .orderIndex(section.getOrderIndex())
                .build();
    }
    
    private LectureResponse mapToLectureResponse(Lesson lesson) {
        return LectureResponse.builder()
                .id(lesson.getId())
                .name(lesson.getTitle())
                .type(mapLessonTypeToString(lesson.getType()))
                .duration(lesson.getDurationMinutes())
                .orderIndex(lesson.getOrderIndex())
                .build();
    }
    
    private String mapLessonTypeToString(Lesson.LessonType lessonType) {
        return switch (lessonType) {
            case VIDEO -> "video";
            case TEXT -> "article";
            case QUIZ -> "quiz";
            default -> "article"; // ASSIGNMENT, RESOURCE map to article
        };
    }
}