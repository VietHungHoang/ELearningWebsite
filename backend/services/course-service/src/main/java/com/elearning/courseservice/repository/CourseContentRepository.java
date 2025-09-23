package com.elearning.courseservice.repository;

import com.elearning.courseservice.model.CourseDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CourseContentRepository extends JpaRepository<CourseDetail, Long> {
    
    // Optional<CourseDetail> findByCourseId(Long courseId);
    
    // void deleteByCourseId(Long courseId);
    
    // boolean existsByCourseId(Long courseId);
}