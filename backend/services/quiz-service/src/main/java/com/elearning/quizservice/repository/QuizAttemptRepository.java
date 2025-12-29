package com.elearning.quizservice.repository;

import com.elearning.quizservice.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for QuizAttempt entity
 */
@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {
    
    /**
     * Find all attempts by student for a quiz
     */
    List<QuizAttempt> findByStudentIdAndQuiz_IdOrderByAttemptNumberDesc(UUID studentId, UUID quizId);
    
    /**
     * Find all attempts by quiz
     */
    List<QuizAttempt> findByQuiz_IdOrderBySubmittedAtDesc(UUID quizId);
    
    /**
     * Find all attempts by student
     */
    List<QuizAttempt> findByStudentIdOrderByStartedAtDesc(UUID studentId);
    
    /**
     * Find latest attempt by student for a quiz
     */
    Optional<QuizAttempt> findFirstByStudentIdAndQuiz_IdOrderByAttemptNumberDesc(
        UUID studentId, UUID quizId);
    
    /**
     * Find in-progress attempt
     */
    Optional<QuizAttempt> findByStudentIdAndQuiz_IdAndStatus(
        UUID studentId, UUID quizId, QuizAttempt.AttemptStatus status);
    
    /**
     * Count attempts by student for a quiz
     */
    Long countByStudentIdAndQuiz_Id(UUID studentId, UUID quizId);
    
    /**
     * Count submitted attempts for a quiz
     */
    Long countByQuiz_IdAndStatus(UUID quizId, QuizAttempt.AttemptStatus status);
    
    /**
     * Get average score for a quiz
     */
    @Query("SELECT AVG(a.percentage) FROM QuizAttempt a " +
           "WHERE a.quiz.id = :quizId AND a.status = 'GRADED'")
    Double getAverageScoreByQuizId(@Param("quizId") UUID quizId);
    
    /**
     * Get highest score for a quiz
     */
    @Query("SELECT MAX(a.percentage) FROM QuizAttempt a " +
           "WHERE a.quiz.id = :quizId AND a.status = 'GRADED'")
    Double getHighestScoreByQuizId(@Param("quizId") UUID quizId);
    
    /**
     * Get pass rate for a quiz
     */
    @Query("SELECT COUNT(a) * 100.0 / (SELECT COUNT(a2) FROM QuizAttempt a2 " +
           "WHERE a2.quiz.id = :quizId AND a2.status = 'GRADED') " +
           "FROM QuizAttempt a WHERE a.quiz.id = :quizId AND a.passed = true AND a.status = 'GRADED'")
    Double getPassRateByQuizId(@Param("quizId") UUID quizId);
    
    /**
     * Get lowest score for a quiz
     */
    @Query("SELECT MIN(a.percentage) FROM QuizAttempt a " +
           "WHERE a.quiz.id = :quizId AND a.status = 'GRADED'")
    Double getLowestScoreByQuizId(@Param("quizId") UUID quizId);
    
    /**
     * Count attempts by quiz and status
     */
    Long countByQuizIdAndStatus(UUID quizId, QuizAttempt.AttemptStatus status);
    
    /**
     * Find all graded attempts for a quiz (for student performance list)
     */
    @Query("SELECT a FROM QuizAttempt a LEFT JOIN FETCH a.student " +
           "WHERE a.quiz.id = :quizId AND a.status = 'GRADED' " +
           "ORDER BY a.submittedAt DESC")
    List<QuizAttempt> findGradedAttemptsByQuizIdWithStudent(@Param("quizId") UUID quizId);
    
    /**
     * Find latest attempt by student for each quiz they have attempted
     */
    @Query("SELECT a FROM QuizAttempt a " +
           "WHERE a.studentId = :studentId " +
           "AND a.attemptNumber = (SELECT MAX(a2.attemptNumber) FROM QuizAttempt a2 WHERE a2.studentId = :studentId AND a2.quiz.id = a.quiz.id)")
    List<QuizAttempt> findLatestAttemptsByStudentId(@Param("studentId") UUID studentId);
}

