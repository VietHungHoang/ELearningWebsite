package com.elearning.bffservice.service.impl;

import com.elearning.bffservice.client.TutorServiceClient;
import com.elearning.bffservice.client.CommonServiceClient;
import com.elearning.bffservice.dto.response.TutorSearchResponse;
import com.elearning.bffservice.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TutorServiceImpl implements TutorService {

    private final TutorServiceClient tutorServiceClient;
    private final CommonServiceClient commonServiceClient;

    @Override
    public Page<TutorSearchResponse> searchTutors(List<String> languageCodes, BigDecimal minPrice, BigDecimal maxPrice, UUID categoryId, boolean categoryIsParent, List<String> availableDays, int page, int size) {
        // If the provided categoryId is a parent, expand to child IDs via CommonService
        List<UUID> categoryIdsToSend = null;

        if (categoryId != null) {
            if (categoryIsParent) {
                var categories = commonServiceClient.getAllCategories();
                // find direct children of the parent
                categoryIdsToSend = categories.stream()
                        .filter(c -> categoryId.equals(c.getParentId()))
                        .map(c -> c.getId())
                        .toList();
            } else {
                categoryIdsToSend = List.of(categoryId);
            }
        }

        return tutorServiceClient.searchTutors(languageCodes, minPrice, maxPrice, categoryIdsToSend, availableDays, page, size);
    }
}