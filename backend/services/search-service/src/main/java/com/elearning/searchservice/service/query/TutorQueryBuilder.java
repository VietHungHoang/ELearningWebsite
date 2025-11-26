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
        Boolean fuzzy = request.getFuzzy() != null ? request.getFuzzy() : true;
        
        // Build multi-match query based on language preference
        if (language != null && !language.trim().isEmpty()) {
            return buildLanguageSpecificQuery(keyword, language, fuzzy);
        } else {
            return buildMultiLanguageQuery(keyword, fuzzy);
        }
    }
    
    /**
     * Build query for specific language with field boosting
     */
    private Query buildLanguageSpecificQuery(String keyword, String language, boolean fuzzy) {
        List<String> fields = getFieldsForLanguage(language);
        
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
                })
        );
    }
    
    /**
     * Build query across all languages
     */
    private Query buildMultiLanguageQuery(String keyword, boolean fuzzy) {
        List<String> allFields = new ArrayList<>();
        allFields.addAll(getFieldsForLanguage("vi"));
        allFields.addAll(getFieldsForLanguage("en"));
        allFields.addAll(getFieldsForLanguage("ja"));
        
        return Query.of(q -> q
                .multiMatch(mm -> {
                    mm.query(keyword)
                      .fields(allFields)
                      .type(co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType.BestFields);
                    
                    if (fuzzy) {
                        mm.fuzziness("AUTO")
                          .prefixLength(2)
                          .maxExpansions(50);
                    }
                    
                    return mm;
                })
        );
    }
    
    /**
     * Get searchable fields for a specific language with boosting
     */
    private List<String> getFieldsForLanguage(String language) {
        String suffix = switch (language.toLowerCase()) {
            case "vi", "vietnamese" -> "Vi";
            case "en", "english" -> "En";
            case "ja", "japanese" -> "Ja";
            default -> "En"; // fallback to English
        };
        
        return List.of(
                // Name fields (highest boost)
                "name" + suffix + "^5.0",
                "name" + suffix + "Autocomplete^4.0",
                
                // Specialization (high boost)
                "specialization" + suffix + "^3.0",
                
                // Headline (medium-high boost)
                "headline" + suffix + "^2.5",
                
                // Subjects (medium boost) - nested field
                "subjects.name" + suffix + "^2.0",
                
                // Bio (medium-low boost)
                "bio" + suffix + "^1.5",
                
                // Education titles (low boost)
                "education.title" + suffix + "^1.2",
                
                // Experience titles (low boost)
                "experience.title" + suffix + "^1.2",
                
                // Active classes (low boost)
                "activeClasses.title" + suffix + "^1.1"
        );
    }
}
