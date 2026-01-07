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
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @GetMapping("/export")
    public ResponseEntity<List<TutorIndexEvent>> exportAllTutors() {
        log.info("Exporting all verified tutors for search indexing");

        List<Tutor> tutors = tutorRepository.findByIsVerifiedTrue();
        log.info("Found {} verified tutors to export", tutors.size());

        List<TutorIndexEvent> events = tutors.stream()
                .map(tutor -> {
                    // Access lazy collections within transaction - Hibernate will fetch them
                    int subjectsCount = tutor.getSubjects() != null ? tutor.getSubjects().size() : 0;
                    int languagesCount = tutor.getLanguages() != null ? tutor.getLanguages().size() : 0;
                    int availabilitiesCount = tutor.getAvailabilities() != null ? tutor.getAvailabilities().size() : 0;
                    int careerEntriesCount = tutor.getCareerEntries() != null ? tutor.getCareerEntries().size() : 0;
                    int certificationsCount = tutor.getCertifications() != null ? tutor.getCertifications().size() : 0;

                    log.debug(
                            "Exporting tutor {} - subjects: {}, languages: {}, availabilities: {}, careerEntries: {}, certifications: {}",
                            tutor.getId(), subjectsCount, languagesCount, availabilitiesCount, careerEntriesCount,
                            certificationsCount);

                    return tutorIndexEventMapper.toEvent(tutor, "CREATED");
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
