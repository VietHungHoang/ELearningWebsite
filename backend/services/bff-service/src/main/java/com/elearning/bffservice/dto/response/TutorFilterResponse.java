package com.elearning.bffservice.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TutorFilterResponse {
    private List<TimezoneFilterItem> timezones;
    private List<LanguageFilterItem> languages;
    private List<CategoryFilterItem> categories;

    @Data
    @Builder
    public static class TimezoneFilterItem {
        private UUID id;
        private String name;
        private String utcOffset;
    }

    @Data
    @Builder
    public static class LanguageFilterItem {
        private UUID id;
        private String name;
        private String code;
    }

    @Data
    @Builder
    public static class CategoryFilterItem {
        private UUID id;
        private String name;
    }
}