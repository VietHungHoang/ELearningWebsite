package com.elearning.searchservice.service;

import com.elearning.searchservice.dto.event.TutorApprovedEvent;
import com.elearning.searchservice.dto.event.TutorIndexEvent;
import com.elearning.searchservice.entity.TutorDocument;
import com.elearning.searchservice.mapper.TutorIndexMapper;
import com.elearning.searchservice.repository.TutorSearchRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Kafka consumer service for syncing tutor data to Elasticsearch
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TutorIndexConsumerService {

    private final ObjectMapper objectMapper;
    private final TutorIndexMapper tutorIndexMapper;
    private final TutorSearchRepository tutorSearchRepository;
    private final RestTemplate restTemplate;

    private static final String TUTOR_INDEX_SYNC_TOPIC = "tutor-index-sync";
    private static final String TUTOR_APPROVED_TOPIC = "tutor_approved";
    private static final String TUTOR_SERVICE_URL = "http://tutor-service:8080";

    /**
     * Listen to tutor-index-sync topic and index/update/delete tutor documents
     */
    @KafkaListener(topics = TUTOR_INDEX_SYNC_TOPIC, groupId = "search-service-group")
    public void handleTutorIndexEvent(String message) {
        try {
            log.debug("Received tutor index event: {}", message);

            // Deserialize event
            TutorIndexEvent event = objectMapper.readValue(message, TutorIndexEvent.class);

            log.info("Processing tutor index event: type={}, tutorId={}",
                    event.getEventType(), event.getTutorId());

            // Handle based on event type
            switch (event.getEventType()) {
                case "CREATED", "UPDATED" -> indexTutor(event);
                case "DELETED" -> deleteTutor(event);
                default -> log.warn("Unknown event type: {}", event.getEventType());
            }

        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize tutor index event: {}", message, e);
        } catch (Exception e) {
            log.error("Failed to process tutor index event", e);
        }
    }

    /**
     * Index or update tutor document with retry logic
     */
    private void indexTutor(TutorIndexEvent event) {
        int maxRetries = 3;
        int retryCount = 0;
        long retryDelayMs = 1000; // Start with 1 second delay

        while (retryCount < maxRetries) {
            try {
                // Map event to document
                TutorDocument document = tutorIndexMapper.toDocument(event);

                // Save to Elasticsearch
                TutorDocument saved = tutorSearchRepository.save(document);

                log.info("Successfully indexed tutor: id={}, name={}",
                        saved.getId(), saved.getFullNameEn());
                return; // Success, exit retry loop

            } catch (Exception e) {
                retryCount++;
                log.warn("Failed to index tutor (attempt {}/{}): tutorId={}, error={}",
                        retryCount, maxRetries, event.getTutorId(), e.getMessage());

                if (retryCount < maxRetries) {
                    try {
                        log.info("Retrying in {} ms...", retryDelayMs);
                        Thread.sleep(retryDelayMs);
                        retryDelayMs *= 2; // Exponential backoff
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        log.error("Retry interrupted for tutorId={}", event.getTutorId());
                        throw new RuntimeException("Retry interrupted", ie);
                    }
                } else {
                    log.error("Failed to index tutor after {} retries: tutorId={}", maxRetries, event.getTutorId(), e);
                    // TODO: Send to dead letter queue
                    throw e;
                }
            }
        }
    }

    /**
     * Delete tutor document
     */
    private void deleteTutor(TutorIndexEvent event) {
        try {
            tutorSearchRepository.deleteById(event.getTutorId());

            log.info("Successfully deleted tutor from index: id={}", event.getTutorId());

        } catch (Exception e) {
            log.error("Failed to delete tutor: tutorId={}", event.getTutorId(), e);
            throw e;
        }
    }

    /**
     * Listen to tutor_approved topic and fetch full tutor data to index
     */
    @KafkaListener(topics = TUTOR_APPROVED_TOPIC, groupId = "search-service-group")
    public void handleTutorApprovedEvent(String message) {
        try {
            log.debug("Received tutor approved event: {}", message);

            // Deserialize event
            TutorApprovedEvent event = objectMapper.readValue(message, TutorApprovedEvent.class);

            log.info("Processing tutor approved event: tutorId={}, fullName={}",
                    event.getTutorId(), event.getFullName());

            // Fetch full tutor data from tutor-service
            String url = TUTOR_SERVICE_URL + "/api/v1/tutors/" + event.getTutorId();

            // TODO: Call tutor-service API to get full tutor profile and index to
            // Elasticsearch
            // For now, just log the event
            log.info("Tutor approved and ready to be indexed: tutorId={}, email={}",
                    event.getTutorId(), event.getEmail());

        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize tutor approved event: {}", message, e);
        } catch (Exception e) {
            log.error("Failed to process tutor approved event", e);
        }
    }
}
