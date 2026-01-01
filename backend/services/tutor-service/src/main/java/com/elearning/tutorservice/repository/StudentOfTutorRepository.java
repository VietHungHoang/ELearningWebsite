package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.StudentOfTutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface StudentOfTutorRepository extends JpaRepository<StudentOfTutor, UUID> {

    /**
     * Count new students (student-tutor relationships) created between dates
     */
    long countByCreatedAtBetween(LocalDate startDate, LocalDate endDate);

    /**
     * Get daily counts of new students between dates
     */
    @Query("SELECT DATE(s.createdAt), COUNT(s) FROM StudentOfTutor s WHERE DATE(s.createdAt) BETWEEN :startDate AND :endDate GROUP BY DATE(s.createdAt) ORDER BY DATE(s.createdAt)")
    List<Object[]> findDailyNewStudents(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}