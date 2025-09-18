package com.elearning.learnerservice.repository;

import com.elearning.learnerservice.enums.ProgressStatus;
import com.elearning.learnerservice.model.LearnerProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface LearnerProgressRepository extends JpaRepository<LearnerProgress, Long> {
    
    // Find progress by learner and course
    List<LearnerProgress> findByLearnerIdAndCourseIdOrderByLastWatchedAtDesc(Long learnerId, Long courseId);
    
    // Find progress by learner, course and video
    Optional<LearnerProgress> findByLearnerIdAndCourseIdAndVideoId(Long learnerId, Long courseId, Long videoId);
    
    // Find progress by video
    Optional<LearnerProgress> findByLearnerIdAndVideoId(Long learnerId, Long videoId);
    
    // Find progress by lesson
    List<LearnerProgress> findByLearnerIdAndLessonId(Long learnerId, Long lessonId);
    
    // Find by status
    List<LearnerProgress> findByLearnerIdAndCourseIdAndStatus(Long learnerId, Long courseId, ProgressStatus status);
    
    // Recent progress
    List<LearnerProgress> findByLearnerIdOrderByLastWatchedAtDesc(Long learnerId, Pageable pageable);
    
    // Completed content
    List<LearnerProgress> findByLearnerIdAndIsCompletedTrueOrderByCompletedAtDesc(Long learnerId);
    
    // Course completion statistics
    @Query("SELECT COUNT(lp) FROM LearnerProgress lp WHERE lp.learnerId = :learnerId AND lp.courseId = :courseId AND lp.isCompleted = true")
    long countCompletedContentByLearnerAndCourse(@Param("learnerId") Long learnerId, @Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(lp) FROM LearnerProgress lp WHERE lp.learnerId = :learnerId AND lp.courseId = :courseId")
    long countTotalContentByLearnerAndCourse(@Param("learnerId") Long learnerId, @Param("courseId") Long courseId);
    
    // Average watch percentage by course
    @Query("SELECT AVG(lp.watchPercentage) FROM LearnerProgress lp WHERE lp.courseId = :courseId AND lp.watchPercentage > 0")
    Double getAverageWatchPercentageByCourse(@Param("courseId") Long courseId);
    
    // Total watch time by learner
    @Query("SELECT SUM(lp.watchTimeSeconds) FROM LearnerProgress lp WHERE lp.learnerId = :learnerId")
    Long getTotalWatchTimeByLearner(@Param("learnerId") Long learnerId);
    
    // Find learners who watched specific video
    @Query("SELECT lp FROM LearnerProgress lp WHERE lp.videoId = :videoId AND lp.watchPercentage >= :minPercentage")
    List<LearnerProgress> findLearnersWhoWatchedVideo(@Param("videoId") Long videoId, @Param("minPercentage") BigDecimal minPercentage);
    
    // Bookmarked content
    List<LearnerProgress> findByLearnerIdAndIsBookmarkedTrueOrderByLastWatchedAtDesc(Long learnerId);
    
    // Analytics - drop off analysis
    @Query("SELECT lp FROM LearnerProgress lp WHERE lp.courseId = :courseId AND lp.watchPercentage BETWEEN :minPercent AND :maxPercent")
    List<LearnerProgress> findProgressByWatchPercentageRange(@Param("courseId") Long courseId, 
                                                           @Param("minPercent") BigDecimal minPercent, 
                                                           @Param("maxPercent") BigDecimal maxPercent);
}
