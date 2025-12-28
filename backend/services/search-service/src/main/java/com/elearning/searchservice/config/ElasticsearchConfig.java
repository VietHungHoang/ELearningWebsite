package com.elearning.searchservice.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.mapping.*;
import co.elastic.clients.elasticsearch.indices.CreateIndexRequest;
import co.elastic.clients.elasticsearch.indices.ExistsRequest;
import co.elastic.clients.elasticsearch.indices.IndexSettings;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Elasticsearch configuration with multi-language analyzers
 * Supports: Vietnamese, English, Japanese with autocomplete
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class ElasticsearchConfig {

    private final ElasticsearchClient elasticsearchClient;

    @Value("${app.elastic.index.tutors}")
    private String tutorIndexName;

    public String getTutorIndexName() {
        return tutorIndexName;
    }

    @PostConstruct
    public void init() {
        try {
            createTutorIndexIfNotExists();
        } catch (Exception e) {
            log.error("Failed to create Elasticsearch index", e);
        }
    }

    private void createTutorIndexIfNotExists() throws Exception {
        // Check if index exists
        ExistsRequest existsRequest = ExistsRequest.of(e -> e.index(tutorIndexName));
        boolean exists = elasticsearchClient.indices().exists(existsRequest).value();

        if (!exists) {
            log.info("Creating Elasticsearch index: {}", tutorIndexName);
            
            // Create index with settings AND mappings
            CreateIndexRequest request = CreateIndexRequest.of(c -> c
                    .index(tutorIndexName)
                    .settings(buildIndexSettings())
                    .mappings(buildMappings())
            );

            elasticsearchClient.indices().create(request);
            log.info("Successfully created index: {}", tutorIndexName);
        } else {
            log.info("Index already exists: {}", tutorIndexName);
        }
    }

    private IndexSettings buildIndexSettings() {
        return IndexSettings.of(s -> s
                .numberOfShards("3")
                .numberOfReplicas("1")
                .refreshInterval(t -> t.time("5s"))
                .analysis(a -> a
                        // ========== ANALYZERS ==========
                        .analyzer("vietnamese_analyzer", an -> an
                                .custom(ca -> ca
                                        .tokenizer("standard")
                                        .filter("lowercase", "asciifolding", "vietnamese_stop")
                                )
                        )
                        .analyzer("vietnamese_autocomplete", an -> an
                                .custom(ca -> ca
                                        .tokenizer("standard")
                                        .filter("lowercase", "asciifolding", "edge_ngram_filter")
                                )
                        )
                        .analyzer("english_analyzer", an -> an
                                .custom(ca -> ca
                                        .tokenizer("standard")
                                        .filter("lowercase", "english_stop", "english_stemmer")
                                )
                        )
                        .analyzer("english_autocomplete", an -> an
                                .custom(ca -> ca
                                        .tokenizer("standard")
                                        .filter("lowercase", "edge_ngram_filter")
                                )
                        )
                        // Japanese analyzer disabled - requires Kuromoji plugin installation
                        // TODO: Install analysis-kuromoji plugin in Elasticsearch
                        .analyzer("japanese_analyzer", an -> an
                                .custom(ca -> ca
                                        .tokenizer("standard")
                                        .filter("lowercase")
                                )
                        )
                        .analyzer("japanese_autocomplete", an -> an
                                .custom(ca -> ca
                                        .tokenizer("standard")
                                        .filter("lowercase", "edge_ngram_filter")
                                )
                        )
                        
                        // ========== FILTERS ==========
                        .filter("edge_ngram_filter", f -> f
                                .definition(d -> d
                                        .edgeNgram(en -> en
                                                .minGram(2)
                                                .maxGram(20)
                                        )
                                )
                        )
                        .filter("vietnamese_stop", f -> f
                                .definition(d -> d
                                        .stop(st -> st
                                                .stopwords("_vietnamese_")
                                        )
                                )
                        )
                        .filter("english_stop", f -> f
                                .definition(d -> d
                                        .stop(st -> st
                                                .stopwords("_english_")
                                        )
                                )
                        )
                        .filter("english_stemmer", f -> f
                                .definition(d -> d
                                        .stemmer(st -> st
                                                .language("english")
                                        )
                                )
                        )
                        // Kuromoji filter disabled - requires plugin installation
                        // .filter("kuromoji_stemmer", f -> f
                        //         .definition(d -> d
                        //                 .kuromojiStemmer(ks -> ks
                        //                         .minimumLength(4)
                        //                 )
                        //         )
                        // )
                )
        );
    }

    private TypeMapping buildMappings() {
        return TypeMapping.of(tm -> tm
                .properties("id", Property.of(p -> p.keyword(k -> k)))
                .properties("isVerified", Property.of(p -> p.boolean_(b -> b)))
                .properties("isActive", Property.of(p -> p.boolean_(b -> b)))
                .properties("countryCode", Property.of(p -> p.keyword(k -> k)))
                
                // Full name fields
                .properties("fullNameVi", Property.of(p -> p.text(t -> t
                        .analyzer("vietnamese_analyzer")
                        .fields("autocomplete", f -> f.text(ft -> ft
                                .analyzer("vietnamese_autocomplete")
                                .searchAnalyzer("vietnamese_analyzer")
                        ))
                )))
                .properties("fullNameEn", Property.of(p -> p.text(t -> t
                        .analyzer("english_analyzer")
                        .fields("autocomplete", f -> f.text(ft -> ft
                                .analyzer("english_autocomplete")
                                .searchAnalyzer("english_analyzer")
                        ))
                )))
                .properties("fullNameJa", Property.of(p -> p.text(t -> t
                        .analyzer("japanese_analyzer")
                        .fields("autocomplete", f -> f.text(ft -> ft
                                .analyzer("japanese_autocomplete")
                                .searchAnalyzer("japanese_analyzer")
                        ))
                )))
                
                // Headline fields
                .properties("headlineVi", Property.of(p -> p.text(t -> t.analyzer("vietnamese_analyzer"))))
                .properties("headlineEn", Property.of(p -> p.text(t -> t.analyzer("english_analyzer"))))
                .properties("headlineJa", Property.of(p -> p.text(t -> t.analyzer("japanese_analyzer"))))
                
                // Introduction fields
                .properties("introductionVi", Property.of(p -> p.text(t -> t.analyzer("vietnamese_analyzer"))))
                .properties("introductionEn", Property.of(p -> p.text(t -> t.analyzer("english_analyzer"))))
                .properties("introductionJa", Property.of(p -> p.text(t -> t.analyzer("japanese_analyzer"))))
                
                // Filters
                .properties("languageCodes", Property.of(p -> p.keyword(k -> k)))
                .properties("categoryIds", Property.of(p -> p.keyword(k -> k)))
                .properties("categoryNames", Property.of(p -> p.text(t -> t.analyzer("standard"))))
                
                // Price and rating
                .properties("minPrice", Property.of(p -> p.double_(d -> d)))
                .properties("maxPrice", Property.of(p -> p.double_(d -> d)))
                .properties("averageRating", Property.of(p -> p.double_(d -> d)))
                .properties("totalReviews", Property.of(p -> p.integer(i -> i)))
                
                // Ranking signals
                .properties("popularityScore", Property.of(p -> p.double_(d -> d)))
                .properties("totalStudents", Property.of(p -> p.integer(i -> i)))
                .properties("totalClasses", Property.of(p -> p.integer(i -> i)))
                
                // Timestamps
                .properties("createdAt", Property.of(p -> p.date(d -> d)))
                .properties("updatedAt", Property.of(p -> p.date(d -> d)))
                
                // Nested objects (using object type for simplicity)
                .properties("subjects", Property.of(p -> p.object(o -> o)))
                .properties("languages", Property.of(p -> p.object(o -> o)))
                .properties("categories", Property.of(p -> p.object(o -> o)))
                .properties("educations", Property.of(p -> p.object(o -> o)))
                .properties("experiences", Property.of(p -> p.object(o -> o)))
                .properties("upcomingClasses", Property.of(p -> p.object(o -> o)))
        );
    }
}
