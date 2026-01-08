import type { ClassSchedule } from "./class";
import type { Country, Language, Subject } from "./common";

export type Gender = 'Male' | 'Female' | 'Not specified';

export interface UserInfo {
    id: string;
    fullName: string;
    avatarUrl: string;
}

export interface TutorResponse extends UserInfo {
    email?: string;
    isVerified: boolean;
    headline: string;
    videoUrl: string;
    introduction: string;
    currentSessionFee: number;
    originalSessionFee?: number;
    averageRating: number;
    reviewCount: number;
    bookedSessionsCount: number;
    studentCount: number;
    countryCode: string;
    gender?: Gender | null;
    timezone?: string | null;
    languageCodes: TutorLanguageResponse[];
    subjectIds: string[];
    socialLinks?: TutorSocial[];
    hasTrialSession?: boolean;
}

// Alias for profile header - uses same structure as TutorResponse
export type TutorProfileHeaderResponse = TutorResponse;

export interface Tutor extends UserInfo {
    name?: string;
    email?: string;
    isVerified: boolean;
    headline: string;
    introduction: string;
    videoUrl: string;
    currentSessionFee: number;
    originalSessionFee?: number;
    hourlyRate?: number;
    averageRating: number;
    reviewCount: number;
    bookedSessionsCount: number;
    studentCount: number;
    country: Country;
    gender?: Gender | null;
    timezone?: string | null;
    languages: TutorLanguage[];
    subjects: Subject[];
    socialLinks?: TutorSocial[];
    hasTrialSession?: boolean;
}

// Extended tutor data for Profile Settings pages
export interface TutorDetail extends UserInfo {
    email?: string;
    isVerified: boolean;
    headline: string;
    introduction: string;
    videoUrl: string;
    introductionVideoUrl?: string; // Alias for videoUrl
    currentSessionFee: number;
    originalSessionFee?: number;
    averageRating: number;
    reviewCount: number;
    bookedSessionsCount: number;
    studentCount: number;
    country: Country;
    gender?: Gender | null;
    timezone?: string | null;
    languages: TutorLanguage[];
    subjects: Subject[];
    socialLinks?: TutorSocial[];
    hasTrialSession?: boolean;
    zoomConnected?: boolean;
    // Extended fields for Profile Settings
    reviews: TutorReview[];
    availabilities: TutorAvailability[];
    educations: EducationItem[];
    experiences: ExperienceItem[];
    certifications: CertificationItem[];
    groupClasses?: GroupClass;
    // Backward compatibility aliases
    education?: EducationItem[];
    experience?: ExperienceItem[];
}

export interface TutorReview {
    id: string;
    studentId: string;
    studentName: string;
    rating: number;
    comment: string;
    submitAt?: string;
    avatarUrl?: string;
    // Moderation fields from backend
    moderationStatus?: ReviewModerationStatus;
    statusDescription?: string;
    errorCode?: number;
    errorMessage?: string;
    ownReview?: boolean;
}

export type ReviewModerationStatus =
    | 'APPROVED'
    | 'PENDING_PROFANITY'
    | 'PENDING_SPAM'
    | 'PENDING_PERSONAL_INFO'
    | 'PENDING_HARASSMENT'
    | 'PENDING_INAPPROPRIATE'
    | 'PENDING_OFF_TOPIC'
    | 'PENDING_FAKE'
    | 'PENDING_PROMOTIONAL'
    | 'PENDING_OTHER'
    | 'REJECTED';

export interface TutorSocial {
    platform: string;
    url: string;
};

export interface TutorAvailability {
    id?: string;
    tutorId?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    effectiveStartDate: string;
    effectiveEndDate?: string;
}

export interface EducationItem {
    id: string;
    title: string;
    institution: string;
    startDate: string;
    endDate?: string;
    location?: string;
    description?: string;
}

export interface ExperienceItem {
    id: string;
    title: string;
    institution: string;
    startDate: string;
    endDate?: string;
    location?: string;
    description?: string;
}

export interface CertificationItem {
    id?: string;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
    credentialUrl?: string;
}

export interface SocialLink {
    id: string;
    platform: string;
    url: string;
}

// New: Group class representation coming from backend
export interface GroupClassStudent {
    id: string;
    name: string;
}

// API Response interface for GroupClass from backend
export interface GroupClassApiResponse {
    id: string;
    title: string;
    description: string;
    subjectId: string;
    classType: string;
    maxStudents: number;
    enrolledStudents: number;
    pricePerHour: number;
    schedules: Array<{
        dayOfWeek: number;
        time: string; // Format: "15:00:00"
    }>;
    tutor: {
        id: string;
        fullName: string;
        email: string | null;
        avatarUrl: string;
    };
}

export interface GroupClass {
    id: string;
    title: string;
    classDescription?: string;
    maxStudents?: number;
    enrolledStudents?: number; // Number of enrolled students from API
    students?: UserInfo[]; // Optional: detailed student list if available
    schedule: ClassSchedule[];
    startDate?: Date;
    pricePerHour: number;
}

export interface TutorLanguage {
    language: Language;
    isNative: boolean;
}

export interface TutorLanguageResponse {
    code: string;
    isNative: boolean;
}

export type ClassLevel = 'Beginner' | 'Intermediate' | 'Advanced';

/* ======================== Onboarding ======================== */

export interface TutorOnboarding {
    id: string;
    currentStep: number;
    jsonData: string;
    status: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

// ===== SCHEDULE MANAGEMENT API =====
export type ScheduleViewMode = 'daily' | 'weekly' | 'monthly';
export type ScheduleStatus = 'PENDING' | 'BOOKED' | 'CANCELLED' | 'CONFIRMED' | 'COMPLETED' | 'NO_SHOW';

export interface GetAvailabilityRequest {
    tutorId: string;
    startDate: string;
    endDate: string;
}

export interface GetAvailabilityResponse {
    availabilities: TutorAvailability[];
}

export interface UpdateAvailabilityRequest {
    availabilities: Omit<TutorAvailability, 'id'>[];
    deleteIds?: string[];
}

export interface UpdateAvailabilityResponse {
    availabilities: TutorAvailability[];
    message: string;
}

export interface TutorOnboardingData {
    id: string;
    fullName: string;
    email: string;
    gender: Gender | null;
    countryCode: string;
    timezone: string;
    languages: TutorLanguage[];
    subjects: Subject[];
    headline: string;
    introduction: string;
    currentSessionFee: number;
    originalSessionFee?: number;

    // Media Portfolio
    avatarUrl?: string;
    videoUrl?: string;

    // Education & Experience
    educations: EducationItem[];
    experiences: ExperienceItem[];

    // Certifications
    certifications: CertificationItem[];

    // Availability
    availabilities: TutorAvailability[];

    // Social Links
    socialLinks: TutorSocial[];
}


