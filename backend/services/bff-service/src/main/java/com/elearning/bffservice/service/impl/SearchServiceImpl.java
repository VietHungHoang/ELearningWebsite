package com.elearning.bffservice.service.impl;

import com.elearning.bffservice.bff.tutors.request.TutorSearchBffRequest;
import com.elearning.bffservice.bff.tutors.response.TutorBffResponse;
import com.elearning.bffservice.client.SearchServiceClient;
import com.elearning.bffservice.client.TutorServiceClient;
import com.elearning.bffservice.dto.request.SearchTutorRequest;
import com.elearning.bffservice.dto.tutor.response.TutorResponse;
import com.elearning.bffservice.dto.tutor.response.TutorSearchResult;
import com.elearning.bffservice.mapper.TutorMapper;
import com.elearning.bffservice.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchServiceImpl implements SearchService {

    private final SearchServiceClient searchServiceClient;
    private final TutorServiceClient tutorServiceClient;
    private final TutorMapper tutorMapper;

    @Override
    public Page<TutorBffResponse> searchTutors(TutorSearchBffRequest request) {
        SearchTutorRequest searchRequest = tutorMapper.mapToSearchTutorRequest(request);
        Page<TutorSearchResult> searchResults = searchServiceClient.searchTutors(searchRequest);
        log.info("Search Service returned {} results", searchResults.getTotalElements());

        if (searchResults.isEmpty()) {
            return new PageImpl<>(List.of(), PageRequest.of(request.getPage(), request.getSize()), 0);
        }

        // Extract tutor IDs in order
        List<UUID> tutorIds = searchResults.getContent().stream()
                .map(TutorSearchResult::getTutorId)
                .toList();
        log.info("Extracted tutor IDs: {}", tutorIds);

        List<TutorResponse> tutorDetails;
            tutorDetails = tutorServiceClient.getTutorsByIds(tutorIds);
        log.info("Fetched {} tutor details from Tutor Service", tutorDetails.size());

        // No need to fetch stats from Class Service, assuming TutorResponse already includes stats

        List<TutorBffResponse> orderedResults = createOrderedTutorBffResults(tutorDetails, tutorIds);

        Page<TutorBffResponse> result = new PageImpl<>(
                orderedResults,

                PageRequest.of(request.getPage(), request.getSize()),
                searchResults.getTotalElements());
        log.info("Returning page {} of {} with {} tutors", request.getPage(), result.getTotalPages(),
                orderedResults.size());
        return result;
    }

    private List<TutorBffResponse> createOrderedTutorBffResults(List<TutorResponse> tutorDetails, List<UUID> tutorIds) {
        // Create map for quick lookup of tutor details
        Map<UUID, TutorResponse> tutorMap = tutorDetails.stream()
                .collect(Collectors.toMap(
                        t -> t.getId() != null ? t.getId() : UUID.randomUUID(),
                        t -> t));
        log.info("Created tutor map with {} entries", tutorMap.size());

        // Reorder results according to search ranking (preserve order)
        List<TutorBffResponse> orderedResults = tutorIds.stream()
                .map(tutorId -> {
                    TutorResponse tutor = tutorMap.get(tutorId);
                    if (tutor == null) {
                        return null;
                    }

                    return tutorMapper.mapToTutorBffResponse(tutor);
                })
                .filter(Objects::nonNull)
                .toList();
        log.info("Ordered results: {} tutors after filtering", orderedResults.size());

        return orderedResults;
    }
}
