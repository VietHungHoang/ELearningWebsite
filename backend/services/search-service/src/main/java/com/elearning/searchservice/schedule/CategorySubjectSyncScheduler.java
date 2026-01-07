package com.elearning.searchservice.schedule;

import com.elearning.searchservice.client.CommonServiceClient;
import com.elearning.searchservice.dto.embedded.CategoryInfo;
import com.elearning.searchservice.dto.embedded.SubjectInfo;
import com.elearning.searchservice.dto.sync.CategorySyncDto;
import com.elearning.searchservice.dto.sync.SubjectSyncDto;
import com.elearning.searchservice.entity.TutorDocument;
import com.elearning.searchservice.repository.TutorSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Scheduled task to sync category and subject data from common-service to
 * Elasticsearch
 * Runs daily at 18:00 (6 PM)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CategorySubjectSyncScheduler {

    private final CommonServiceClient commonServiceClient;
    private final TutorSearchRepository tutorSearchRepository;

    /**
     * Sync categories and subjects data daily at 18:00
     * Cron: second minute hour day month weekday
     */
    @Scheduled(cron = "0 0 18 * * *")
    public void syncCategoryAndSubjectData() {
        log.info("Starting scheduled sync of categories and subjects at {}", LocalDateTime.now());

        try {
            // Fetch latest data from common-service
            List<CategorySyncDto> categories = commonServiceClient.getAllCategories();
            List<SubjectSyncDto> subjects = commonServiceClient.getAllSubjects();

            if (categories.isEmpty() && subjects.isEmpty()) {
                log.warn("No categories or subjects fetched from common-service, skipping sync");
                return;
            }

            // Build lookup maps
            Map<UUID, CategorySyncDto> categoryMap = categories.stream()
                    .collect(Collectors.toMap(CategorySyncDto::getId, c -> c));
            Map<UUID, SubjectSyncDto> subjectMap = subjects.stream()
                    .collect(Collectors.toMap(SubjectSyncDto::getId, s -> s));

            // Get all tutor documents
            Iterable<TutorDocument> allTutors = tutorSearchRepository.findAll();
            List<TutorDocument> tutorsToUpdate = new ArrayList<>();

            for (TutorDocument tutor : allTutors) {
                boolean updated = false;

                // Extract categoryIds from subjects
                if (tutor.getSubjectIds() != null && !tutor.getSubjectIds().isEmpty()) {
                    List<UUID> categoryIds = tutor.getSubjectIds().stream()
                            .filter(subjectMap::containsKey)
                            .map(subjectId -> subjectMap.get(subjectId).getCategoryId())
                            .filter(Objects::nonNull)
                            .distinct()
                            .collect(Collectors.toList());

                    if (!categoryIds.isEmpty() && !categoryIds.equals(tutor.getCategoryIds())) {
                        tutor.setCategoryIds(categoryIds);
                        updated = true;
                    }

                    // Update subjects with names
                    List<SubjectInfo> updatedSubjects = updateSubjectInfo(tutor.getSubjectIds(), subjectMap);
                    if (!updatedSubjects.isEmpty()) {
                        tutor.setSubjects(updatedSubjects);
                        updated = true;
                    }
                }

                // Update categories with names
                if (tutor.getCategoryIds() != null && !tutor.getCategoryIds().isEmpty()) {
                    List<CategoryInfo> updatedCategories = updateCategoryInfo(tutor.getCategoryIds(), categoryMap);
                    if (!updatedCategories.isEmpty()) {
                        tutor.setCategories(updatedCategories);
                        updated = true;
                    }
                }

                if (updated) {
                    tutor.setUpdatedAt(LocalDateTime.now());
                    tutorsToUpdate.add(tutor);
                }
            }

            // Bulk save updated tutors
            if (!tutorsToUpdate.isEmpty()) {
                tutorSearchRepository.saveAll(tutorsToUpdate);
                log.info("Successfully updated {} tutor documents with latest category/subject data",
                        tutorsToUpdate.size());
            } else {
                log.info("No tutor documents needed updating");
            }

        } catch (Exception e) {
            log.error("Failed to sync category and subject data: {}", e.getMessage(), e);
        }
    }

    /**
     * Manual trigger for sync (can be called from controller)
     */
    public void triggerManualSync() {
        log.info("Manual sync triggered");
        syncCategoryAndSubjectData();
    }

    private List<CategoryInfo> updateCategoryInfo(List<UUID> categoryIds, Map<UUID, CategorySyncDto> categoryMap) {
        return categoryIds.stream()
                .filter(categoryMap::containsKey)
                .map(id -> {
                    CategorySyncDto dto = categoryMap.get(id);
                    return CategoryInfo.builder()
                            .id(dto.getId())
                            .nameVi(dto.getNameVi())
                            .nameEn(dto.getNameEn())
                            .isParent(dto.getParentId() == null)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<SubjectInfo> updateSubjectInfo(List<UUID> subjectIds, Map<UUID, SubjectSyncDto> subjectMap) {
        return subjectIds.stream()
                .filter(subjectMap::containsKey)
                .map(id -> {
                    SubjectSyncDto dto = subjectMap.get(id);
                    return SubjectInfo.builder()
                            .id(dto.getId())
                            .categoryId(dto.getCategoryId())
                            .nameVi(dto.getNameVi())
                            .nameEn(dto.getNameEn())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
