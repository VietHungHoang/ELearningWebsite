package com.elearning.tutorservice.repository;

import com.elearning.tutorservice.entity.StudentOfTutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface StudentOfTutorRepository extends JpaRepository<StudentOfTutor, UUID> {

    /**
     * Count new students (student-tutor relationships) created between dates
     */
    @Query("SELECT COUNT(s) FROM StudentOfTutor s WHERE DATE(s.createdAt) BETWEEN :startDate AND :endDate")
    long countByCreatedAtBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Get daily counts of new students between dates
     */
    @Query("SELECT DATE(s.createdAt), COUNT(s) FROM StudentOfTutor s WHERE DATE(s.createdAt) BETWEEN :startDate AND :endDate GROUP BY DATE(s.createdAt) ORDER BY DATE(s.createdAt)")
    List<Object[]> findDailyNewStudents(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Get monthly student statistics for a tutor in the last 12 months
     */
    @Query("SELECT YEAR(s.createdAt) as year, MONTH(s.createdAt) as month, COUNT(DISTINCT s.studentId) as students " +
            "FROM StudentOfTutor s " +
            "WHERE s.tutorId = :tutorId AND s.createdAt >= :startDate " +
            "GROUP BY YEAR(s.createdAt), MONTH(s.createdAt) " +
            "ORDER BY YEAR(s.createdAt) DESC, MONTH(s.createdAt) DESC")
    List<Object[]> getMonthlyStudentStats(@Param("tutorId") UUID tutorId, @Param("startDate") LocalDateTime startDate);
}