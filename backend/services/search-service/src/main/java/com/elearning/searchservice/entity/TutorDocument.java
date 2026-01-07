package com.elearning.searchservice.entity;

import com.elearning.searchservice.dto.embedded.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Elasticsearch document for Tutor with multi-language support (Vietnamese,
 * English, Japanese)
 */
@Document(indexName = "#{@elasticsearchConfig.getTutorIndexName()}", createIndex = false // Disable auto-creation, we
                                                                                         // handle it manually with
                                                                                         // custom analyzers
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorDocument {

    @Id
    private UUID id;

    // ============= BASIC INFO =============
    @Field(type = FieldType.Boolean)
    private Boolean isVerified;

    @Field(type = FieldType.Boolean)
    private Boolean isActive;

    @Field(type = FieldType.Keyword)
    private String countryCode;

    // ============= FULL NAME (single field, multi-language search based on
    // countryCode) =============
    @Field(type = FieldType.Text, analyzer = "vietnamese_analyzer")
    private String fullNameVi;

    @Field(type = FieldType.Text, analyzer = "english_analyzer")
    private String fullNameEn;

    @Field(type = FieldType.Text, analyzer = "japanese_analyzer")
    private String fullNameJa;

    // Autocomplete fields
    @Field(type = FieldType.Text, analyzer = "vietnamese_autocomplete", searchAnalyzer = "vietnamese_analyzer")
    private String fullNameViAutocomplete;

    @Field(type = FieldType.Text, analyzer = "english_autocomplete", searchAnalyzer = "english_analyzer")
    private String fullNameEnAutocomplete;

    @Field(type = FieldType.Text, analyzer = "japanese_autocomplete", searchAnalyzer = "japanese_analyzer")
    private String fullNameJaAutocomplete;

    // ============= INTRODUCTION (single field, multi-language search based on
    // countryCode) =============
    @Field(type = FieldType.Text, analyzer = "vietnamese_analyzer")
    private String introductionVi;

    @Field(type = FieldType.Text, analyzer = "english_analyzer")
    private String introductionEn;

    @Field(type = FieldType.Text, analyzer = "japanese_analyzer")
    private String introductionJa;

    // ============= HEADLINE (single field, multi-language search based on
    // countryCode) =============
    @Field(type = FieldType.Text, analyzer = "vietnamese_analyzer")
    private String headlineVi;

    @Field(type = FieldType.Text, analyzer = "english_analyzer")
    private String headlineEn;

    @Field(type = FieldType.Text, analyzer = "japanese_analyzer")
    private String headlineJa;

    // ============= NESTED OBJECTS =============
    @Field(type = FieldType.Nested)
    private List<SubjectInfo> subjects;

    @Field(type = FieldType.Nested)
    private List<LanguageInfo> languages;

    @Field(type = FieldType.Nested)
    private List<CategoryInfo> categories;

    @Field(type = FieldType.Nested)
    private List<EducationInfo> education;

    @Field(type = FieldType.Nested)
    private List<ExperienceInfo> experience;

    @Field(type = FieldType.Nested)
    private List<ClassInfo> activeClasses;

    // ============= FILTER FIELDS (Keyword) =============
    @Field(type = FieldType.Keyword)
    private List<String> languageCodes;

    @Field(type = FieldType.Keyword)
    private List<UUID> categoryIds;

    @Field(type = FieldType.Keyword)
    private List<UUID> subjectIds;

    @Field(type = FieldType.Keyword)
    private String nationalityCode;

    // ============= NUMERIC FIELDS =============
    @Field(type = FieldType.Scaled_Float, scalingFactor = 100)
    private BigDecimal currentSessionFee;

    @Field(type = FieldType.Keyword)
    private String currency;

    @Field(type = FieldType.Integer)
    private Integer sessionDurationMinutes;

    @Field(type = FieldType.Float)
    private Double averageRating;

    @Field(type = FieldType.Integer)
    private Integer totalReviews;

    @Field(type = FieldType.Integer)
    private Integer totalStudents;

    @Field(type = FieldType.Float)
    private Double totalHoursTaught;

    @Field(type = FieldType.Integer)
    private Integer yearsOfExperience;

    // ============= BOOLEAN FILTERS =============
    @Field(type = FieldType.Boolean)
    private Boolean teachesInGroups;

    @Field(type = FieldType.Boolean)
    private Boolean hasVideo;

    @Field(type = FieldType.Boolean)
    private Boolean hasTrialLesson;

    @Field(type = FieldType.Boolean)
    private Boolean availableNow;

    // ============= AVAILABILITY =============
    @Field(type = FieldType.Keyword)
    private List<String> availableDays;

    @Field(type = FieldType.Keyword)
    private String timezone;

    // ============= RANKING SIGNALS =============
    @Field(type = FieldType.Float)
    private Double popularityScore;

    // ============= AUTOCOMPLETE =============
    @org.springframework.data.elasticsearch.annotations.CompletionField(maxInputLength = 100)
    private org.springframework.data.elasticsearch.core.suggest.Completion suggest;

    // ============= METADATA =============
    @Field(type = FieldType.Date, format = {}, pattern = "uuuu-MM-dd'T'HH:mm:ss||uuuu-MM-dd||epoch_millis")
    private LocalDateTime createdAt;

    @Field(type = FieldType.Date, format = {}, pattern = "uuuu-MM-dd'T'HH:mm:ss||uuuu-MM-dd||epoch_millis")
    private LocalDateTime updatedAt;

    @Field(type = FieldType.Date, format = {}, pattern = "uuuu-MM-dd'T'HH:mm:ss||uuuu-MM-dd||epoch_millis")
    private LocalDateTime lastActiveAt;
}