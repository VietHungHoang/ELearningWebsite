package com.elearning.searchservice.repository;

import com.elearning.searchservice.entity.TutorDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface TutorSearchRepository extends ElasticsearchRepository<TutorDocument, UUID> {

    @Query("{\"bool\": {\"must\": [" +
            "{\"multi_match\": {\"query\": ?0, \"fields\": [\"name\", \"specialization\", \"bio\"]}}," +
            "{\"terms\": {\"languages\": ?1}}," +
            "{\"range\": {\"currentSessionFee\": {\"gte\": ?2, \"lte\": ?3}}}," +
            "{\"terms\": {\"categoryIds\": ?4}}," +
            "]}}")
    Page<TutorDocument> searchByFilters(String keyword, List<String> languageCodes, BigDecimal minPrice, BigDecimal maxPrice,
                                        List<UUID> categoryIds, Pageable pageable);
}