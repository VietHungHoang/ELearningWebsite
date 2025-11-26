package com.elearning.searchservice.service.impl;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import com.elearning.searchservice.dto.request.SearchTutorRequest;
import com.elearning.searchservice.dto.response.SearchFacets;
import com.elearning.searchservice.dto.response.TutorSearchResult;
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
        
        // 2. Build filters
        List<Query> filters = filterBuilder.buildFilters(request);
        
        // 3. Combine query and filters
        Query boolQuery = Query.of(q -> q
                .bool(b -> b
                        .must(searchQuery)
                        .filter(filters)
                )
        );
        
        // 4. Wrap with function score for ranking
        Query finalQuery = rankingBuilder.buildFunctionScoreQuery(boolQuery);
        
        // 5. Build pageable
        Pageable pageable = PageRequest.of(
                request.getPage() != null ? request.getPage() : 0,
                request.getSize() != null ? request.getSize() : 10
        );
        
        // 6. Build native query
        NativeQuery nativeQuery = NativeQuery.builder()
                .withQuery(finalQuery)
                .withPageable(pageable)
                .build();
        
        // 7. Execute search
        SearchHits<TutorDocument> searchHits = elasticsearchOperations.search(
                nativeQuery,
                TutorDocument.class,
                IndexCoordinates.of("tutors_v1")
        );
        
        log.info("Found {} tutors", searchHits.getTotalHits());
        
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
    @Deprecated
    public Page<UUID> searchTutors(
            String keyword,
            Boolean teachesInGroups,
            String categoryName,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            List<String> languageCodes,
            Pageable pageable
    ) {
        // Convert to new request format
        SearchTutorRequest request = SearchTutorRequest.builder()
                .keyword(keyword)
                .teachesInGroups(teachesInGroups)
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
}
