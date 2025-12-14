import type { Country, Language, Subject } from "./common";

export type Gender = 'Male' | 'Female' | 'Not specified';

export interface TutorBasicInfo {
    id: string;
    fullName: string;
    avatarUrl: string;
}

export interface BaseTutor extends TutorBasicInfo {
    email: string;
    isVerified: boolean;
    introduction: string;
    headline: string;
    gender: Gender;
    timezone: string;
    videoUrl: string;
    currentSessionFee: number;
    originalSessionFee?: number;
    averageRating: number;
    reviewCount: number;
    bookedSessionsCount: number;
    studentCount: number;
    hasTrialSession: boolean;
}

export interface Tutor extends BaseTutor {
    country: Country;
    languages: TutorLanguage[];
    subjects: Subject[];
}

export interface TutorResponse extends BaseTutor {
    countryCode: string;
    languageCodes: TutorLanguageResponse[];
    subjectIds: string[];
}

export interface TutorDetail extends Tutor {
    reviews: TutorReview[];
    availabilities: TutorAvailability[];
    socialLinks: TutorSocial[];
    educations: EducationItem[];
    experiences: ExperienceItem[];
    certifications: CertificationItem[];
    groupClasses?: GroupClass[];
}

export interface TutorDetailResponse extends TutorResponse {
    reviews?: TutorReview[];
    availabilities: TutorAvailability[];
    socialLinks: TutorSocial[];
    educations: EducationItem[];
    experiences: ExperienceItem[];
    certifications: CertificationItem[];
    groupClasses?: GroupClass[];
}

export interface TutorReview {
    id: string;
    studentId: string;
    studentName: string;
    rating: number;
    comment: string;
    submitAt?: string;
    avatarUrl?: string;
}

export interface TutorSocial {
    platform: string;
    url: string;
};

export interface TutorAvailability {
    id?: string;
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
    id: string;
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

export interface ClassScheduleItem {
    dayOfWeek: number; // 1=Monday, 2=Tuesday, etc.
    time: string; // LocalTime format like "14:30" or "5:00 PM"
}

// New: Group class representation coming from backend
export interface GroupClassStudent {
    id: string;
    name: string;
}

export interface GroupClass {
    classId: string; // UUID
    classTitle: string;
    classDescription?: string;
    maxStudents?: number;
    students?: GroupClassStudent[];
    schedule: ClassScheduleItem[];
    duration: number; // Duration in minutes
    startDate: Date;
    level: ClassLevel;
    price: number;
    sessions: number;
    language: Language;
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
    from: string;
    to: string;
    availabilities: TutorAvailability[];
}

export interface UpdateAvailabilityRequest {
    availabilities: Omit<TutorAvailability, 'id'>[];
}

export interface UpdateAvailabilityResponse {
    availabilities: TutorAvailability[];
    message: string;
}


