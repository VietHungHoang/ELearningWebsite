package com.elearning.quiz.service;

import com.elearning.quiz.dto.*;
import com.elearning.quiz.model.*;
import com.elearning.quiz.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
        List<CourseDto> courses = courseRepository.findAll().stream()
                .map(this::convertToCourseDto)
                .collect(Collectors.toList());
        
        // Add final quiz to each course
        courses.forEach(this::addFinalQuizToCourse);
        
        return courses;
    }

    public CourseDto getCourseById(String id) {
        System.out.println("🔍 Fetching course by ID from database: " + id);
        CourseDto course = courseRepository.findById(id)
                .map(this::convertToCourseDto)
                .orElse(null);
        
        if (course != null) {
            addFinalQuizToCourse(course);
        }
        
        return course;
    }

    public CourseDto getCourseBySlug(String slug) {
        System.out.println("🔍 Fetching course by slug from database: " + slug);
        CourseDto course = courseRepository.findBySlug(slug)
                .map(this::convertToCourseDto)
                .orElse(null);
        
        if (course != null) {
            addFinalQuizToCourse(course);
        }
        
        return course;
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

        // Set quiz - handle potential duplicates by taking the first one
        List<Quiz> quizzes = quizRepository.findBySectionId(section.getId());
        if (quizzes != null && !quizzes.isEmpty()) {
            if (quizzes.size() > 1) {
                System.out.println("WARNING: Multiple quizzes found for section " + section.getId() + ". Taking the first one.");
            }
            Quiz quiz = quizzes.get(0); // Take the first quiz if multiple exist
            dto.setQuiz(convertToQuizDto(quiz));
        } else {
            // Generate quiz for section if none exists
            System.out.println("📝 No quiz found for section " + section.getId() + ", generating one...");
            QuizDto generatedQuiz = generateSectionQuiz(section);
            dto.setQuiz(generatedQuiz);
        }

        return dto;
    }

    private QuizDto generateSectionQuiz(Section section) {
        System.out.println("🎯 Generating quiz for section: " + section.getTitle());
        
        QuizDto quiz = new QuizDto();
        quiz.setId("quiz-" + section.getId());
        quiz.setTitle(section.getTitle() + " Quiz");
        quiz.setDescription("Test your knowledge of " + section.getTitle());
        quiz.setCourseId(section.getCourseId());
        quiz.setSectionId(section.getId());
        quiz.setTutorId("tutor-001"); // Default tutor
        quiz.setIsActive(true);
        quiz.setIsRequired(true);
        quiz.setPassingScore(70);
        quiz.setTimeLimit(10); // 10 minutes
        quiz.setMaxAttempts(3);
        quiz.setCreatedAt(java.time.LocalDateTime.now().toString());
        quiz.setUpdatedAt(java.time.LocalDateTime.now().toString());
        
        // Create sample questions for section quiz
        List<QuizQuestionDto> questions = createSectionQuizQuestions(section);
        quiz.setQuestions(questions);
        
        System.out.println("✅ Section quiz generated with " + questions.size() + " questions");
        return quiz;
    }

    private List<QuizQuestionDto> createSectionQuizQuestions(Section section) {
        List<QuizQuestionDto> questions = new ArrayList<>();
        
        // Question 1
        QuizQuestionDto q1 = new QuizQuestionDto();
        q1.setId("q1-" + section.getId());
        q1.setQuizId("quiz-" + section.getId());
        q1.setQuestionText("What is the main topic covered in " + section.getTitle() + "?");
        q1.setQuestionType("multiple_choice");
        q1.setOrder(1);
        q1.setIsRequired(true);
        q1.setCreatedAt(java.time.LocalDateTime.now().toString());
        q1.setUpdatedAt(java.time.LocalDateTime.now().toString());
        
        List<QuizQuestionOptionDto> options1 = new ArrayList<>();
        options1.add(createOption("q1-a-" + section.getId(), "Basic concepts", true));
        options1.add(createOption("q1-b-" + section.getId(), "Advanced techniques", false));
        options1.add(createOption("q1-c-" + section.getId(), "Tools and frameworks", false));
        options1.add(createOption("q1-d-" + section.getId(), "Best practices", false));
        q1.setOptions(options1);
        questions.add(q1);
        
        // Question 2
        QuizQuestionDto q2 = new QuizQuestionDto();
        q2.setId("q2-" + section.getId());
        q2.setQuizId("quiz-" + section.getId());
        q2.setQuestionText("Which of the following is important in " + section.getTitle() + "?");
        q2.setQuestionType("multiple_choice");
        q2.setOrder(2);
        q2.setIsRequired(true);
        q2.setCreatedAt(java.time.LocalDateTime.now().toString());
        q2.setUpdatedAt(java.time.LocalDateTime.now().toString());
        
        List<QuizQuestionOptionDto> options2 = new ArrayList<>();
        options2.add(createOption("q2-a-" + section.getId(), "Understanding fundamentals", true));
        options2.add(createOption("q2-b-" + section.getId(), "Memorizing syntax", false));
        options2.add(createOption("q2-c-" + section.getId(), "Copying code", false));
        options2.add(createOption("q2-d-" + section.getId(), "Following tutorials", false));
        q2.setOptions(options2);
        questions.add(q2);
        
        // Question 3
        QuizQuestionDto q3 = new QuizQuestionDto();
        q3.setId("q3-" + section.getId());
        q3.setQuizId("quiz-" + section.getId());
        q3.setQuestionText("What should you focus on when learning " + section.getTitle() + "?");
        q3.setQuestionType("multiple_choice");
        q3.setOrder(3);
        q3.setIsRequired(true);
        q3.setCreatedAt(java.time.LocalDateTime.now().toString());
        q3.setUpdatedAt(java.time.LocalDateTime.now().toString());
        
        List<QuizQuestionOptionDto> options3 = new ArrayList<>();
        options3.add(createOption("q3-a-" + section.getId(), "Practice and application", true));
        options3.add(createOption("q3-b-" + section.getId(), "Theory only", false));
        options3.add(createOption("q3-c-" + section.getId(), "Reading documentation", false));
        options3.add(createOption("q3-d-" + section.getId(), "Watching videos", false));
        q3.setOptions(options3);
        questions.add(q3);
        
        return questions;
    }

    private void addFinalQuizToCourse(CourseDto course) {
        System.out.println("🎯 Adding final quiz to course: " + course.getTitle());
        
        // Create final quiz DTO
        QuizDto finalQuiz = new QuizDto();
        finalQuiz.setId("final-quiz-" + course.getId());
        finalQuiz.setTitle("Final Test - " + course.getTitle());
        finalQuiz.setDescription("Complete this final test to earn your certificate. You need to score at least 70% to pass.");
        finalQuiz.setCourseId(course.getId());
        finalQuiz.setSectionId("final-section-" + course.getId());
        finalQuiz.setIsActive(true);
        finalQuiz.setIsRequired(true);
        finalQuiz.setPassingScore(70);
        finalQuiz.setTimeLimit(30); // 30 minutes
        finalQuiz.setMaxAttempts(3);
        finalQuiz.setCreatedAt(java.time.LocalDateTime.now().toString());
        finalQuiz.setUpdatedAt(java.time.LocalDateTime.now().toString());
        
        // Create sample questions for final quiz
        List<QuizQuestionDto> questions = createFinalQuizQuestions(course);
        finalQuiz.setQuestions(questions);
        
        // Set final quiz to course
        course.setFinalQuiz(finalQuiz);
        
        System.out.println("✅ Final quiz added with " + questions.size() + " questions");
    }

    private List<QuizQuestionDto> createFinalQuizQuestions(CourseDto course) {
        List<QuizQuestionDto> questions = new ArrayList<>();
        
        // Question 1: Course Overview
        QuizQuestionDto q1 = new QuizQuestionDto();
        q1.setId("final-q1-" + course.getId());
        q1.setQuizId("final-quiz-" + course.getId());
        q1.setQuestionText("What is the main topic covered in " + course.getTitle() + "?");
        q1.setQuestionType("multiple_choice");
        q1.setOrder(1);
        q1.setIsRequired(true);
        q1.setCreatedAt(java.time.LocalDateTime.now().toString());
        q1.setUpdatedAt(java.time.LocalDateTime.now().toString());
        
        List<QuizQuestionOptionDto> options1 = new ArrayList<>();
        options1.add(createOption("final-q1-o1-" + course.getId(), "Advanced programming concepts", true));
        options1.add(createOption("final-q1-o2-" + course.getId(), "Basic HTML", false));
        options1.add(createOption("final-q1-o3-" + course.getId(), "Database design", false));
        options1.add(createOption("final-q1-o4-" + course.getId(), "Network security", false));
        q1.setOptions(options1);
        questions.add(q1);
        
        // Question 2: Key Concepts
        QuizQuestionDto q2 = new QuizQuestionDto();
        q2.setId("final-q2-" + course.getId());
        q2.setQuizId("final-quiz-" + course.getId());
        q2.setQuestionText("Which of the following is a key concept in " + course.getTitle() + "?");
        q2.setQuestionType("multiple_choice");
        q2.setOrder(2);
        q2.setIsRequired(true);
        q2.setCreatedAt(java.time.LocalDateTime.now().toString());
        q2.setUpdatedAt(java.time.LocalDateTime.now().toString());
        
        List<QuizQuestionOptionDto> options2 = new ArrayList<>();
        options2.add(createOption("final-q2-o1-" + course.getId(), "Component lifecycle", true));
        options2.add(createOption("final-q2-o2-" + course.getId(), "CSS styling", false));
        options2.add(createOption("final-q2-o3-" + course.getId(), "Image optimization", false));
        options2.add(createOption("final-q2-o4-" + course.getId(), "Email marketing", false));
        q2.setOptions(options2);
        questions.add(q2);
        
        // Question 3: Best Practices
        QuizQuestionDto q3 = new QuizQuestionDto();
        q3.setId("final-q3-" + course.getId());
        q3.setQuizId("final-quiz-" + course.getId());
        q3.setQuestionText("What is the best practice for state management in " + course.getTitle() + "?");
        q3.setQuestionType("multiple_choice");
        q3.setOrder(3);
        q3.setIsRequired(true);
        q3.setCreatedAt(java.time.LocalDateTime.now().toString());
        q3.setUpdatedAt(java.time.LocalDateTime.now().toString());
        
        List<QuizQuestionOptionDto> options3 = new ArrayList<>();
        options3.add(createOption("final-q3-o1-" + course.getId(), "Use Redux for complex state", true));
        options3.add(createOption("final-q3-o2-" + course.getId(), "Store everything in localStorage", false));
        options3.add(createOption("final-q3-o3-" + course.getId(), "Use global variables", false));
        options3.add(createOption("final-q3-o4-" + course.getId(), "Avoid state management", false));
        q3.setOptions(options3);
        questions.add(q3);
        
        // Question 4: Performance
        QuizQuestionDto q4 = new QuizQuestionDto();
        q4.setId("final-q4-" + course.getId());
        q4.setQuizId("final-quiz-" + course.getId());
        q4.setQuestionText("How can you optimize performance in " + course.getTitle() + "?");
        q4.setQuestionType("multiple_choice");
        q4.setOrder(4);
        q4.setIsRequired(true);
        q4.setCreatedAt(java.time.LocalDateTime.now().toString());
        q4.setUpdatedAt(java.time.LocalDateTime.now().toString());
        
        List<QuizQuestionOptionDto> options4 = new ArrayList<>();
        options4.add(createOption("final-q4-o1-" + course.getId(), "Use React.memo and useMemo", true));
        options4.add(createOption("final-q4-o2-" + course.getId(), "Load all data at once", false));
        options4.add(createOption("final-q4-o3-" + course.getId(), "Use inline styles", false));
        options4.add(createOption("final-q4-o4-" + course.getId(), "Avoid component splitting", false));
        q4.setOptions(options4);
        questions.add(q4);
        
        // Question 5: Testing
        QuizQuestionDto q5 = new QuizQuestionDto();
        q5.setId("final-q5-" + course.getId());
        q5.setQuizId("final-quiz-" + course.getId());
        q5.setQuestionText("What is the recommended testing approach for " + course.getTitle() + "?");
        q5.setQuestionType("multiple_choice");
        q5.setOrder(5);
        q5.setIsRequired(true);
        q5.setCreatedAt(java.time.LocalDateTime.now().toString());
        q5.setUpdatedAt(java.time.LocalDateTime.now().toString());
        
        List<QuizQuestionOptionDto> options5 = new ArrayList<>();
        options5.add(createOption("final-q5-o1-" + course.getId(), "Write unit tests and integration tests", true));
        options5.add(createOption("final-q5-o2-" + course.getId(), "Skip testing for small projects", false));
        options5.add(createOption("final-q5-o3-" + course.getId(), "Only test the happy path", false));
        options5.add(createOption("final-q5-o4-" + course.getId(), "Test only in production", false));
        q5.setOptions(options5);
        questions.add(q5);
        
        return questions;
    }

    private QuizQuestionOptionDto createOption(String id, String text, boolean isCorrect) {
        QuizQuestionOptionDto option = new QuizQuestionOptionDto();
        option.setId(id);
        option.setText(text);
        option.setIsCorrect(isCorrect);
        option.setOrderIndex(1);
        option.setCreatedAt(java.time.LocalDateTime.now().toString());
        option.setUpdatedAt(java.time.LocalDateTime.now().toString());
        return option;
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
        dto.setCreatedAt(quiz.getCreatedAt() != null ? quiz.getCreatedAt().toString() : java.time.LocalDateTime.now().toString());
        dto.setUpdatedAt(quiz.getUpdatedAt() != null ? quiz.getUpdatedAt().toString() : java.time.LocalDateTime.now().toString());

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
        dto.setCreatedAt(question.getCreatedAt() != null ? question.getCreatedAt().toString() : java.time.LocalDateTime.now().toString());
        dto.setUpdatedAt(question.getUpdatedAt() != null ? question.getUpdatedAt().toString() : java.time.LocalDateTime.now().toString());

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
        dto.setCreatedAt(option.getCreatedAt() != null ? option.getCreatedAt().toString() : java.time.LocalDateTime.now().toString());
        dto.setUpdatedAt(option.getUpdatedAt() != null ? option.getUpdatedAt().toString() : java.time.LocalDateTime.now().toString());
        return dto;
    }
}
