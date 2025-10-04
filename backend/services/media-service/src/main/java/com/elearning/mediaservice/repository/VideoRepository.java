package com.elearning.mediaservice.repository;

import com.elearning.mediaservice.enums.VideoStatus;
import com.elearning.mediaservice.model.Video;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    
    // Find by upload ID
    Optional<Video> findByUploadId(String uploadId);
    
    // Find videos by lesson
    List<Video> findByLessonIdAndIsActiveTrue(Long lessonId);
    
    Page<Video> findByLessonIdAndIsActiveTrue(Long lessonId, Pageable pageable);
    
    // Find videos by status
    List<Video> findByStatus(VideoStatus status);
    
    Page<Video> findByStatusAndIsActiveTrue(VideoStatus status, Pageable pageable);
    
    // Find videos by uploader
    Page<Video> findByUploadedByAndIsActiveTrue(Long uploadedBy, Pageable pageable);
    
    // Find preview videos
    List<Video> findByIsPreviewTrueAndStatusAndIsActiveTrueOrderByCreatedAtDesc(VideoStatus status);
    
    Page<Video> findByIsPreviewTrueAndIsActiveTrue(Pageable pageable);
    
    // Count videos by lesson
    long countByLessonIdAndIsActiveTrue(Long lessonId);
    
    // Count videos by status
    long countByStatus(VideoStatus status);
    
    long countByStatusAndIsActiveTrue(VideoStatus status);
    
    // Find videos needing processing
    @Query("SELECT v FROM Video v WHERE v.status = :status AND v.processingStartedAt IS NULL")
    List<Video> findVideosNeedingProcessing(@Param("status") VideoStatus status);
    
    // Find videos by multiple lessons
    @Query("SELECT v FROM Video v WHERE v.lessonId IN :lessonIds AND v.isActive = true AND v.status = :status ORDER BY v.createdAt ASC")
    List<Video> findByLessonIdsAndStatus(@Param("lessonIds") List<Long> lessonIds, @Param("status") VideoStatus status);
}
