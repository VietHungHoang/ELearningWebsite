package com.elearning.quiz.repository;

import com.elearning.quiz.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    
    // Find attempts by student and course
    List<QuizAttempt> findByStudentIdAndCourseId(String studentId, String courseId);
    
    // Find attempts by student and section
    List<QuizAttempt> findByStudentIdAndSectionId(String studentId, String sectionId);
    
    // Find attempts by quiz
    List<QuizAttempt> findByQuizId(String quizId);
    
    // Check if student has completed a specific quiz
    @Query("SELECT COUNT(a) > 0 FROM QuizAttempt a WHERE a.studentId = :studentId AND a.quizId = :quizId AND a.passed = true")
    boolean hasStudentPassedQuiz(@Param("studentId") String studentId, @Param("quizId") String quizId);
    
    // Get latest attempt for a quiz by student
    @Query("SELECT a FROM QuizAttempt a WHERE a.studentId = :studentId AND a.quizId = :quizId ORDER BY a.completedAt DESC")
    List<QuizAttempt> findLatestAttemptByStudentAndQuiz(@Param("studentId") String studentId, @Param("quizId") String quizId);
    
    // Find attempts by student ID ordered by created date
    List<QuizAttempt> findByStudentIdOrderByCreatedAtDesc(String studentId);
    
    // Find attempts by quiz ID ordered by created date
    List<QuizAttempt> findByQuizIdOrderByCreatedAtDesc(String quizId);
    
    // Find attempts by student and quiz ordered by created date
    List<QuizAttempt> findByStudentIdAndQuizIdOrderByCreatedAtDesc(String studentId, String quizId);
    
    // Find attempts by course ID ordered by created date
    List<QuizAttempt> findByCourseIdOrderByCreatedAtDesc(String courseId);
    
    // Find attempts by section ID ordered by created date
    List<QuizAttempt> findBySectionIdOrderByCreatedAtDesc(String sectionId);
    
    // Find attempts by student and course ordered by created date
    List<QuizAttempt> findByStudentIdAndCourseIdOrderByCreatedAtDesc(String studentId, String courseId);
}