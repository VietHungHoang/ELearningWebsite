package com.elearning.bffservice.service.impl;

import com.elearning.bffservice.client.CommonServiceClient;
import com.elearning.bffservice.client.TutorServiceClient;
import com.elearning.bffservice.client.UserServiceClient;
import com.elearning.bffservice.dto.response.CountryResponse;
import com.elearning.bffservice.dto.response.LanguageResponse;
import com.elearning.bffservice.dto.response.SubjectResponse;
import com.elearning.bffservice.dto.response.TutorFilterResponse;
import com.elearning.bffservice.dto.response.TutorProfileResponse;
import com.elearning.bffservice.dto.response.TutorProfileResponse.Language;
import com.elearning.bffservice.dto.response.TutorProfileResponse.Subject;
import com.elearning.bffservice.dto.response.TutorProfileResponse.SocialLink;
import com.elearning.bffservice.dto.response.TutorProfileResponse.CareerEntry;
import com.elearning.bffservice.dto.response.TutorProfileResponse.Certification;
import com.elearning.bffservice.dto.response.UserInfoResponse;
import com.elearning.bffservice.service.CommonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommonServiceImpl implements CommonService {

    private final CommonServiceClient commonServiceClient;
    private final TutorServiceClient tutorServiceClient;
    private final UserServiceClient userServiceClient;

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

    @Override
    public List<CountryResponse> getAllCountries() {
        return commonServiceClient.getAllCountries();
    }

    @Override
    public List<LanguageResponse> getAllLanguages() {
        return commonServiceClient.getAllLanguages();
    }

    @Override
    public List<SubjectResponse> getAllSubjects() {
        return commonServiceClient.getAllSubjects();
    }

    @Override
    public TutorProfileResponse getTutorProfile(UUID tutorId) {
        log.info("BFF: Getting tutor profile for tutorId: {}", tutorId);

        // Get tutor data from tutor service
        com.elearning.bffservice.client.dto.TutorProfileResponse tutorData = tutorServiceClient.getTutorProfile(tutorId);
        if (tutorData == null) {
            log.warn("Tutor data not found for tutorId: {}", tutorId);
            return null;
        }

        // Get user data from user service
        UserInfoResponse userData = userServiceClient.getUserById(tutorId);
        if (userData == null) {
            log.warn("User data not found for tutorId: {}", tutorId);
            return null;
        }

        // Get languages from common service
        List<LanguageResponse> allLanguages = commonServiceClient.getAllLanguages();
        Map<String, LanguageResponse> languageMap = allLanguages.stream()
                .collect(Collectors.toMap(LanguageResponse::getCode, lang -> lang));

        // Get countries from common service
        List<CountryResponse> allCountries = commonServiceClient.getAllCountries();
        Map<UUID, CountryResponse> countryMap = allCountries.stream()
                .collect(Collectors.toMap(CountryResponse::getId, country -> country));

        // Get subjects from common service
        List<SubjectResponse> allSubjects = commonServiceClient.getAllSubjects();
        Map<UUID, SubjectResponse> subjectMap = allSubjects.stream()
                .collect(Collectors.toMap(SubjectResponse::getId, subject -> subject));

        // Build the response
        return TutorProfileResponse.builder()
                .fullName(userData.getName())
                .email(userData.getEmail())
                .phone(userData.getPhone())
                .gender(userData.getGender())
                .country(userData.getCountryId() != null && countryMap.containsKey(userData.getCountryId())
                        ? countryMap.get(userData.getCountryId()).getName() : null)
                .city(userData.getCity())
                .nativeLanguage(tutorData.getNationalityCode() != null && languageMap.containsKey(tutorData.getNationalityCode())
                        ? Language.builder()
                                .id(languageMap.get(tutorData.getNationalityCode()).getId().toString())
                                .name(languageMap.get(tutorData.getNationalityCode()).getName())
                                .code(languageMap.get(tutorData.getNationalityCode()).getCode())
                                .build()
                        : null)
                .languages(tutorData.getLanguages() != null ? tutorData.getLanguages().stream()
                        .filter(lang -> languageMap.containsKey(lang.getLanguageCode()))
                        .map(lang -> Language.builder()
                                .id(languageMap.get(lang.getLanguageCode()).getId().toString())
                                .name(languageMap.get(lang.getLanguageCode()).getName())
                                .code(languageMap.get(lang.getLanguageCode()).getCode())
                                .build())
                        .collect(Collectors.toList()) : null)
                .headline(tutorData.getSpecialization())
                .subjects(tutorData.getSubjects() != null ? tutorData.getSubjects().stream()
                        .filter(subject -> subject.getSubjectId() != null && subjectMap.containsKey(subject.getSubjectId()))
                        .map(subject -> Subject.builder()
                                .id(subjectMap.get(subject.getSubjectId()).getId().toString())
                                .name(subjectMap.get(subject.getSubjectId()).getName())
                                .build())
                        .collect(Collectors.toList()) : null)
                .introduction(tutorData.getIntroduction())
                .avatarUrl(userData.getAvatarUrl())
                .introductionVideoUrl(tutorData.getVideoUrl())
                .socialLinks(tutorData.getSocialLinks() != null ? tutorData.getSocialLinks().stream()
                        .map(social -> SocialLink.builder()
                                .id(social.getId().toString())
                                .platform(social.getPlatform())
                                .url(social.getUrl())
                                .build())
                        .collect(Collectors.toList()) : null)
                .education(tutorData.getCareerEntries() != null ? tutorData.getCareerEntries().stream()
                        .filter(entry -> "EDUCATION".equals(entry.getType()))
                        .map(entry -> CareerEntry.builder()
                                .id(entry.getId().toString())
                                .title(entry.getTitle())
                                .institution(entry.getInstitution())
                                .startDate(entry.getStartDate() != null ? entry.getStartDate().toString() : null)
                                .endDate(entry.getEndDate() != null ? entry.getEndDate().toString() : null)
                                .location(entry.getLocation())
                                .description(entry.getDescription())
                                .build())
                        .collect(Collectors.toList()) : null)
                .experience(tutorData.getCareerEntries() != null ? tutorData.getCareerEntries().stream()
                        .filter(entry -> "EXPERIENCE".equals(entry.getType()))
                        .map(entry -> CareerEntry.builder()
                                .id(entry.getId().toString())
                                .title(entry.getTitle())
                                .institution(entry.getInstitution())
                                .startDate(entry.getStartDate() != null ? entry.getStartDate().toString() : null)
                                .endDate(entry.getEndDate() != null ? entry.getEndDate().toString() : null)
                                .location(entry.getLocation())
                                .description(entry.getDescription())
                                .build())
                        .collect(Collectors.toList()) : null)
                .certifications(tutorData.getCertifications() != null ? tutorData.getCertifications().stream()
                        .map(cert -> Certification.builder()
                                .id(cert.getId().toString())
                                .name(cert.getName())
                                .issuingOrganization(cert.getIssuingOrganization())
                                .issueDate(cert.getIssueDate() != null ? cert.getIssueDate().toString() : null)
                                .expirationDate(cert.getExpirationDate() != null ? cert.getExpirationDate().toString() : null)
                                .credentialId(cert.getCredentialId())
                                .credentialUrl(cert.getCredentialUrl())
                                .build())
                        .collect(Collectors.toList()) : null)
                .build();
    }
}