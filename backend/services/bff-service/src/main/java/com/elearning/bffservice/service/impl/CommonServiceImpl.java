package com.elearning.bffservice.service.impl;

import com.elearning.bffservice.client.CommonServiceClient;
import com.elearning.bffservice.dto.response.SubjectResponse;
import com.elearning.bffservice.dto.response.TutorFilterResponse;
import com.elearning.bffservice.service.CommonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommonServiceImpl implements CommonService {

    private final CommonServiceClient commonServiceClient;

    @Override
    public TutorFilterResponse getTutorFilter() {
        var categories = commonServiceClient.getAllCategories();

        var categoryItems = categories.stream()
                .map(cat -> TutorFilterResponse.CategoryFilterItem.builder()
                        .id(cat.getId())
                        .name(cat.getName())
                        .build())
                .collect(Collectors.toList());

        return TutorFilterResponse.builder()
                .categories(categoryItems)
                .build();
    }

    @Override
    public List<SubjectResponse> getAllSubjects() {
        return commonServiceClient.getAllSubjects();
    }
}