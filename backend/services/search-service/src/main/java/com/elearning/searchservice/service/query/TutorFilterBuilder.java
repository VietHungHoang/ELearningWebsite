package com.elearning.searchservice.service.query;

import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import com.elearning.searchservice.dto.request.ClassType;
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

        // Category ID filter
        if (request.getCategoryId() != null) {
            filters.add(buildCategoryIdFilter(request.getCategoryId()));
        }

        // Subject ID filter
        if (request.getSubjectId() != null) {
            filters.add(buildSubjectIdFilter(request.getSubjectId()));
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
        if (request.getHasGroup() != null) {
            filters.add(buildBooleanFilter("teachesInGroups", request.getHasGroup()));
        }

        // Class type filter
        if (request.getClassType() != null && request.getClassType() != ClassType.ALL) {
            boolean teachesInGroups = request.getClassType() == ClassType.GROUP;
            filters.add(buildBooleanFilter("teachesInGroups", teachesInGroups));
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
                }));
    }

    private Query buildLanguageCodesFilter(List<String> languageCodes) {
        List<FieldValue> values = languageCodes.stream()
                .map(FieldValue::of)
                .collect(Collectors.toList());

        return Query.of(q -> q
                .terms(t -> t
                        .field("languageCodes")
                        .terms(tv -> tv.value(values))));
    }

    private Query buildCategoryIdFilter(UUID categoryId) {
        return Query.of(q -> q
                .term(t -> t
                        .field("categoryIds")
                        .value(categoryId.toString())));
    }

    private Query buildSubjectIdFilter(UUID subjectId) {
        return Query.of(q -> q
                .term(t -> t
                        .field("subjectIds")
                        .value(subjectId.toString())));
    }

    private Query buildMinRatingFilter(Double minRating) {
        return Query.of(q -> q
                .range(r -> r
                        .number(n -> {
                            n.field("averageRating");
                            n.gte(minRating);
                            return n;
                        })));
    }

    private Query buildAvailableDaysFilter(List<String> availableDays) {
        List<FieldValue> values = availableDays.stream()
                .map(FieldValue::of)
                .collect(Collectors.toList());

        return Query.of(q -> q
                .terms(t -> t
                        .field("availableDays")
                        .terms(tv -> tv.value(values))));
    }

    private Query buildTermFilter(String field, String value) {
        return Query.of(q -> q
                .term(t -> t
                        .field(field)
                        .value(value)));
    }

    private Query buildBooleanFilter(String field, Boolean value) {
        return Query.of(q -> q
                .term(t -> t
                        .field(field)
                        .value(value)));
    }
}
