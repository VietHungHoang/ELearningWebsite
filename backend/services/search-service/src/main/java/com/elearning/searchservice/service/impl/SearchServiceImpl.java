package com.elearning.searchservice.service.impl;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import com.elearning.searchservice.dto.request.SearchTutorRequest;
import com.elearning.searchservice.dto.request.TutorSuggestionsRequest;
import com.elearning.searchservice.dto.response.SearchFacets;
import com.elearning.searchservice.dto.response.TutorSearchResult;
import com.elearning.searchservice.dto.response.TutorSuggestion;
import com.elearning.searchservice.entity.TutorDocument;
import com.elearning.searchservice.service.SearchService;
import com.elearning.searchservice.service.query.TutorFilterBuilder;
import com.elearning.searchservice.service.query.TutorQueryBuilder;
import com.elearning.searchservice.service.query.TutorRankingBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHitSupport;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

        private final ElasticsearchOperations elasticsearchOperations;
        private final TutorQueryBuilder queryBuilder;
        private final TutorFilterBuilder filterBuilder;
        private final TutorRankingBuilder rankingBuilder;

        @Override
        public Page<TutorSearchResult> searchTutors(SearchTutorRequest request) {
                log.info("Searching tutors with request: {}", request);

                // 1. Build search query
                Query searchQuery = queryBuilder.buildSearchQuery(request);
                log.info("Built search query");

                // 2. Build filters
                List<Query> filters = filterBuilder.buildFilters(request);
                log.info("Built {} filters", filters.size());

                // 3. Combine query and filters
                Query boolQuery = Query.of(q -> q
                                .bool(b -> b
                                                .must(searchQuery)
                                                .filter(filters)));
                log.info("Combined query and filters");

                // 4. Wrap with function score for ranking
                Query finalQuery = rankingBuilder.buildFunctionScoreQuery(boolQuery);
                log.info("Built function score query");

                // 5. Build pageable
                int pageNumber = request.getPage() != null ? request.getPage() - 1 : 0; // Convert 1-based to 0-based
                Pageable pageable = PageRequest.of(pageNumber, request.getSize() != null ? request.getSize() : 10);
                log.info("Pageable: page={}, size={} (adjusted from request page {})", pageable.getPageNumber(),
                                pageable.getPageSize(), request.getPage());

                // 6. Build native query
                NativeQuery nativeQuery = NativeQuery.builder()
                                .withQuery(finalQuery)
                                .withPageable(pageable)
                                .build();
                log.info("Native query built with pageable. Query JSON: {}", finalQuery.toString());

                // 7. Execute search
                SearchHits<TutorDocument> searchHits = elasticsearchOperations.search(
                                nativeQuery,
                                TutorDocument.class,
                                IndexCoordinates.of("tutors_v1"));

                log.info("Found {} tutors", searchHits.getTotalHits());
                log.info("Search hits count: {}", searchHits.getSearchHits().size());

                // Log tutor IDs found
                List<UUID> foundTutorIds = searchHits.getSearchHits().stream()
                                .map(hit -> hit.getContent().getId())
                                .toList();
                log.info("Tutor IDs found: {}", foundTutorIds);

                // 8. Map to results
                return SearchHitSupport.searchPageFor(searchHits, pageable)
                                .map(this::mapToSearchResult);
        }

        @Override
        public SearchFacets getSearchFacets(SearchTutorRequest request) {
                // TODO: Implement aggregations
                return SearchFacets.builder().build();
        }

        @Override
        public List<TutorSuggestion> getTutorSuggestions(TutorSuggestionsRequest request) {
                log.info("Getting tutor suggestions (autocomplete) for keyword: {}, limit: {}",
                                request.getKeyword(), request.getLimit());

                if (request.getKeyword() == null || request.getKeyword().trim().isEmpty()) {
                        return Collections.emptyList();
                }

                try {
                        // Build Completion Suggester with a basic query
                        // NativeQuery requires a query, so we use match_all
                        String keyword = request.getKeyword().trim();
                        int limit = request.getLimit() != null ? request.getLimit() : 10;

                        // Build Completion Suggester
                        co.elastic.clients.elasticsearch.core.search.Suggester suggester = co.elastic.clients.elasticsearch.core.search.Suggester
                                        .of(s -> s
                                                        .suggesters("tutor-suggest", fs -> fs
                                                                        .prefix(keyword)
                                                                        .completion(c -> c
                                                                                        .field("suggest")
                                                                                        .skipDuplicates(true)
                                                                                        .size(limit)
                                                                                        .fuzzy(f -> f
                                                                                                        .fuzziness("AUTO")))));

                        // Build native query with match_all query and suggester
                        NativeQuery nativeQuery = NativeQuery.builder()
                                        .withQuery(Query.of(q -> q.matchAll(m -> m))) // Required: basic query
                                        .withSuggester(suggester)
                                        .build();

                        // Execute search
                        SearchHits<TutorDocument> searchHits = elasticsearchOperations.search(
                                        nativeQuery,
                                        TutorDocument.class,
                                        IndexCoordinates.of("tutors_v1"));

                        // Extract suggestions
                        List<TutorSuggestion> result = new ArrayList<>();

                        var suggestions = searchHits.getSuggest();
                        if (suggestions != null) {
                                var suggestionEntry = suggestions.getSuggestion("tutor-suggest");
                                if (suggestionEntry != null) {
                                        suggestionEntry.getEntries().forEach(entry -> {
                                                entry.getOptions().forEach(option -> {
                                                        String text = option.getText();
                                                        Float score = option.getScore() != null
                                                                        ? option.getScore().floatValue()
                                                                        : 0f;

                                                        result.add(TutorSuggestion.builder()
                                                                        .name(text)
                                                                        .score(score)
                                                                        .build());
                                                });
                                        });
                                }
                        }

                        log.info("Found {} suggestions for keyword: {}", result.size(), keyword);
                        return result;

                } catch (Exception e) {
                        log.error("Error getting tutor suggestions for keyword: {}", request.getKeyword(), e);
                        return Collections.emptyList();
                }
        }

        @Override
        @Deprecated
        public Page<UUID> searchTutors(
                        String keyword,
                        Boolean teachesInGroups,
                        String categoryName,
                        BigDecimal minPrice,
                        BigDecimal maxPrice,
                        List<String> languageCodes,
                        Pageable pageable) {
                // Convert to new request format
                SearchTutorRequest request = SearchTutorRequest.builder()
                                .keyword(keyword)
                                .minPrice(minPrice)
                                .maxPrice(maxPrice)
                                .languageCodes(languageCodes)
                                .page(pageable.getPageNumber())
                                .size(pageable.getPageSize())
                                .build();

                // Call new method and extract IDs
                return searchTutors(request).map(TutorSearchResult::getTutorId);
        }

        private TutorSearchResult mapToSearchResult(SearchHit<TutorDocument> hit) {
                return TutorSearchResult.builder()
                                .tutorId(hit.getContent().getId())
                                .score(hit.getScore())
                                .highlights(new HashMap<>()) // TODO: implement highlights
                                .matchedFields(new ArrayList<>()) // TODO: extract matched fields
                                .build();
        }

        private TutorSuggestion mapToSuggestion(SearchHit<TutorDocument> hit, String languageSuffix) {
                TutorDocument tutor = hit.getContent();

                // Select name and headline based on language
                String name = switch (languageSuffix) {
                        case "Vi" -> tutor.getFullNameVi();
                        case "Ja" -> tutor.getFullNameJa();
                        default -> tutor.getFullNameEn();
                };

                String headline = switch (languageSuffix) {
                        case "Vi" -> tutor.getHeadlineVi();
                        case "Ja" -> tutor.getHeadlineJa();
                        default -> tutor.getHeadlineEn();
                };

                return TutorSuggestion.builder()
                                .tutorId(tutor.getId())
                                .name(name)
                                .headline(headline)
                                .score(hit.getScore())
                                .build();
        }
}
