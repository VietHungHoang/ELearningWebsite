package com.elearning.bffservice.service.impl;

import com.elearning.bffservice.client.CommonServiceClient;
import com.elearning.bffservice.dto.response.TutorFilterResponse;
import com.elearning.bffservice.service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommonServiceImpl implements CommonService {

    private final CommonServiceClient commonServiceClient;

    @Override
    public TutorFilterResponse getTutorFilter() {
        var categories = commonServiceClient.getAllCategories();
        var languages = commonServiceClient.getAllLanguages();
        var timezones = commonServiceClient.getAllTimezones();

        var categoryItems = categories.stream()
                .map(cat -> TutorFilterResponse.CategoryFilterItem.builder()
                        .id(cat.getId())
                        .name(cat.getName())
                        .build())
                .collect(Collectors.toList());

        var languageItems = languages.stream()
                .map(lang -> TutorFilterResponse.LanguageFilterItem.builder()
                        .id(lang.getId())
                        .name(lang.getName())
                        .code(lang.getCode())
                        .build())
                .collect(Collectors.toList());

        var timezoneItems = timezones.stream()
                .map(tz -> TutorFilterResponse.TimezoneFilterItem.builder()
                        .id(tz.getId())
                        .name(tz.getName())
                        .utcOffset(tz.getUtcOffset())
                        .build())
                .collect(Collectors.toList());

        return TutorFilterResponse.builder()
                .categories(categoryItems)
                .languages(languageItems)
                .timezones(timezoneItems)
                .build();
    }
}