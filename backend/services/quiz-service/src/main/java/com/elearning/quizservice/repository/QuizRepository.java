package com.elearning.quizservice.repository;

import com.elearning.quizservice.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Quiz entity
 */
@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {

       /**
        * Find all quizzes by class ID
        */
       List<Quiz> findByClassInfoIdAndIsActiveTrue(UUID classId);

       /**
        * Find all quizzes created by a tutor
        */
       List<Quiz> findByCreatorIdAndIsActiveTrue(UUID creatorId);

       /**
        * Find active quiz by ID
        */
       Optional<Quiz> findByIdAndIsActiveTrue(UUID id);

       /**
        * Find quizzes by status
        */
       List<Quiz> findByStatusAndIsActiveTrue(Quiz.QuizStatus status);

       /**
        * Find quizzes by class and status
        */
       List<Quiz> findByClassInfoIdAndStatusAndIsActiveTrue(UUID classId, Quiz.QuizStatus status);

       /**
        * Count quizzes by class
        */
       Long countByClassInfoIdAndIsActiveTrue(UUID classId);

       /**
        * Count quizzes by creator
        */
       Long countByCreatorIdAndIsActiveTrue(UUID creatorId);

       /**
        * Find quizzes by class with search
        */
       @Query("SELECT q FROM Quiz q WHERE q.classInfo.id = :classId " +
                     "AND q.isActive = true " +
                     "AND (LOWER(q.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
                     "OR LOWER(q.description) LIKE LOWER(CONCAT('%', :search, '%')))")
       List<Quiz> searchByClassId(@Param("classId") UUID classId, @Param("search") String search);

       /**
        * Find all published (active status) quizzes
        */
       @Query("SELECT q FROM Quiz q LEFT JOIN FETCH q.creator " +
                     "WHERE q.status = 'ACTIVE' AND q.isActive = true " +
                     "ORDER BY q.publishedAt DESC")
       List<Quiz> findAllPublishedQuizzesWithCreator();

       /**
        * Find all published quizzes for a student (via class membership)
        */
       @Query("SELECT DISTINCT q FROM Quiz q " +
                     "LEFT JOIN FETCH q.creator " +
                     "LEFT JOIN FETCH q.classInfo ci " +
                     "LEFT JOIN ci.students s " +
                     "WHERE s.id = :studentId " +
                     "AND q.status = 'ACTIVE' " +
                     "AND q.isActive = true " +
                     "ORDER BY q.publishedAt DESC")
       List<Quiz> findPublishedQuizzesForStudent(@Param("studentId") UUID studentId);
}
