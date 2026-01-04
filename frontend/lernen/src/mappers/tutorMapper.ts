import type {
    Tutor,
    TutorResponse,
    TutorLanguage,
    TutorLanguageResponse,
    TutorProfileHeaderResponse,
} from "../types/tutor";
import type { Country, Subject } from "../types/common";
import commonUtils from "../utils/commonUtils";

// Helper: Map country code string to Country object
const mapCountryCodeToCountry = (countryCode: string): Country => {
    if (!countryCode) {
        return { code: "", name: "Unknown", flag: "" };
    }
    const allCountries = commonUtils.getAllCountries();
    const country = allCountries.find((c) => c.code === countryCode);
    return country || { code: countryCode, name: "Unknown", flag: "" };
};

// Helper: Map TutorLanguageResponse[] to TutorLanguage[]
const mapTutorLanguageResponseToTutorLanguage = (languageResponses: TutorLanguageResponse[]): TutorLanguage[] => {
    if (!languageResponses || languageResponses.length === 0) {
        return [];
    }
    const allLanguages = commonUtils.getAllLanguages();
    return languageResponses.map((langResp) => {
        const language = allLanguages.find((l) => l.code === langResp.code);
        return {
            language: language || { code: langResp.code, name: "Unknown" },
            isNative: langResp.isNative,
        };
    });
};

// Helper: Map subject IDs to Subject[]
const mapSubjectIdsToSubjects = async (subjectIds: string[]): Promise<Subject[]> => {
    if (!subjectIds || subjectIds.length === 0) {
        return [];
    }
    const allSubjects = await commonUtils.getSubjects();
    return subjectIds.map((id) => {
        const subject = allSubjects.find((s) => s.id === id);
        if (subject) {
            return subject;
        }
        // Log warning if subject not found for debugging
        console.warn(`Subject with id ${id} not found in subjects list. Available subjects:`, allSubjects.map(s => ({ id: s.id, nameVi: s.nameVi, nameEn: s.nameEn })));
        // Return fallback with correct Subject type format
        return { id, nameVi: "Unknown", nameEn: "Unknown", categoryId: "" };
    });
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

export const mapTutorProfileHeaderResponseToTutorProfileHeader = async (
    profileHeaderResponse: TutorProfileHeaderResponse
): Promise<Tutor> => {
    const country = mapCountryCodeToCountry(profileHeaderResponse.countryCode);
    const languages = mapTutorLanguageResponseToTutorLanguage(profileHeaderResponse.languageCodes);
    const subjects = await mapSubjectIdsToSubjects(profileHeaderResponse.subjectIds);

    // Cast to any to access fields that may exist in API response but not in type definition
    const rawResponse = profileHeaderResponse as any;

    const tutorDetail = {
        id: profileHeaderResponse.id,
        fullName: profileHeaderResponse.fullName,
        avatarUrl: profileHeaderResponse.avatarUrl,
        isVerified: profileHeaderResponse.isVerified,
        headline: profileHeaderResponse.headline,
        videoUrl: profileHeaderResponse.videoUrl,
        currentSessionFee: profileHeaderResponse.currentSessionFee,
        averageRating: profileHeaderResponse.averageRating,
        reviewCount: profileHeaderResponse.reviewCount,
        bookedSessionsCount: profileHeaderResponse.bookedSessionsCount,
        studentCount: profileHeaderResponse.studentCount,
        introduction: profileHeaderResponse.introduction,
        country: country,
        languages,
        subjects,
        socialLinks: profileHeaderResponse.socialLinks,
    } as import('../types/tutor').TutorDetail;
    
    // Add resume data separately if available
    if (rawResponse.educations || rawResponse.experiences || rawResponse.certifications || rawResponse.certificates) {
        const tutorWithResume: import('../types/tutor').TutorDetail = {
            ...tutorDetail,
            educations: rawResponse.educations || [],
            experiences: rawResponse.experiences || [],
            certifications: rawResponse.certifications || rawResponse.certificates || [],
        };
        return tutorWithResume;
    }
    
    return tutorDetail;
};
