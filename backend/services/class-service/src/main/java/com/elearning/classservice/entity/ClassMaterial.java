package com.elearning.classservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Entity to store class material metadata (files stored in S3)
 */
@Entity
@Table(name = "class_materials")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassMaterial extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;
    
    @Column(name = "name", nullable = false)
    private String name; // e.g., "Chapter_3_Notes.pdf"
    
    @Column(name = "type", nullable = false)
    private String type; // e.g., "PDF", "Video", "Document"
    
    @Column(name = "s3_url", nullable = false)
    private String s3Url; // S3 file URL
    
    @Column(name = "upload_date", nullable = false)
    private LocalDate uploadDate;
    
    @Column(name = "file_size")
    private Long fileSize; // in bytes
    
    @Column(name = "description")
    private String description;
}
