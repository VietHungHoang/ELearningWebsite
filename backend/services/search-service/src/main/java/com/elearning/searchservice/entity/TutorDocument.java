package com.elearning.searchservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Document(indexName = "#{@elasticsearchConfig.getTutorIndexName()}")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorDocument {
    @Id
    private UUID id;

    @Field(type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Text)
    private String specialization;

    @Field(type = FieldType.Keyword)
    private String nationalityCode;

    @Field(type = FieldType.Double)
    private BigDecimal currentSessionFee;

    @Field(type = FieldType.Keyword)
    private String currency;

    @Field(type = FieldType.Double)
    private Double averageRating;

    @Field(type = FieldType.Keyword)
    private List<String> languages;

    @Field(type = FieldType.Keyword)
    private List<UUID> categoryIds;

    @Field(type = FieldType.Text)
    private String bio;

    @Field(type = FieldType.Integer)
    private Integer sessionDurationMinutes;

    @Field(type = FieldType.Boolean)
    private Boolean teachesInGroups;
}