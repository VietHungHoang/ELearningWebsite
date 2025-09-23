package com.elearning.mediaservice.model;

import com.elearning.mediaservice.enums.VideoStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "videos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Video {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Lesson ID is required")
    @Column(nullable = false)
    private Long lessonId; // Reference to lesson in Course Service
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    // Original file info
    @NotBlank(message = "Original filename is required")
    private String originalFileName;
    
    @NotNull(message = "File size is required")
    private Long fileSize; // in bytes
    
    // Video metadata
    private Integer durationSeconds; // Video duration in seconds
    
    // Storage URLs
    private String videoUrl; // Final processed video URL
    private String thumbnailUrl; // Generated thumbnail URL
    
    // Processing info
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VideoStatus status = VideoStatus.UPLOADING;
    
    private String processingMessage; // Error message if processing failed
    
    // Upload tracking
    private String uploadId; // AWS multipart upload ID
    private Integer totalChunks; // Total number of chunks
    private Integer uploadedChunks; // Number of successfully uploaded chunks
    
    // Access control
    @Builder.Default
    private Boolean isPreview = false; // Free preview video
    
    @Builder.Default
    private Boolean isActive = true;
    
    // Analytics
    @Builder.Default
    private Integer viewCount = 0;
    
    // Audit fields
    @NotNull(message = "Uploaded by is required")
    private Long uploadedBy; // User ID who uploaded
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Processing timestamps
    private LocalDateTime processingStartedAt;
    private LocalDateTime processingCompletedAt;
}
