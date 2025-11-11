package com.elearning.tutorservice.service.impl;

import com.elearning.tutorservice.dto.response.TutorSearchResponse;
import com.elearning.tutorservice.entity.Tutor;
import com.elearning.tutorservice.repository.TutorRepository;
import com.elearning.tutorservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.elearning.tutorservice.util.AvailabilityUtils;
import org.springframework.data.domain.PageImpl;
import com.elearning.tutorservice.dto.request.AvailabilityFilter;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TutorServiceImpl implements TutorService {

    private final TutorRepository tutorRepository;

    @Override
    public Page<TutorSearchResponse> searchTutors(List<String> languageCodes, BigDecimal minPrice, BigDecimal maxPrice, List<String> availableDays, Pageable pageable) {
        List<AvailabilityFilter> availabilityFilters = AvailabilityUtils.parseAvailableDays(availableDays);

        if (availabilityFilters == null || availabilityFilters.isEmpty()) {
            // No availability filter, use pagination
            Page<Tutor> tutorPage = tutorRepository.findTutorsWithFilters(languageCodes, minPrice, maxPrice, pageable);
            return tutorPage.map(this::mapToSearchResponse);
        } else {
            // Has availability filter, get all matching other filters, then filter and page
            Page<Tutor> allTutorsPage = tutorRepository.findTutorsWithFilters(languageCodes, minPrice, maxPrice, Pageable.unpaged());
            List<Tutor> allTutors = allTutorsPage.getContent();
            List<Tutor> filteredTutors = allTutors.stream()
                .filter(tutor -> tutor.getAvailabilities().stream()
                    .anyMatch(ta -> availabilityFilters.stream()
                        .anyMatch(af -> af.getDayOfWeek().equals(ta.getDayOfWeek()) &&
                                af.getStartTime().isBefore(ta.getEndTime()) &&
                                af.getEndTime().isAfter(ta.getStartTime()))))
                .toList();

            // Manual pagination
            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), filteredTutors.size());
            List<Tutor> pageContent = filteredTutors.subList(start, end);

            return new PageImpl<>(pageContent.stream().map(this::mapToSearchResponse).toList(), pageable, filteredTutors.size());
        }
    }

    private TutorSearchResponse mapToSearchResponse(Tutor tutor) {
        Double averageRating = tutor.getReviews().stream()
                .mapToInt(review -> review.getRating())
                .average()
                .orElse(0.0);

        Integer reviewCount = tutor.getReviews().size();

        List<String> languages = tutor.getLanguages().stream()
                .map(lang -> lang.getLanguageCode() + " (" + lang.getProficiencyLevel() + ")")
                .collect(Collectors.toList());

        return TutorSearchResponse.builder()
                .id(tutor.getId())
                .name(tutor.getName())
                .avatarUrl(tutor.getAvatarUrl())
                .bio(tutor.getBio())
                .specialization(tutor.getSpecialization())
                .nationalityCode(tutor.getNationalityCode())
                .currentSessionFee(tutor.getCurrentSessionFee())
                .currency(tutor.getCurrency())
                .averageRating(averageRating)
                .reviewCount(reviewCount)
                .languages(languages)
                .teachesInGroups(tutor.getTeachesInGroups())
                .maxGroupMembers(tutor.getMaxGroupMembers())
                .isVerified(tutor.getIsVerified())
                .videoUrl(tutor.getVideoUrl())
                .videoThumbnailUrl(tutor.getVideoThumbnailUrl())
                .previousSessionFee(tutor.getPreviousSessionFee())
                .sessionDurationMinutes(tutor.getSessionDurationMinutes())
                .build();
    }
}