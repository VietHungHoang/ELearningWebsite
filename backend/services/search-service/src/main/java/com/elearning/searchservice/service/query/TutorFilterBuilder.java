package com.elearning.searchservice.service.query;

import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import com.elearning.searchservice.dto.request.SearchTutorRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Builds filter queries for tutor search
 */
@Slf4j
@Component
public class TutorFilterBuilder {

    /**
     * Build all filter queries from request
     */
    public List<Query> buildFilters(SearchTutorRequest request) {
        List<Query> filters = new ArrayList<>();
        
        // Always filter by active tutors
        filters.add(buildBooleanFilter("isActive", true));
        
        // Price range filter
        if (request.getMinPrice() != null || request.getMaxPrice() != null) {
            filters.add(buildPriceRangeFilter(request));
        }
        
        // Language codes filter
        if (request.getLanguageCodes() != null && !request.getLanguageCodes().isEmpty()) {
            filters.add(buildLanguageCodesFilter(request.getLanguageCodes()));
        }
        
        // Category IDs filter
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            filters.add(buildCategoryIdsFilter(request.getCategoryIds()));
        }
        
        // Subject IDs filter
        if (request.getSubjectIds() != null && !request.getSubjectIds().isEmpty()) {
            filters.add(buildSubjectIdsFilter(request.getSubjectIds()));
        }
        
        // Rating filter
        if (request.getMinRating() != null) {
            filters.add(buildMinRatingFilter(request.getMinRating()));
        }
        
        // Available days filter
        if (request.getAvailableDays() != null && !request.getAvailableDays().isEmpty()) {
            filters.add(buildAvailableDaysFilter(request.getAvailableDays()));
        }
        
        // Nationality filter
        if (request.getNationalityCode() != null && !request.getNationalityCode().trim().isEmpty()) {
            filters.add(buildTermFilter("nationalityCode", request.getNationalityCode()));
        }
        
        // Boolean filters
        if (request.getTeachesInGroups() != null) {
            filters.add(buildBooleanFilter("teachesInGroups", request.getTeachesInGroups()));
        }
        
        if (Boolean.TRUE.equals(request.getOnlyVerified())) {
            filters.add(buildBooleanFilter("isVerified", true));
        }
        
        if (Boolean.TRUE.equals(request.getHasVideo())) {
            filters.add(buildBooleanFilter("hasVideo", true));
        }
        
        if (Boolean.TRUE.equals(request.getAvailableNow())) {
            filters.add(buildBooleanFilter("availableNow", true));
        }
        
        return filters;
    }
    
    private Query buildPriceRangeFilter(SearchTutorRequest request) {
        return Query.of(q -> q
                .range(r -> {
                    r.number(n -> {
                        n.field("currentSessionFee");
                        if (request.getMinPrice() != null) {
                            n.gte(request.getMinPrice().doubleValue());
                        }
                        if (request.getMaxPrice() != null) {
                            n.lte(request.getMaxPrice().doubleValue());
                        }
                        return n;
                    });
                    return r;
                })
        );
    }
    
    private Query buildLanguageCodesFilter(List<String> languageCodes) {
        List<FieldValue> values = languageCodes.stream()
                .map(FieldValue::of)
                .collect(Collectors.toList());
        
        return Query.of(q -> q
                .terms(t -> t
                        .field("languageCodes")
                        .terms(tv -> tv.value(values))
                )
        );
    }
    
    private Query buildCategoryIdsFilter(List<UUID> categoryIds) {
        List<FieldValue> values = categoryIds.stream()
                .map(id -> FieldValue.of(id.toString()))
                .collect(Collectors.toList());
        
        return Query.of(q -> q
                .terms(t -> t
                        .field("categoryIds")
                        .terms(tv -> tv.value(values))
                )
        );
    }
    
    private Query buildSubjectIdsFilter(List<UUID> subjectIds) {
        List<FieldValue> values = subjectIds.stream()
                .map(id -> FieldValue.of(id.toString()))
                .collect(Collectors.toList());
        
        return Query.of(q -> q
                .terms(t -> t
                        .field("subjectIds")
                        .terms(tv -> tv.value(values))
                )
        );
    }
    
    private Query buildMinRatingFilter(Double minRating) {
        return Query.of(q -> q
                .range(r -> r
                        .number(n -> {
                                n.field("averageRating");
                                n.gte(minRating);
                                return n;
                        })
                )
        );
    }
    
    private Query buildAvailableDaysFilter(List<String> availableDays) {
        List<FieldValue> values = availableDays.stream()
                .map(FieldValue::of)
                .collect(Collectors.toList());
        
        return Query.of(q -> q
                .terms(t -> t
                        .field("availableDays")
                        .terms(tv -> tv.value(values))
                )
        );
    }
    
    private Query buildTermFilter(String field, String value) {
        return Query.of(q -> q
                .term(t -> t
                        .field(field)
                        .value(value)
                )
        );
    }
    
    private Query buildBooleanFilter(String field, Boolean value) {
        return Query.of(q -> q
                .term(t -> t
                        .field(field)
                        .value(value)
                )
        );
    }
}
