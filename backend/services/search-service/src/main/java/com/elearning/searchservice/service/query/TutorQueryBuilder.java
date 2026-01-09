package com.elearning.searchservice.service.query;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import com.elearning.searchservice.dto.request.SearchTutorRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Builds multi-language search queries with boosting and fuzzy matching
 */
@Slf4j
@Component
public class TutorQueryBuilder {

    /**
     * Build main search query based on keyword and language preference
     */
    public Query buildSearchQuery(SearchTutorRequest request) {
        String keyword = request.getKeyword();

        // If no keyword, match all
        if (keyword == null || keyword.trim().isEmpty()) {
            return Query.of(q -> q.matchAll(m -> m));
        }

        String language = request.getLanguage();
        boolean fuzzy = request.getFuzzy() != null ? request.getFuzzy() : true;

        // Build combined query with nested queries for subjects/categories
        return buildCombinedQuery(keyword, language, fuzzy);
    }

    /**
     * Build combined query that includes:
     * 1. Multi-match on regular fields (fullName, headline, introduction)
     * 2. Nested queries for subjects and categories
     */
    private Query buildCombinedQuery(String keyword, String language, boolean fuzzy) {
        List<Query> shouldQueries = new ArrayList<>();

        // 1. Add multi-match query for regular (non-nested) fields
        shouldQueries.add(buildTextFieldsQuery(keyword, language, fuzzy));

        // 2. Add nested query for subjects
        shouldQueries.add(buildNestedSubjectsQuery(keyword, language, fuzzy));

        // 3. Add nested query for categories
        shouldQueries.add(buildNestedCategoriesQuery(keyword, language, fuzzy));

        // Combine with should (OR) - at least one should match
        return Query.of(q -> q
                .bool(b -> b
                        .should(shouldQueries)
                        .minimumShouldMatch("1")));
    }

    /**
     * Build nested query for subjects field
     */
    private Query buildNestedSubjectsQuery(String keyword, String language, boolean fuzzy) {
        String suffix = getLanguageSuffix(language);
        String fieldName = "subjects.name" + suffix;

        return Query.of(q -> q
                .nested(n -> n
                        .path("subjects")
                        .scoreMode(co.elastic.clients.elasticsearch._types.query_dsl.ChildScoreMode.Max)
                        .query(innerQ -> innerQ
                                .match(m -> {
                                    m.field(fieldName)
                                            .query(keyword)
                                            .boost(10.0f); // Highest boost for subjects

                                    if (fuzzy) {
                                        m.fuzziness("AUTO")
                                                .prefixLength(2)
                                                .maxExpansions(50);
                                    }

                                    return m;
                                }))));
    }

    /**
     * Build nested query for categories field
     */
    private Query buildNestedCategoriesQuery(String keyword, String language, boolean fuzzy) {
        String suffix = getLanguageSuffix(language);
        String fieldName = "categories.name" + suffix;

        return Query.of(q -> q
                .nested(n -> n
                        .path("categories")
                        .scoreMode(co.elastic.clients.elasticsearch._types.query_dsl.ChildScoreMode.Max)
                        .query(innerQ -> innerQ
                                .match(m -> {
                                    m.field(fieldName)
                                            .query(keyword)
                                            .boost(8.0f); // High boost for categories

                                    if (fuzzy) {
                                        m.fuzziness("AUTO")
                                                .prefixLength(2)
                                                .maxExpansions(50);
                                    }

                                    return m;
                                }))));
    }

    /**
     * Build multi-match query for regular text fields (non-nested)
     */
    private Query buildTextFieldsQuery(String keyword, String language, boolean fuzzy) {
        List<String> fields = getTextFields(language);

        return Query.of(q -> q
                .multiMatch(mm -> {
                    mm.query(keyword)
                            .fields(fields)
                            .type(co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType.BestFields);

                    if (fuzzy) {
                        mm.fuzziness("AUTO")
                                .prefixLength(2)
                                .maxExpansions(50);
                    }

                    return mm;
                }));
    }

    /**
     * Get language suffix for field names
     */
    private String getLanguageSuffix(String language) {
        if (language == null || language.trim().isEmpty()) {
            return "Vi"; // Default to Vietnamese
        }

        return switch (language.toLowerCase()) {
            case "vi", "vietnamese" -> "Vi";
            case "en", "english" -> "En";
            case "ja", "japanese" -> "Ja";
            default -> "Vi"; // Default to Vietnamese
        };
    }

    /**
     * Get searchable text fields (non-nested) with boosting
     */
    private List<String> getTextFields(String language) {
        String suffix = getLanguageSuffix(language);

        List<String> fields = new ArrayList<>();

        // Add fields for primary language
        fields.addAll(getFieldsForSuffix(suffix));

        // If no specific language, also add other languages
        if (language == null || language.trim().isEmpty()) {
            if (!suffix.equals("En")) {
                fields.addAll(getFieldsForSuffix("En"));
            }
            if (!suffix.equals("Ja")) {
                fields.addAll(getFieldsForSuffix("Ja"));
            }
        }

        return fields;
    }

    private List<String> getFieldsForSuffix(String suffix) {
        return List.of(
                // Headline (high boost - describes what tutor teaches)
                "headline" + suffix + "^5.0",

                // Full name fields (medium boost)
                "fullName" + suffix + "^3.0",
                "fullName" + suffix + "Autocomplete^2.5",

                // Introduction (low boost)
                "introduction" + suffix + "^1.5"
                
                // NOTE: Nested fields like education.title, experience.title, activeClasses.title
                // cannot be queried directly with multi_match. They require nested queries.
        );
    }
}
