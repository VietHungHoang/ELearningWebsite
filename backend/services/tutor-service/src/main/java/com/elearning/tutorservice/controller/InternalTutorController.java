package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.event.TutorIndexEvent;
import com.elearning.tutorservice.entity.Tutor;
import com.elearning.tutorservice.mapper.TutorIndexEventMapper;
import com.elearning.tutorservice.repository.TutorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Internal API for service-to-service communication
 * Used by search-service for bulk reindexing
 */
@Slf4j
@RestController
@RequestMapping("/internal/tutors")
@RequiredArgsConstructor
public class InternalTutorController {

    private final TutorRepository tutorRepository;
    private final TutorIndexEventMapper tutorIndexEventMapper;

    /**
     * Export all verified tutors for search indexing
     * Used by search-service for bulk reindex
     * 
     * GET /api/internal/tutors/export
     */
    @GetMapping("/export")
    public ResponseEntity<List<TutorIndexEvent>> exportAllTutors() {
        log.info("Exporting all verified tutors for search indexing");

        // Get base tutors without collections (no MultipleBagFetchException)
        List<Tutor> tutors = tutorRepository.findByIsVerifiedTrue();

        log.info("Found {} verified tutors to export", tutors.size());

        List<TutorIndexEvent> events = tutors.stream()
                .map(tutor -> {
                    UUID id = tutor.getId();

                    // Fetch each collection separately (1 at a time) to avoid
                    // MultipleBagFetchException
                    tutorRepository.findByIdWithSubjects(id)
                            .ifPresent(t -> tutor.setSubjects(t.getSubjects()));
                    tutorRepository.findByIdWithLanguages(id)
                            .ifPresent(t -> tutor.setLanguages(t.getLanguages()));
                    tutorRepository.findByIdWithAvailabilities(id)
                            .ifPresent(t -> tutor.setAvailabilities(t.getAvailabilities()));

                    TutorIndexEvent event = tutorIndexEventMapper.toEvent(tutor, "CREATED");
                    log.debug("Exported tutor {} - subjects: {}, languages: {}, availabilities: {}",
                            id,
                            tutor.getSubjects() != null ? tutor.getSubjects().size() : 0,
                            tutor.getLanguages() != null ? tutor.getLanguages().size() : 0,
                            tutor.getAvailabilities() != null ? tutor.getAvailabilities().size() : 0);
                    return event;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(events);
    }

    /**
     * Export a single tutor for search indexing
     * Used for manual sync when Kafka fails
     * 
     * GET /api/internal/tutors/{tutorId}/export
     */
    @GetMapping("/{tutorId}/export")
    public ResponseEntity<TutorIndexEvent> exportTutor(@PathVariable UUID tutorId) {
        log.info("Exporting tutor for search indexing: {}", tutorId);

        return tutorRepository.findById(tutorId)
                .map(tutor -> {
                    TutorIndexEvent event = tutorIndexEventMapper.toEvent(tutor, "CREATED");
                    return ResponseEntity.ok(event);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
