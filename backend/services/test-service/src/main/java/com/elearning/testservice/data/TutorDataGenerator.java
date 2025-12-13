package com.elearning.testservice.data;

import com.elearning.testservice.dto.TutorAvailabilityRequest;
import com.elearning.testservice.dto.TutorLanguageRequest;
import com.elearning.testservice.dto.TutorReviewRequest;
import com.elearning.testservice.dto.TutorSocialRequest;
import com.elearning.testservice.dto.TutorSubjectRequest;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class TutorDataGenerator {

    private final Random random = new Random();

    private final List<String> languageCodes = List.of("en", "vi", "fr", "de", "es");

    private final List<String> proficiencyLevels = List.of("Beginner", "Intermediate", "Advanced", "Native");

    public List<TutorLanguageRequest> generateTutorLanguages(int count) {
        List<TutorLanguageRequest> languages = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            TutorLanguageRequest language = new TutorLanguageRequest();
            language.setLanguageCode(languageCodes.get(random.nextInt(languageCodes.size())));
            language.setProficiencyLevel(proficiencyLevels.get(random.nextInt(proficiencyLevels.size())));
            languages.add(language);
        }
        return languages;
    }

    public List<TutorReviewRequest> generateTutorReviews(int count) {
        List<TutorReviewRequest> reviews = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            TutorReviewRequest review = new TutorReviewRequest();
            review.setRating(random.nextInt(5) + 1); // 1-5
            review.setComment("Great tutor!");
            reviews.add(review);
        }
        return reviews;
    }

    public List<TutorSocialRequest> generateTutorSocials(int count) {
        List<String> platforms = List.of("Facebook", "Twitter", "LinkedIn", "Instagram");
        List<TutorSocialRequest> socials = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            TutorSocialRequest social = new TutorSocialRequest();
            social.setPlatform(platforms.get(random.nextInt(platforms.size())));
            social.setUrl("https://example.com/" + social.getPlatform().toLowerCase() + "/tutor" + i);
            socials.add(social);
        }
        return socials;
    }

    public List<TutorSubjectRequest> generateTutorSubjects(int count) {
        List<String> subjectNames = List.of("Math", "English", "Physics", "Chemistry");
        List<TutorSubjectRequest> subjects = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            TutorSubjectRequest subject = new TutorSubjectRequest();
            subject.setCategoryId((long) (Math.random() * Long.MAX_VALUE));
            subject.setSubjectName(subjectNames.get(random.nextInt(subjectNames.size())));
            subjects.add(subject);
        }
        return subjects;
    }

    public List<TutorAvailabilityRequest> generateTutorAvailabilities(int count) {
        if (count <= 0) {
            count = random.nextInt(50) + 1;
        }
        String[] statuses = {"FREE", "DELETED", "BOOKED"};
        List<TutorAvailabilityRequest> availabilities = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            TutorAvailabilityRequest availability = new TutorAvailabilityRequest();
            availability.setDayOfWeek((short) (random.nextInt(7) + 1)); // 1-7
            availability.setStartTime(LocalTime.of(random.nextInt(24), random.nextInt(60)));
            availability.setEndTime(LocalTime.of(random.nextInt(24), random.nextInt(60)));
            availability.setEffectiveStartDate(LocalDate.now().plusDays(random.nextInt(30)));
            availability.setEffectiveEndDate(LocalDate.now().plusDays(30 + random.nextInt(30)));
            availability.setStatus(statuses[random.nextInt(statuses.length)]);
            availabilities.add(availability);
        }
        return availabilities;
    }
}