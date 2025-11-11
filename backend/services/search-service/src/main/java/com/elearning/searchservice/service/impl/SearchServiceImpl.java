package com.elearning.searchservice.service.impl;

import co.elastic.clients.elasticsearch._types.FieldValue;
import com.elearning.searchservice.entity.TutorDocument;
import com.elearning.searchservice.service.SearchService;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHitSupport;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final ElasticsearchOperations elasticsearchOperations;

    private final List<String> tutorsFields = Arrays.asList(
        "name_vn",
        "name_en", 
        "bio_vn",
        "bio_en",
        "specialization_vn",
        "specialization_en"
    );

    @Override
    public Page<UUID> searchTutors(
        String keyword,
        Boolean teachesInGroups,
        String categoryName,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        List<String> languageCodes,
        Pageable pageable
    ) {
        
        Query query = null;
        
        // Add keyword search if provided
        if (keyword != null && !keyword.trim().isEmpty()) {
            query = Query.of(q -> q
                .multiMatch(mm -> mm
                    .query(keyword)
                    .fields(tutorsFields)
                    .fuzziness("AUTO")
                    )
                );
        } else {
            query = Query.of(q -> q
                .matchAll(ma -> ma)
            );
        }

        List<Query> filters = new ArrayList<>();

        // Add group filter if provided
        if(teachesInGroups != null && teachesInGroups == true) {
            filters.add(Query.of(q -> q
                .term(t -> t
                    .field("teachesInGroups")
                    .value(teachesInGroups)
                )
            ));
        }

        // Add category filter if provided
        if (categoryName != null && !categoryName.trim().isEmpty()) {
            filters.add(Query.of(q -> q
                .term(t -> t
                    .field("category_name")
                    .value(categoryName)
                )
            ));
        }

        // Add price range filter if provided
        if (minPrice != null || maxPrice != null) {
            filters.add(Query.of(q -> q
                .range(rq -> rq
                    .number(r -> {
                        r.field("currentSessionFee");
                        if (minPrice != null) {
                            r.gte(minPrice.doubleValue());
                        }
                        if (maxPrice != null) {
                            r.lte(maxPrice.doubleValue());
                        }
                        return r;
                    })
                )
            ));
        }

        // Add language filter if provided
        if (languageCodes != null && !languageCodes.isEmpty()) {

            List<FieldValue> values = languageCodes.stream()
                    .map(FieldValue::of)
                    .collect(Collectors.toList());

            filters.add(Query.of(q -> q
                    .terms(t -> t
                            .field("languages")
                            .terms(tv -> tv.value(values))
                    )
            ));
        }

        Query finalQuery = query;
        Query boolQuery = Query.of(q -> q
                .bool(b -> b
                    .must(finalQuery)
                    .filter(filters)
                )
        );

        NativeQuery nativeQuery = NativeQuery.builder()
                .withQuery(boolQuery)
                .withPageable(pageable)
                .build();

        // 5. GỬI ĐI: Thực thi truy vấn
        SearchHits<TutorDocument> searchHits = elasticsearchOperations.search(
                nativeQuery,
                TutorDocument.class,
                IndexCoordinates.of("tutors") // Chỉ định index
        );

        // 6. Xử lý kết quả (Giống code cũ)
        return SearchHitSupport.searchPageFor(searchHits, pageable)
                .map(this::mapToDTO);
    }

    private UUID mapToDTO(SearchHit<TutorDocument> hit) {
        return hit.getContent().getId();
    }
}