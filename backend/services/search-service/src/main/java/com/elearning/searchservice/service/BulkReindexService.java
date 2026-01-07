package com.elearning.searchservice.service;

import com.elearning.searchservice.dto.event.TutorIndexEvent;
import com.elearning.searchservice.entity.TutorDocument;
import com.elearning.searchservice.mapper.TutorIndexMapper;
import com.elearning.searchservice.repository.TutorSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service for bulk reindexing tutors from Tutor Service to Elasticsearch
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BulkReindexService {

    private final RestTemplate restTemplate;
    private final TutorIndexMapper tutorIndexMapper;
    private final TutorSearchRepository tutorSearchRepository;

    @Value("${services.tutor-service.url:http://tutor-service:8080}")
    private String tutorServiceUrl;

    /**
     * Reindex all tutors from Tutor Service
     */
    public ReindexResult reindexAllTutors() {
        log.info("Starting bulk reindex of all tutors");

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        try {
            // Fetch all tutors from Tutor Service
            // TODO: Implement pagination for large datasets
            String url = tutorServiceUrl + "/api/v1/internal/tutors/export";

            log.info("Fetching tutors from: {}", url);

            ResponseEntity<TutorIndexEvent[]> response = restTemplate.getForEntity(
                    url,
                    TutorIndexEvent[].class);

            if (response.getBody() == null) {
                log.warn("No tutors returned from Tutor Service");
                return new ReindexResult(0, 0, "No tutors to index");
            }

            List<TutorIndexEvent> tutors = Arrays.asList(response.getBody());
            log.info("Fetched {} tutors from Tutor Service", tutors.size());

            // Index each tutor
            tutors.forEach(event -> {
                try {
                    TutorDocument document = tutorIndexMapper.toDocument(event);
                    tutorSearchRepository.save(document);
                    successCount.incrementAndGet();

                    if (successCount.get() % 100 == 0) {
                        log.info("Indexed {} tutors so far...", successCount.get());
                    }
                } catch (Exception e) {
                    log.error("Failed to index tutor: tutorId={}", event.getTutorId(), e);
                    failureCount.incrementAndGet();
                }
            });

            log.info("Bulk reindex completed: success={}, failures={}",
                    successCount.get(), failureCount.get());

            return new ReindexResult(
                    successCount.get(),
                    failureCount.get(),
                    "Reindex completed successfully");

        } catch (Exception e) {
            log.error("Failed to bulk reindex tutors", e);
            return new ReindexResult(
                    successCount.get(),
                    failureCount.get(),
                    "Reindex failed: " + e.getMessage());
        }
    }

    /**
     * Delete all tutors from index
     */
    public void deleteAllTutors() {
        log.warn("Deleting all tutors from Elasticsearch index");
        tutorSearchRepository.deleteAll();
        log.info("All tutors deleted from index");
    }

    /**
     * Result of reindex operation
     */
    public record ReindexResult(
            int successCount,
            int failureCount,
            String message) {
    }
}
