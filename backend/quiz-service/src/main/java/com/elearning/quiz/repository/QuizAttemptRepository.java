package com.elearning.quiz.repository;

import com.elearning.quiz.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, String> {
    
    // Find attempts by student ID
    List<QuizAttempt> findByStudentIdOrderByCreatedAtDesc(String studentId);
    
    // Find attempts by quiz ID
    List<QuizAttempt> findByQuizIdOrderByCreatedAtDesc(String quizId);
    
    // Find attempts by student and quiz
    List<QuizAttempt> findByStudentIdAndQuizIdOrderByCreatedAtDesc(String studentId, String quizId);
    
    // Find latest attempt by student and quiz
    @Query("SELECT a FROM QuizAttempt a WHERE a.studentId = :studentId AND a.quizId = :quizId ORDER BY a.createdAt DESC")
    List<QuizAttempt> findLatestAttemptByStudentAndQuiz(@Param("studentId") String studentId, @Param("quizId") String quizId);
    
    // Find attempts by course ID
    List<QuizAttempt> findByCourseIdOrderByCreatedAtDesc(String courseId);
    
    // Find attempts by section ID
    List<QuizAttempt> findBySectionIdOrderByCreatedAtDesc(String sectionId);
    
    // Count attempts by quiz ID
    @Query("SELECT COUNT(a) FROM QuizAttempt a WHERE a.quizId = :quizId")
    Long countByQuizId(@Param("quizId") String quizId);
    
    // Count passed attempts by quiz ID
    @Query("SELECT COUNT(a) FROM QuizAttempt a WHERE a.quizId = :quizId AND a.passed = true")
    Long countPassedAttemptsByQuizId(@Param("quizId") String quizId);
    
    // Find best attempt by student and quiz
    @Query("SELECT a FROM QuizAttempt a WHERE a.studentId = :studentId AND a.quizId = :quizId ORDER BY a.percentage DESC, a.createdAt DESC")
    List<QuizAttempt> findBestAttemptByStudentAndQuiz(@Param("studentId") String studentId, @Param("quizId") String quizId);
    
    // Calculate average score by quiz ID
    @Query("SELECT AVG(a.percentage) FROM QuizAttempt a WHERE a.quizId = :quizId")
    Double calculateAverageScoreByQuizId(@Param("quizId") String quizId);
}
