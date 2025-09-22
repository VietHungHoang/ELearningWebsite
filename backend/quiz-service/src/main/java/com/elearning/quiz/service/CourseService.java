package com.elearning.quiz.service;

import com.elearning.quiz.dto.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    // Mock data - In production, this would come from database
    private final List<CourseDto> mockCourses = createMockCourses();

    public List<CourseDto> getAllCourses() {
        System.out.println("📚 Fetching all courses: " + mockCourses.size());
        return new ArrayList<>(mockCourses);
    }

    public CourseDto getCourseById(String id) {
        System.out.println("🔍 Fetching course by ID: " + id);
        return mockCourses.stream()
                .filter(course -> course.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public CourseDto getCourseBySlug(String slug) {
        System.out.println("🔍 Fetching course by slug: " + slug);
        return mockCourses.stream()
                .filter(course -> course.getSlug().equals(slug))
                .findFirst()
                .orElse(null);
    }

    public List<CourseDto> getCoursesByStudentId(String studentId) {
        System.out.println("👨‍🎓 Fetching courses for student: " + studentId);
        return mockCourses.stream()
                .filter(CourseDto::isEnrolled)
                .collect(Collectors.toList());
    }

    public List<CourseDto> getCoursesByInstructorId(String instructorId) {
        System.out.println("👨‍🏫 Fetching courses for instructor: " + instructorId);
        return mockCourses.stream()
                .filter(course -> course.getInstructor().getId().equals(instructorId))
                .collect(Collectors.toList());
    }

    public List<CourseDto> searchCourses(String query) {
        System.out.println("🔍 Searching courses with query: " + query);
        String lowerQuery = query.toLowerCase();
        return mockCourses.stream()
                .filter(course -> 
                    course.getTitle().toLowerCase().contains(lowerQuery) ||
                    course.getDescription().toLowerCase().contains(lowerQuery) ||
                    course.getShortDescription().toLowerCase().contains(lowerQuery)
                )
                .collect(Collectors.toList());
    }

    public List<CourseDto> getCoursesByCategory(String category) {
        System.out.println("📂 Fetching courses by category: " + category);
        // For now, return all courses as mock data doesn't have categories
        return new ArrayList<>(mockCourses);
    }

    public List<CourseDto> getCoursesByLevel(String level) {
        System.out.println("📊 Fetching courses by level: " + level);
        return mockCourses.stream()
                .filter(course -> course.getLevel().equalsIgnoreCase(level))
                .collect(Collectors.toList());
    }

    private List<CourseDto> createMockCourses() {
        List<CourseDto> courses = new ArrayList<>();

        // Course 1: Goal Setting Masterclass
        InstructorDto instructor1 = new InstructorDto(
            "instructor-1",
            "Steven Ford",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
            "Productivity Expert & Life Coach",
            "Steven is a renowned productivity expert with over 10 years of experience helping people achieve their goals.",
            4.8,
            25000,
            15
        );

        List<SectionDto> sections1 = Arrays.asList(
            createSection("section-1", "Understanding Goals and Why They Matter", true, 1, 3, "13 mins 5 sec"),
            createSection("goal-section-2", "Setting and Achieving Your Goals", false, 0, 3, "18 mins 30 sec"),
            createSection("goal-section-3", "Advanced Goal Achievement Strategies", false, 0, 4, "18 mins 30 sec")
        );

        CourseDto course1 = new CourseDto(
            "1",
            "Goal Setting Masterclass: Achieve Your Dreams",
            "goal-setting-masterclass-achieve-your-dreams",
            "Learn the fundamentals of goal setting and achieve your dreams with this comprehensive masterclass. Master proven techniques used by successful people to set, track, and achieve their goals.",
            "Master the art of goal setting and turn your dreams into reality",
            15,
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            instructor1,
            "2h 30m",
            "Beginner",
            4.8,
            12500,
            89.0,
            149.0,
            true,
            "2024-01-15",
            15,
            8,
            1,
            sections1
        );
        course1.setCreatedAt(LocalDateTime.now().minusDays(30));
        course1.setUpdatedAt(LocalDateTime.now().minusDays(5));
        courses.add(course1);

        // Course 2: Focus and Concentration
        InstructorDto instructor2 = new InstructorDto(
            "instructor-2",
            "Jane Doe",
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
            "Focus & Productivity Specialist",
            "Jane specializes in helping people improve their focus and concentration through proven techniques.",
            4.7,
            15000,
            12
        );

        List<SectionDto> sections2 = Arrays.asList(
            createSection("focus-section-1", "Introduction to Focus and Concentration", true, 0, 6, "29 mins 45 sec"),
            createSection("focus-section-2", "Advanced Focus Techniques and Deep Work", false, 0, 5, "22 mins 30 sec")
        );

        CourseDto course2 = new CourseDto(
            "2",
            "Focus and Concentration Boost: Achieve More",
            "focus-and-concentration-boost-achieve-more",
            "Master the art of focus and concentration to boost your productivity and achieve more in less time.",
            "Boost your focus and concentration for maximum productivity",
            0,
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            instructor2,
            "1h 45m",
            "Intermediate",
            4.7,
            8900,
            79.0,
            129.0,
            true,
            "2024-01-10",
            0,
            6,
            0,
            sections2
        );
        course2.setCreatedAt(LocalDateTime.now().minusDays(25));
        course2.setUpdatedAt(LocalDateTime.now().minusDays(3));
        courses.add(course2);

        // Course 3: React Development
        InstructorDto instructor3 = new InstructorDto(
            "instructor-3",
            "Anthony Shao",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
            "Senior React Developer",
            "Anthony is a senior React developer with 8+ years of experience building scalable web applications.",
            4.8,
            30000,
            20
        );

        List<SectionDto> sections3 = Arrays.asList(
            createSection("react-section-1", "React Fundamentals", true, 5, 10, "82 mins"),
            createSection("react-section-2", "Advanced React Patterns and State Management", false, 0, 5, "45 mins")
        );

        CourseDto course3 = new CourseDto(
            "3",
            "React Development Mastery: From Zero to Hero",
            "react-development-mastery-zero-to-hero",
            "Master React development from the ground up. Learn modern React patterns, hooks, state management, and build real-world applications.",
            "Complete React development course from beginner to advanced",
            45,
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            instructor3,
            "12h 30m",
            "Intermediate",
            4.8,
            18500,
            299.0,
            399.0,
            true,
            "2024-01-05",
            45,
            25,
            11,
            sections3
        );
        course3.setCreatedAt(LocalDateTime.now().minusDays(20));
        course3.setUpdatedAt(LocalDateTime.now().minusDays(1));
        courses.add(course3);

        return courses;
    }

    private SectionDto createSection(String id, String title, boolean isExpanded, int completed, int total, String duration) {
        ProgressDto progress = new ProgressDto(completed, total, duration);
        
        List<LessonDto> lessons = Arrays.asList(
            new LessonDto("lesson-1", id, "course-1", "Introduction Lesson", "Learn the basics", "5 mins", completed > 0, completed > 0, false, "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "", 1),
            new LessonDto("lesson-2", id, "course-1", "Advanced Lesson", "Dive deeper", "8 mins", completed > 1, completed == 1, false, "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "", 2),
            new LessonDto("lesson-3", id, "course-1", "Practice Lesson", "Apply what you learned", "6 mins", completed > 2, false, false, "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", "", 3)
        );

        // Create quiz for each section
        QuizDto quiz = createQuizForSection(id, title);

        return new SectionDto(
            id,
            "course-1",
            title,
            isExpanded,
            progress,
            quiz,
            false,
            isExpanded, // First section is always unlocked
            lessons
        );
    }

    private QuizDto createQuizForSection(String sectionId, String sectionTitle) {
        String quizId = sectionId + "-quiz";
        String quizTitle = sectionTitle + " Quiz";
        String quizDescription = "Test your understanding of " + sectionTitle.toLowerCase();
        
        // Create sample questions based on section
        List<QuizQuestionDto> questions = createSampleQuestions(quizId, sectionTitle);
        
        QuizDto quiz = new QuizDto();
        quiz.setId(quizId);
        quiz.setSectionId(sectionId);
        quiz.setCourseId("course-1");
        quiz.setTutorId("tutor-1");
        quiz.setTitle(quizTitle);
        quiz.setDescription(quizDescription);
        quiz.setQuestions(questions);
        quiz.setPassingScore(70);
        quiz.setTimeLimit(10);
        quiz.setIsActive(true);
        quiz.setCreatedAt(LocalDateTime.now());
        quiz.setUpdatedAt(LocalDateTime.now());
        return quiz;
    }

    private List<QuizQuestionDto> createSampleQuestions(String quizId, String sectionTitle) {
        List<QuizQuestionDto> questions = new ArrayList<>();
        
        // Question 1
        List<QuizQuestionOptionDto> options1 = Arrays.asList(
            new QuizQuestionOptionDto("a", "Option A", false, 1),
            new QuizQuestionOptionDto("b", "Option B (Correct)", true, 2),
            new QuizQuestionOptionDto("c", "Option C", false, 3),
            new QuizQuestionOptionDto("d", "Option D", false, 4)
        );
        
        QuizQuestionDto question1 = new QuizQuestionDto();
        question1.setId("q1-" + quizId);
        question1.setQuizId(quizId);
        question1.setQuestionText("What is the main concept covered in " + sectionTitle + "?");
        question1.setCorrectAnswer("b");
        question1.setOrder(1);
        question1.setOptions(options1);
        question1.setCreatedAt(LocalDateTime.now());
        question1.setUpdatedAt(LocalDateTime.now());
        questions.add(question1);
        
        // Question 2
        List<QuizQuestionOptionDto> options2 = Arrays.asList(
            new QuizQuestionOptionDto("a", "Option A", false, 1),
            new QuizQuestionOptionDto("b", "Option B (Correct)", true, 2),
            new QuizQuestionOptionDto("c", "Option C", false, 3),
            new QuizQuestionOptionDto("d", "Option D", false, 4)
        );
        
        QuizQuestionDto question2 = new QuizQuestionDto();
        question2.setId("q2-" + quizId);
        question2.setQuizId(quizId);
        question2.setQuestionText("What is the most important aspect of " + sectionTitle.toLowerCase() + "?");
        question2.setCorrectAnswer("b");
        question2.setOrder(2);
        question2.setOptions(options2);
        question2.setCreatedAt(LocalDateTime.now());
        question2.setUpdatedAt(LocalDateTime.now());
        questions.add(question2);
        
        // Question 3
        List<QuizQuestionOptionDto> options3 = Arrays.asList(
            new QuizQuestionOptionDto("a", "Option 1", false, 1),
            new QuizQuestionOptionDto("b", "Option 2", true, 2),
            new QuizQuestionOptionDto("c", "Option 3", false, 3)
        );
        
        QuizQuestionDto question3 = new QuizQuestionDto();
        question3.setId("q3-" + quizId);
        question3.setQuizId(quizId);
        question3.setQuestionText("Which approach works best for " + sectionTitle.toLowerCase() + "?");
        question3.setCorrectAnswer("b");
        question3.setOrder(3);
        question3.setOptions(options3);
        question3.setCreatedAt(LocalDateTime.now());
        question3.setUpdatedAt(LocalDateTime.now());
        questions.add(question3);
        
        return questions;
    }
}
