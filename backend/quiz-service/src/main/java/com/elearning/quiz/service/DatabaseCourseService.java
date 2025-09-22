package com.elearning.quiz.service;

import com.elearning.quiz.dto.*;
import com.elearning.quiz.model.*;
import com.elearning.quiz.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DatabaseCourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private QuizQuestionOptionRepository quizQuestionOptionRepository;

    public List<CourseDto> getAllCourses() {
        System.out.println("📚 Fetching all courses from database");
        return courseRepository.findAll().stream()
                .map(this::convertToCourseDto)
                .collect(Collectors.toList());
    }

    public CourseDto getCourseById(String id) {
        System.out.println("🔍 Fetching course by ID from database: " + id);
        return courseRepository.findById(id)
                .map(this::convertToCourseDto)
                .orElse(null);
    }

    public CourseDto getCourseBySlug(String slug) {
        System.out.println("🔍 Fetching course by slug from database: " + slug);
        return courseRepository.findBySlug(slug)
                .map(this::convertToCourseDto)
                .orElse(null);
    }

    public List<CourseDto> getCoursesByStudentId(String studentId) {
        System.out.println("👨‍🎓 Fetching courses for student from database: " + studentId);
        return courseRepository.findByIsEnrolledTrue().stream()
                .map(this::convertToCourseDto)
                .collect(Collectors.toList());
    }

    public List<CourseDto> getCoursesByInstructorId(String instructorId) {
        System.out.println("👨‍🏫 Fetching courses for instructor from database: " + instructorId);
        // Since Course entity doesn't have instructorId field, return all courses for now
        // In a real application, you would need to add instructorId field to Course entity
        return courseRepository.findAll().stream()
                .map(this::convertToCourseDto)
                .collect(Collectors.toList());
    }

    public List<CourseDto> searchCourses(String query) {
        System.out.println("🔍 Searching courses from database: " + query);
        return courseRepository.findAll().stream()
                .filter(course -> course.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                                course.getDescription().toLowerCase().contains(query.toLowerCase()))
                .map(this::convertToCourseDto)
                .collect(Collectors.toList());
    }

    public List<CourseDto> getCoursesByCategory(String category) {
        System.out.println("📂 Fetching courses by category from database: " + category);
        return courseRepository.findAll().stream()
                .filter(course -> course.getLevel().equalsIgnoreCase(category))
                .map(this::convertToCourseDto)
                .collect(Collectors.toList());
    }

    public List<CourseDto> getCoursesByLevel(String level) {
        System.out.println("📊 Fetching courses by level from database: " + level);
        return courseRepository.findAll().stream()
                .filter(course -> course.getLevel().equalsIgnoreCase(level))
                .map(this::convertToCourseDto)
                .collect(Collectors.toList());
    }

    private CourseDto convertToCourseDto(Course course) {
        CourseDto dto = new CourseDto();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setSlug(course.getSlug());
        dto.setDescription(course.getDescription());
        dto.setShortDescription(course.getShortDescription());
        dto.setThumbnail(course.getThumbnail());
        dto.setVideoUrl(course.getVideoUrl());
        dto.setDuration(course.getDuration());
        dto.setLevel(course.getLevel());
        dto.setRating(course.getRating());
        dto.setStudentsCount(course.getStudentsCount());
        dto.setPrice(course.getPrice());
        dto.setOriginalPrice(course.getOriginalPrice());
        dto.setEnrolled(course.getIsEnrolled());
        dto.setLastAccessed(course.getLastAccessed() != null ? course.getLastAccessed().toString() : null);
        dto.setCompletionPercentage(course.getCompletionPercentage());
        dto.setTotalLessons(course.getTotalLessons());
        dto.setCompletedLessons(course.getCompletedLessons());

        // Set instructor
        InstructorDto instructor = new InstructorDto();
        instructor.setId("instructor-" + course.getId());
        instructor.setName(course.getInstructorName());
        instructor.setAvatar(course.getInstructorAvatar());
        instructor.setTitle(course.getInstructorTitle());
        dto.setInstructor(instructor);

        // Set sections
        List<SectionDto> sections = sectionRepository.findByCourseIdOrderByOrderIndexAsc(course.getId())
                .stream()
                .map(this::convertToSectionDto)
                .collect(Collectors.toList());
        dto.setSections(sections);

        return dto;
    }

    private SectionDto convertToSectionDto(Section section) {
        SectionDto dto = new SectionDto();
        dto.setId(section.getId());
        dto.setCourseId(section.getCourseId());
        dto.setTitle(section.getTitle());
        dto.setExpanded(section.getIsExpanded());
        dto.setUnlocked(section.getIsUnlocked());

        // Set progress
        ProgressDto progress = new ProgressDto();
        progress.setCompleted(section.getCompleted());
        progress.setTotal(section.getTotal());
        progress.setDuration(section.getDuration());
        dto.setProgress(progress);

        // Set lessons
        List<LessonDto> lessons = lessonRepository.findBySectionIdOrderByOrderIndexAsc(section.getId())
                .stream()
                .map(this::convertToLessonDto)
                .collect(Collectors.toList());
        dto.setLessons(lessons);

        // Set quiz
        Quiz quiz = quizRepository.findBySectionId(section.getId());
        if (quiz != null) {
            dto.setQuiz(convertToQuizDto(quiz));
        }

        return dto;
    }

    private LessonDto convertToLessonDto(Lesson lesson) {
        LessonDto dto = new LessonDto();
        dto.setId(lesson.getId());
        dto.setSectionId(lesson.getSectionId());
        dto.setCourseId(lesson.getCourseId());
        dto.setTitle(lesson.getTitle());
        dto.setDescription(lesson.getDescription());
        dto.setDuration(lesson.getDuration());
        dto.setCompleted(lesson.getIsCompleted());
        dto.setCurrent(lesson.getIsCurrent());
        dto.setLocked(lesson.getIsLocked());
        dto.setVideoUrl(lesson.getVideoUrl());
        dto.setContent(lesson.getContent());
        dto.setOrderIndex(lesson.getOrderIndex());
        return dto;
    }

    private QuizDto convertToQuizDto(Quiz quiz) {
        QuizDto dto = new QuizDto();
        dto.setId(quiz.getId());
        dto.setSectionId(quiz.getSectionId());
        dto.setCourseId(quiz.getCourseId());
        dto.setTutorId(quiz.getTutorId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setPassingScore(quiz.getPassingScore());
        dto.setTimeLimit(quiz.getTimeLimit());
        dto.setIsActive(quiz.getIsActive());
        dto.setCreatedAt(quiz.getCreatedAt());
        dto.setUpdatedAt(quiz.getUpdatedAt());

        // Set questions
        List<QuizQuestionDto> questions = quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(quiz.getId())
                .stream()
                .map(this::convertToQuizQuestionDto)
                .collect(Collectors.toList());
        dto.setQuestions(questions);

        return dto;
    }

    private QuizQuestionDto convertToQuizQuestionDto(QuizQuestion question) {
        QuizQuestionDto dto = new QuizQuestionDto();
        dto.setId(question.getId());
        dto.setQuizId(question.getQuizId());
        dto.setQuestionText(question.getQuestionText());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        dto.setOrder(question.getOrderIndex());
        dto.setCreatedAt(question.getCreatedAt());
        dto.setUpdatedAt(question.getUpdatedAt());

        // Set options
        List<QuizQuestionOptionDto> options = quizQuestionOptionRepository.findByQuestionIdOrderByOrderIndexAsc(question.getId())
                .stream()
                .map(this::convertToQuizQuestionOptionDto)
                .collect(Collectors.toList());
        dto.setOptions(options);

        return dto;
    }

    private QuizQuestionOptionDto convertToQuizQuestionOptionDto(QuizQuestionOption option) {
        QuizQuestionOptionDto dto = new QuizQuestionOptionDto();
        dto.setId(option.getId());
        dto.setQuestionId(option.getQuestionId());
        dto.setText(option.getOptionText());
        dto.setIsCorrect(option.getIsCorrect());
        dto.setOrderIndex(option.getOrderIndex());
        dto.setCreatedAt(option.getCreatedAt());
        dto.setUpdatedAt(option.getUpdatedAt());
        return dto;
    }
}
