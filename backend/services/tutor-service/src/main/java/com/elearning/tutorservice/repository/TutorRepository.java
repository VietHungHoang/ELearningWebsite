package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.Tutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface TutorRepository extends JpaRepository<Tutor, UUID> {

       @Query("SELECT DISTINCT t FROM Tutor t " +
                     "WHERE t.isVerified = true " +
                     "AND (:languageCodes IS NULL OR EXISTS (SELECT 1 FROM TutorLanguage tl WHERE tl.tutor = t AND tl.code IN :languageCodes)) "
                     +
                     "AND (:minPrice IS NULL OR t.currentSessionFee >= :minPrice) " +
                     "AND (:maxPrice IS NULL OR t.currentSessionFee <= :maxPrice)")
       Page<Tutor> findTutorsWithFilters(@Param("languageCodes") List<String> languageCodes,
                     @Param("minPrice") BigDecimal minPrice,
                     @Param("maxPrice") BigDecimal maxPrice,
                     Pageable pageable);

       /**
        * Find all verified tutors for search indexing
        */
       List<Tutor> findByIsVerifiedTrue();

       /**
        * Find all verified tutors with pagination
        */
       Page<Tutor> findByIsVerifiedTrue(Pageable pageable);

       /**
        * Find tutor with subjects for search indexing
        */
       @Query("SELECT t FROM Tutor t " +
                     "LEFT JOIN FETCH t.subjects " +
                     "WHERE t.id = :tutorId")
       java.util.Optional<Tutor> findByIdWithSubjects(@Param("tutorId") UUID tutorId);

       /**
        * Find tutor with languages for search indexing
        */
       @Query("SELECT t FROM Tutor t " +
                     "LEFT JOIN FETCH t.languages " +
                     "WHERE t.id = :tutorId")
       java.util.Optional<Tutor> findByIdWithLanguages(@Param("tutorId") UUID tutorId);

       /**
        * Find tutor with availabilities for search indexing
        */
       @Query("SELECT t FROM Tutor t " +
                     "LEFT JOIN FETCH t.availabilities " +
                     "WHERE t.id = :tutorId")
       java.util.Optional<Tutor> findByIdWithAvailabilities(@Param("tutorId") UUID tutorId);

       /**
        * Find similar tutors by subject IDs (random order, limit)
        * Excludes the specified tutor and returns random tutors who teach any of the
        * given subjects
        */
       @Query(value = "SELECT DISTINCT t.* FROM tutors t " +
                     "INNER JOIN tutor_subjects ts ON t.id = ts.tutor_id " +
                     "WHERE t.is_verified = true " +
                     "AND t.id != :tutorId " +
                     "AND ts.subject_id IN :subjectIds " +
                     "ORDER BY RANDOM() " +
                     "LIMIT :limit", nativeQuery = true)
       List<Tutor> findSimilarTutorsBySubjects(@Param("tutorId") UUID tutorId,
                     @Param("subjectIds") List<UUID> subjectIds,
                     @Param("limit") int limit);
}