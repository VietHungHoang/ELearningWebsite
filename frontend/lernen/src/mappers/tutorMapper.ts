import type { Tutor, TutorDetail, TutorResponse, TutorDetailResponse, TutorLanguage, TutorLanguageResponse } from "../types/tutor";
import type { Country, Subject } from "../types/common";
import commonUtils from "../utils/commonUtils";

// Helper: Map country code string to Country object
const mapCountryCodeToCountry = (countryCode: string): Country => {
    if(!countryCode) {
        return { code: '', name: 'Unknown', flag: '' };
    }
    const allCountries = commonUtils.getAllCountries();
    const country = allCountries.find(c => c.code === countryCode);
    return country || { code: countryCode, name: 'Unknown', flag: '' };
};

// Helper: Map TutorLanguageResponse[] to TutorLanguage[]
const mapTutorLanguageResponseToTutorLanguage = (languageResponses: TutorLanguageResponse[]): TutorLanguage[] => {
    if (!languageResponses || languageResponses.length === 0) {
        return [];
    }
    const allLanguages = commonUtils.getAllLanguages();
    return languageResponses.map(langResp => {
        const language = allLanguages.find(l => l.code === langResp.code);
        return {
            language: language || { code: langResp.code, name: 'Unknown' },
            isNative: langResp.isNative,
        };
    });
};

// Helper: Map subject IDs to Subject[]
const mapSubjectIdsToSubjects = async (subjectIds: string[]): Promise<Subject[]> => {
    if(!subjectIds || subjectIds.length === 0) {
        return [];
    }
    const allSubjects = await commonUtils.getSubjects();
    return subjectIds.map(id => allSubjects.find(s => s.id === id) || { id, name: 'Unknown', categoryId: '' });
};

export const mapTutorResponseToTutor = async (tutorResponse: TutorResponse): Promise<Tutor> => {
    const country = mapCountryCodeToCountry(tutorResponse.countryCode);
    const languages = mapTutorLanguageResponseToTutorLanguage(tutorResponse.languageCodes);
    const subjects = await mapSubjectIdsToSubjects(tutorResponse.subjectIds);
    
    return {
        id: tutorResponse.id,
        fullName: tutorResponse.fullName,
        email: tutorResponse.email,
        isVerified: tutorResponse.isVerified,
        introduction: tutorResponse.introduction,
        headline: tutorResponse.headline,
        country: country,
        gender: tutorResponse.gender,
        avatarUrl: tutorResponse.avatarUrl,
        timezone: tutorResponse.timezone,
        videoUrl: tutorResponse.videoUrl,
        currentSessionFee: tutorResponse.currentSessionFee,
        originalSessionFee: tutorResponse.originalSessionFee,
        averageRating: tutorResponse.averageRating,
        reviewCount: tutorResponse.reviewCount,
        languages,
        subjects,
        bookedSessionsCount: tutorResponse.bookedSessionsCount,
        studentCount: tutorResponse.studentCount,
        hasTrialSession: tutorResponse.hasTrialSession,
    };
};

export const mapTutorDetailResponseToTutorDetail = async (tutorDetailResponse: TutorDetailResponse): Promise<TutorDetail> => {
    const country = mapCountryCodeToCountry(tutorDetailResponse.countryCode);
    const languages = mapTutorLanguageResponseToTutorLanguage(tutorDetailResponse.languageCodes);
    const subjects = await mapSubjectIdsToSubjects(tutorDetailResponse.subjectIds);
    
    return {
        id: tutorDetailResponse.id,
        fullName: tutorDetailResponse.fullName,
        email: tutorDetailResponse.email,
        isVerified: tutorDetailResponse.isVerified,
        introduction: tutorDetailResponse.introduction,
        headline: tutorDetailResponse.headline,
        country: country,
        gender: tutorDetailResponse.gender,
        avatarUrl: tutorDetailResponse.avatarUrl,
        timezone: tutorDetailResponse.timezone,
        videoUrl: tutorDetailResponse.videoUrl,
        currentSessionFee: tutorDetailResponse.currentSessionFee,
        originalSessionFee: tutorDetailResponse.originalSessionFee,
        averageRating: tutorDetailResponse.averageRating,
        reviewCount: tutorDetailResponse.reviewCount,
        languages,
        subjects,
        bookedSessionsCount: tutorDetailResponse.bookedSessionsCount,
        studentCount: tutorDetailResponse.studentCount,
        reviews: tutorDetailResponse.reviews || [],
        availabilities: tutorDetailResponse.availabilities,
        socialLinks: tutorDetailResponse.socialLinks,
        educations: tutorDetailResponse.educations,
        experiences: tutorDetailResponse.experiences,
        certifications: tutorDetailResponse.certifications,
        groupClasses: tutorDetailResponse.groupClasses || [],
        hasTrialSession: tutorDetailResponse.hasTrialSession,
    };
};