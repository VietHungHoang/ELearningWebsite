package com.elearning.courseservice.repository;

import com.elearning.courseservice.model.Course;
import com.elearning.courseservice.projection.CourseBasicProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    // Optimized query for basic course info - only select needed fields
    @Query("SELECT " +
           "c.id as id, " +
           "c.title as title, " +
           "c.status as status, " +
           "c.level as level, " +
           "cat.id as categoryId, " +
           "cat.parent.id as parentCategoryId, " +
           "cd.language.id as languageId, " +
           "cd.shortDescription as shortDescription, " +
           "cd.description as description " +
           "FROM Course c " +
           "LEFT JOIN c.category cat " +
           "LEFT JOIN c.content cd " +
           "WHERE c.id = :courseId")
    Optional<CourseBasicProjection> findBasicCourseById(@Param("courseId") Long courseId);

//     // Find courses by instructor
//     List<Course> findByInstructorId(Long instructorId);
    
//     Page<Course> findByInstructorId(Long instructorId, Pageable pageable);

//     // Find by status
//     List<Course> findByStatus(CourseStatus status);
    
//     Page<Course> findByStatus(CourseStatus status, Pageable pageable);

//     // Find by category ID
//     List<Course> findByCategoryId(Long categoryId);
    
//     Page<Course> findByCategoryId(Long categoryId, Pageable pageable);

//     // Find by level
//     List<Course> findByLevel(CourseLevel level);


//     // Find active courses
//     List<Course> findByIsActiveTrue();
    
//     Page<Course> findByIsActiveTrue(Pageable pageable);

//     // Search by title containing keyword
//     @Query("SELECT c FROM Course c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
//     List<Course> findByTitleContaining(@Param("keyword") String keyword);
    
//     Page<Course> findByTitleContainingIgnoreCase(String title, Pageable pageable);

//     // Find courses by price range
//     @Query("SELECT c FROM Course c WHERE c.price BETWEEN :minPrice AND :maxPrice")
//     List<Course> findByPriceBetween(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);

//     // Find courses by rating above threshold
//     @Query("SELECT c FROM Course c WHERE c.averageRating >= :minRating")
//     List<Course> findByAverageRatingGreaterThanEqual(@Param("minRating") BigDecimal minRating);

//     // Find most enrolled courses
//     @Query("SELECT c FROM Course c ORDER BY c.enrolledCount DESC")
//     List<Course> findMostEnrolledCourses(Pageable pageable);

//     // Find recently created courses
//     @Query("SELECT c FROM Course c WHERE c.isActive = true ORDER BY c.createdAt DESC")
//     List<Course> findRecentCourses(Pageable pageable);

//     // Count courses by instructor
//     Long countByInstructorId(Long instructorId);

//     // Count courses by status
//     Long countByStatus(CourseStatus status);

//     // Count courses by category ID
//     Long countByCategoryId(Long categoryId);

//     // Check if title exists
//     boolean existsByTitle(String title);

//     // Find courses with specific filters
//     @Query("SELECT c FROM Course c WHERE " +
//            "(:categoryId IS NULL OR c.category.id = :categoryId) AND " +
//            "(:level IS NULL OR c.level = :level) AND " +
//            "(:status IS NULL OR c.status = :status) AND " +
//            "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
//            "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
//            "c.isActive = true")
//     Page<Course> findCoursesWithFilters(@Param("categoryId") Long categoryId,
//                                        @Param("level") CourseLevel level,
//                                        @Param("status") CourseStatus status,
//                                        @Param("minPrice") BigDecimal minPrice,
//                                        @Param("maxPrice") BigDecimal maxPrice,
//                                        Pageable pageable);
}
