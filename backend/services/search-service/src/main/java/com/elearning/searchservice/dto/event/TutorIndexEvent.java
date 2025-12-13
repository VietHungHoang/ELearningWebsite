package com.elearning.searchservice.dto.event;

import com.elearning.searchservice.dto.embedded.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Kafka event for syncing tutor data to Elasticsearch
 * Published by Tutor Service when tutor is created/updated
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorIndexEvent {
    
    /**
     * Event metadata
     */
    private String eventType; // "CREATED", "UPDATED", "DELETED"
    private String timestamp;
    private UUID tutorId;
    
    // ============= BASIC INFO =============
    private Boolean isVerified;
    private Boolean isActive;
    
    // ============= MULTI-LANGUAGE NAME =============
    private String nameVi;
    private String nameEn;
    private String nameJa;
    
    // ============= MULTI-LANGUAGE BIO =============
    private String bioVi;
    private String bioEn;
    private String bioJa;
    
    // ============= MULTI-LANGUAGE SPECIALIZATION =============
    private String specializationVi;
    private String specializationEn;
    private String specializationJa;
    
    // ============= MULTI-LANGUAGE HEADLINE =============
    private String headlineVi;
    private String headlineEn;
    private String headlineJa;
    
    // ============= NESTED OBJECTS =============
    private List<SubjectInfo> subjects;
    private List<LanguageInfo> languages;
    private List<CategoryInfo> categories;
    private List<EducationInfo> education;
    private List<ExperienceInfo> experience;
    private List<ClassInfo> activeClasses;
    
    // ============= FILTER FIELDS =============
    private List<String> languageCodes;
    private List<UUID> categoryIds;
    private List<UUID> subjectIds;
    private String nationalityCode;
    
    // ============= NUMERIC FIELDS =============
    private BigDecimal currentSessionFee;
    private String currency;
    private Integer sessionDurationMinutes;
    private Double averageRating;
    private Integer totalReviews;
    private Integer totalStudents;
    private Double totalHoursTaught;
    private Integer yearsOfExperience;
    
    // ============= BOOLEAN FILTERS =============
    private Boolean teachesInGroups;
    private Boolean hasVideo;
    private Boolean hasTrialLesson;
    private Boolean availableNow;
    
    // ============= AVAILABILITY =============
    private List<String> availableDays;
    private String timezone;
    
    // ============= RANKING SIGNALS =============
    private Double popularityScore;
    private Double responseRate;
    private Double completionRate;
    
    // ============= METADATA =============
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastActiveAt;
}
