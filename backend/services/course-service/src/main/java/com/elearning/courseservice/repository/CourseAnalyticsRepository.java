package com.elearning.courseservice.repository;

import com.elearning.courseservice.model.CourseAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CourseAnalyticsRepository extends JpaRepository<CourseAnalytics, Long> {
    
    // Optional<CourseAnalytics> findByCourseId(Long courseId);
    
    // void deleteByCourseId(Long courseId);
    
    // boolean existsByCourseId(Long courseId);
    
    // List<CourseAnalytics> findByIsFeaturedTrue();
    
    // @Query("SELECT ca FROM CourseAnalytics ca WHERE ca.averageRating >= :minRating ORDER BY ca.averageRating DESC")
    // List<CourseAnalytics> findByAverageRatingGreaterThanEqual(@Param("minRating") BigDecimal minRating);
    
    // @Query("SELECT ca FROM CourseAnalytics ca ORDER BY ca.enrolledCount DESC")
    // List<CourseAnalytics> findMostEnrolledCourses();
    
    // @Query("SELECT ca FROM CourseAnalytics ca ORDER BY ca.averageRating DESC, ca.ratingCount DESC")
    // List<CourseAnalytics> findTopRatedCourses();
}