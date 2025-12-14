package com.elearning.tutorservice.controller;

import com.elearning.tutorservice.dto.request.BulkUpdateAvailabilityRequest;
import com.elearning.tutorservice.dto.request.SubmitReviewRequest;
import com.elearning.tutorservice.dto.response.ApiResponse;
import com.elearning.tutorservice.dto.response.TutorDetailResponse;
import com.elearning.tutorservice.dto.response.TutorResponse;
import com.elearning.tutorservice.service.TutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/tutors")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;

    /**
     * GET /tutors/{id}/detail
     * <p>
     * Get detailed tutor information including reviews, availabilities, social links,
     * educations, experiences and certifications.
     * @param id ID of the tutor
     * @return Detailed tutor information
     */
    @GetMapping("/{id}/detail")
    public ResponseEntity<ApiResponse<TutorDetailResponse>> getTutorDetail(@PathVariable UUID id) {
        TutorDetailResponse detail = tutorService.getTutorDetail(id);
        return ResponseEntity.ok(ApiResponse.success(detail, "Tutor detail retrieved successfully"));
    }
    
    // @GetMapping("/{id}/schedule")
    // public ResponseEntity<List<TutorScheduleResponse>> getTutorSchedule(@PathVariable Long id, @RequestParam(defaultValue = "false") boolean includeBooked) {
    //     List<TutorScheduleResponse> schedule = tutorService.getTutorSchedule(id, includeBooked);
    //     return ResponseEntity.ok(schedule);
    // }


    // @GetMapping("/{id}/profile")
    // public ResponseEntity<TutorProfileResponse> getTutorProfile(@PathVariable UUID id) {
    //     TutorProfileResponse profile = tutorService.getTutorProfile(id);
    //     return ResponseEntity.ok(profile);
    // }
    
    /**
     * POST /tutors/{tutorId}/reviews
     * Submit a review for a tutor
     */
    @PostMapping("/{tutorId}/reviews")
    public ResponseEntity<Void> submitReview(
            @PathVariable UUID tutorId,
            @Valid @RequestBody SubmitReviewRequest request) {

        tutorService.submitReview(tutorId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<UUID, TutorResponse>>> getTutorsByIds(@RequestParam List<UUID> ids) {
        Map<UUID, TutorResponse> tutors = tutorService.getTutorsByIds(ids);
        return ResponseEntity.ok(ApiResponse.success(tutors, "Tutors retrieved successfully"));
    }
}