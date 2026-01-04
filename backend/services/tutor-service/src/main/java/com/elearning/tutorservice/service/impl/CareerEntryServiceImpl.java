package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.request.CareerEntryRequest;
import com.elearning.tutorservice.dto.response.CareerEntryResponse;
import com.elearning.tutorservice.entity.CareerEntry;
import com.elearning.tutorservice.entity.Tutor;
import com.elearning.tutorservice.repository.CareerEntryRepository;
import com.elearning.tutorservice.repository.TutorRepository;
import com.elearning.tutorservice.service.CareerEntryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CareerEntryServiceImpl implements CareerEntryService {

    private final CareerEntryRepository careerEntryRepository;
    private final TutorRepository tutorRepository;

    @Override
    @Transactional
    public CareerEntryResponse createCareerEntry(UUID tutorId, CareerEntryRequest request) {
        log.info("Creating career entry for tutor: {}, type: {}", tutorId, request.getType());
        
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));

        CareerEntry entry = CareerEntry.builder()
                .tutor(tutor)
                .type(request.getType())
                .title(request.getTitle())
                .institution(request.getInstitution())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .location(request.getLocation())
                .description(request.getDescription())
                .build();

        entry = careerEntryRepository.save(entry);
        log.info("Created career entry with id: {}", entry.getId());
        
        return mapToResponse(entry);
    }

    @Override
    @Transactional
    public CareerEntryResponse updateCareerEntry(UUID tutorId, UUID entryId, CareerEntryRequest request) {
        log.info("Updating career entry: {} for tutor: {}", entryId, tutorId);
        
        CareerEntry entry = careerEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Career entry not found"));

        // Verify the entry belongs to the tutor
        if (!entry.getTutor().getId().equals(tutorId)) {
            throw new RuntimeException("Career entry does not belong to this tutor");
        }

        // Update fields
        if (request.getType() != null) {
            entry.setType(request.getType());
        }
        if (request.getTitle() != null) {
            entry.setTitle(request.getTitle());
        }
        if (request.getInstitution() != null) {
            entry.setInstitution(request.getInstitution());
        }
        if (request.getStartDate() != null) {
            entry.setStartDate(request.getStartDate());
        }
        entry.setEndDate(request.getEndDate()); // Can be null
        entry.setLocation(request.getLocation());
        entry.setDescription(request.getDescription());

        entry = careerEntryRepository.save(entry);
        log.info("Updated career entry: {}", entryId);
        
        return mapToResponse(entry);
    }

    @Override
    @Transactional
    public void deleteCareerEntry(UUID tutorId, UUID entryId) {
        log.info("Deleting career entry: {} for tutor: {}", entryId, tutorId);
        
        CareerEntry entry = careerEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Career entry not found"));

        // Verify the entry belongs to the tutor
        if (!entry.getTutor().getId().equals(tutorId)) {
            throw new RuntimeException("Career entry does not belong to this tutor");
        }

        careerEntryRepository.delete(entry);
        log.info("Deleted career entry: {}", entryId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CareerEntryResponse> getCareerEntriesByTutorId(UUID tutorId) {
        return careerEntryRepository.findByTutorIdOrderByStartDateDesc(tutorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CareerEntryResponse> getEducationsByTutorId(UUID tutorId) {
        return careerEntryRepository.findByTutorIdOrderByStartDateDesc(tutorId)
                .stream()
                .filter(e -> "EDUCATION".equals(e.getType()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CareerEntryResponse> getExperiencesByTutorId(UUID tutorId) {
        return careerEntryRepository.findByTutorIdOrderByStartDateDesc(tutorId)
                .stream()
                .filter(e -> "EXPERIENCE".equals(e.getType()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CareerEntryResponse mapToResponse(CareerEntry entry) {
        return CareerEntryResponse.builder()
                .id(entry.getId())
                .type(entry.getType())
                .title(entry.getTitle())
                .institution(entry.getInstitution())
                .startDate(entry.getStartDate())
                .endDate(entry.getEndDate())
                .location(entry.getLocation())
                .description(entry.getDescription())
                .build();
    }
}
