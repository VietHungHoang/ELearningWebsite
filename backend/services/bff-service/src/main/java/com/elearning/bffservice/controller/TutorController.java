package com.elearning.bffservice.controller;

import com.elearning.bffservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.bffservice.dto.tutor.request.GetTutorStudentsRequest;
import com.elearning.bffservice.dto.ApiResponse;
import com.elearning.bffservice.dto.response.BookedSessionResponse;
import com.elearning.bffservice.dto.student.response.StudentResponse;
import com.elearning.bffservice.dto.response.StudentDetailResponse;
import com.elearning.bffservice.dto.response.ClassResponse;
import com.elearning.bffservice.dto.enums.ScheduleStatus;
import com.elearning.bffservice.dto.tutor.response.AvailabilityListResponse;
import com.elearning.bffservice.bff.tutor.response.TutorBffResponse;
import com.elearning.bffservice.bff.tutor.response.TutorDetailBffResponse;
import com.elearning.bffservice.dto.request.UpdateTutorProfileRequest;
import com.elearning.bffservice.bff.tutor.request.TutorSearchBffRequest;
import com.elearning.bffservice.dto.event.TutorProfileUpdatedEvent;
import com.elearning.bffservice.service.KafkaProducerService;
import com.elearning.bffservice.service.TutorService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/v1/bff")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;
    private final KafkaProducerService kafkaProducerService;

    @GetMapping("/search/tutors")
    public ResponseEntity<ApiResponse<Page<TutorBffResponse>>> searchTutors(
            @ModelAttribute TutorSearchBffRequest request) {

        Page<TutorBffResponse> result = tutorService.searchTutors(request);
        ApiResponse<Page<TutorBffResponse>> response = ApiResponse.success(result, "Tutors searched successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("tutors/{tutorId}/students")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getTutorStudents(
            @PathVariable UUID tutorId,
            @ModelAttribute GetTutorStudentsRequest request) {

        Page<StudentResponse> result = tutorService.getTutorStudents(tutorId, request);
        ApiResponse<Page<StudentResponse>> response = ApiResponse.success(result, "Students retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Get detailed information about a specific student
     */
    @GetMapping("/{tutorId}/students/{studentId}/detail")
    public ResponseEntity<ApiResponse<StudentDetailResponse>> getStudentDetail(
            @PathVariable UUID tutorId,
            @PathVariable UUID studentId) {

        StudentDetailResponse result = tutorService.getStudentDetail(tutorId, studentId);
        ApiResponse<StudentDetailResponse> response = ApiResponse.success(result,
                "Student detail retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Get all classes of a tutor with pagination
     */
    @GetMapping("/{tutorId}/classes")
    public ResponseEntity<ApiResponse<Page<ClassResponse>>> getClasses(
            @PathVariable UUID tutorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Page<ClassResponse> result = tutorService.getClasses(tutorId, page, limit);
        ApiResponse<Page<ClassResponse>> response = ApiResponse.success(result, "Classes retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Update tutor profile with aggregated data from multiple services
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Void>> updateTutorProfile(@RequestBody UpdateTutorProfileRequest request) {
        // Combine education and experience into careerEntries with type
        List<TutorProfileUpdatedEvent.CareerEntryInfo> careerEntries = new java.util.ArrayList<>();

        if (request.getEducation() != null) {
            request.getEducation().forEach(entry -> careerEntries.add(TutorProfileUpdatedEvent.CareerEntryInfo.builder()
                    .type("EDUCATION")
                    .title(entry.getTitle())
                    .institution(entry.getInstitution())
                    .startDate(entry.getStartDate())
                    .endDate(entry.getEndDate())
                    .location(entry.getLocation())
                    .description(entry.getDescription())
                    .build()));
        }

        if (request.getExperience() != null) {
            request.getExperience()
                    .forEach(entry -> careerEntries.add(TutorProfileUpdatedEvent.CareerEntryInfo.builder()
                            .type("EXPERIENCE")
                            .title(entry.getTitle())
                            .institution(entry.getInstitution())
                            .startDate(entry.getStartDate())
                            .endDate(entry.getEndDate())
                            .location(entry.getLocation())
                            .description(entry.getDescription())
                            .build()));
        }

        // Create event from request
        TutorProfileUpdatedEvent event = TutorProfileUpdatedEvent.builder()
                .tutorId(request.getTutorId())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .gender(request.getGender())
                .countryId(request.getCountry())
                .city(request.getCity())
                .nativeLanguageCode(request.getNativeLanguage() != null ? request.getNativeLanguage().getCode() : null)
                .languageCodes(request.getLanguages() != null ? request.getLanguages().stream()
                        .map(lang -> lang.getCode())
                        .toList() : null)
                .headline(request.getHeadline())
                .subjects(request.getSubjects() != null ? request.getSubjects().stream()
                        .map(sub -> TutorProfileUpdatedEvent.SubjectInfo.builder()
                                .subjectId(sub.getId())
                                .subjectName(sub.getName())
                                .build())
                        .toList() : null)
                .introduction(request.getIntroduction())
                .socialLinks(request.getSocialLinks() != null ? request.getSocialLinks().stream()
                        .map(link -> TutorProfileUpdatedEvent.SocialLinkInfo.builder()
                                .platform(link.getPlatform())
                                .url(link.getUrl())
                                .build())
                        .toList() : null)
                .careerEntries(careerEntries)
                .certifications(request.getCertifications() != null ? request.getCertifications().stream()
                        .map(cert -> TutorProfileUpdatedEvent.CertificationInfo.builder()
                                .name(cert.getName())
                                .issuingOrganization(cert.getIssuingOrganization())
                                .issueDate(cert.getIssueDate())
                                .expirationDate(cert.getExpirationDate())
                                .credentialId(cert.getCredentialId())
                                .credentialUrl(cert.getCredentialUrl())
                                .build())
                        .toList() : null)
                .build();

        // Send event to Kafka
        kafkaProducerService.sendTutorProfileUpdatedEvent(event);

        ApiResponse<Void> response = ApiResponse.success(null, "Tutor profile update initiated successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/tutors/{tutorId}/sessions/booked
     * Get booked sessions for a tutor with date range and status filters
     */
    @GetMapping("/{tutorId}/sessions/booked")
    public ResponseEntity<ApiResponse<List<BookedSessionResponse>>> getBookedSessions(
            @PathVariable UUID tutorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) List<ScheduleStatus> statuses) {

        List<BookedSessionResponse> sessions = tutorService.getBookedSessions(tutorId, startDate, endDate, statuses);
        ApiResponse<List<BookedSessionResponse>> response = ApiResponse.success(sessions,
                "Booked sessions retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/tutors/{tutorId}/availability
     * Get availability patterns for a tutor
     */
    @GetMapping("/{tutorId}/availability")
    public ResponseEntity<ApiResponse<AvailabilityListResponse>> getAvailabilities(
            @PathVariable UUID tutorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        AvailabilityListResponse availabilities = tutorService.getAvailabilities(tutorId, startDate, endDate);
        ApiResponse<AvailabilityListResponse> response = ApiResponse.success(availabilities,
                "Availability retrieved successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/tutors/{tutorId}/availability/bulk
     * Bulk update availability với 2 modes:
     * - "this_period": Chỉ ảnh hưởng trong khoảng startDate → endDate
     * - "recurring": Ảnh hưởng toàn bộ recurring pattern
     */
    @PostMapping("/{tutorId}/availability/bulk")
    public ResponseEntity<ApiResponse<Void>> bulkUpdateAvailability(
            @PathVariable UUID tutorId,
            @RequestBody BulkUpdateAvailabilityRequest request) {

        tutorService.bulkUpdateAvailability(tutorId, request);
        ApiResponse<Void> response = ApiResponse.success(null, "Availability updated successfully");
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }


    @GetMapping("/tutors/{tutorId}")
    public ResponseEntity<ApiResponse<TutorDetailBffResponse>> getTutorDetail(
            @PathVariable UUID tutorId,
            @RequestParam(required = false) UUID studentId) {
        TutorDetailBffResponse result = tutorService.getTutorDetail(tutorId, studentId);
        ApiResponse<TutorDetailBffResponse> response = ApiResponse.success(result, "Tutor detail retrieved successfully");
        return ResponseEntity.ok(response);
    }
}