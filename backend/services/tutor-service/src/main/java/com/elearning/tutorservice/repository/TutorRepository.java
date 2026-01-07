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
        * Find tutor with all relationships for search indexing
        */
       @Query("SELECT t FROM Tutor t " +
                     "LEFT JOIN FETCH t.languages " +
                     "LEFT JOIN FETCH t.subjects " +
                     "LEFT JOIN FETCH t.availabilities " +
                     "LEFT JOIN FETCH t.certifications " +
                     "LEFT JOIN FETCH t.careerEntries " +
                     "WHERE t.id = :tutorId")
       java.util.Optional<Tutor> findByIdWithRelationships(@Param("tutorId") UUID tutorId);

       /**
        * Find all verified tutors with relationships for bulk indexing
        */
       @Query("SELECT DISTINCT t FROM Tutor t " +
                     "LEFT JOIN FETCH t.languages " +
                     "LEFT JOIN FETCH t.subjects " +
                     "LEFT JOIN FETCH t.availabilities " +
                     "WHERE t.isVerified = true")
       List<Tutor> findAllVerifiedWithRelationships();
}