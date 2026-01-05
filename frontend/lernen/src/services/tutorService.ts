import type {
    ApiResponse,
    TutorSearchFilter,
    PaginatedResponse,
    FilterData,
    UpdateTutorProfileRequest,
    UploadFileResponse,
    CareerEntryRequest,
    CareerEntryResponse,
} from "../types/api";
import apiService from "./apiService";
import { mapTutorResponseToTutor, mapTutorProfileHeaderResponseToTutorProfileHeader } from "../mappers/tutorMapper";
import type { CertificationItem, EducationItem, ExperienceItem, Tutor, TutorResponse } from "../types/tutor";
import type { SubmitReviewRequest } from "../types/student";

interface FuzzySearchSuggestion {
    id: string;
    text: string;
    type: 'tutor' | 'subject' | 'category';
}

export interface ChartsData {
    incomes: Array<{ month: string; income: number }>; // month format: "YYYY-MM"
    students: Array<{ month: string; students: number }>; // month format: "YYYY-MM"
}

export const tutorService = {
    getFilterData: async (): Promise<ApiResponse<FilterData>> => {
        return await apiService.get<FilterData>("/v1/public/common/tutor-filter");
    },

    getFuzzySearchSuggestions: async (keyword: string, language?: string): Promise<ApiResponse<FuzzySearchSuggestion[]>> => {
        const params: Record<string, string> = { keyword };
        if (language) {
            params.language = language;
        }
        return await apiService.get<FuzzySearchSuggestion[]>(`/v1/public/search/tutors/suggestions`, params);
    },

    searchTutors: async (filters: TutorSearchFilter, studentId?: string): Promise<ApiResponse<PaginatedResponse<Tutor>>> => {
        try {
            const params: Record<string, unknown> = { ...filters };
            if (studentId) {
                params.studentId = studentId;
            }
            const response = await apiService.get<PaginatedResponse<TutorResponse>>(
                "/v1/public/search/tutors",
                params
            );
            const mappedContent = await Promise.all(response.data.content.map(mapTutorResponseToTutor));
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: {
                    ...response.data,
                    content: mappedContent,
                },
            };
        } catch (error) {
            console.warn("Failed to search tutors from API:", error);
            throw error;
        }
    },

    getTutorDetail: async (tutorId: string, studentId?: string): Promise<ApiResponse<import('../types/api').TutorDetail>> => {
        try {
            const params: Record<string, string> = {};
            console.log("Fetching tutor detail with studentId:", studentId);
            if (studentId) {
                console.log("Including studentId in request params", studentId);
                params.studentId = studentId;
            }
            const response = await apiService.get<TutorResponse>(`/v1/public/tutors/${tutorId}`, params);
            // const tutor = await mapTutorDetailResponseToTutorDetail(response.data);
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: null as any, // Temporarily set to null to avoid breaking changes
            };
        } catch (error) {
            console.warn("Failed to fetch tutor detail from API:", error);
            throw error;
        }
    },

    getTutor: async (tutorId: string, studentId?: string): Promise<ApiResponse<Tutor>> => {
        try {
            const params: Record<string, string> = {};
            if (studentId) {
                params.studentId = studentId;
            }
            const response = await apiService.get<TutorResponse>(`/v1/public/tutors/${tutorId}`, params);
            const profileHeaderData = await mapTutorProfileHeaderResponseToTutorProfileHeader(response.data);

            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: profileHeaderData,
            };
        } catch (error) {
            console.warn("Failed to fetch tutor profile header from API:", error);
            throw error;
        }
    },

    getTutorProfile: async (): Promise<ApiResponse<any>> => {
        try {
            return await apiService.get<any>("/v1/tutors/me/profile");
        } catch (error) {
            console.warn("Failed to fetch tutor profile from API:", error);
            return {
                status: 500,
                success: false,
                message: "Failed to fetch tutor profile",
                data: null as any,
            };
        }
    },

    updateTutorProfile: async (profileData: UpdateTutorProfileRequest): Promise<ApiResponse<any>> => {
        try {
            return await apiService.put<any>("/v1/tutors/me/profile", profileData);
        } catch (error) {
            console.warn("Failed to update tutor profile from API:", error);
            throw error;
        }
    },

    uploadProfilePhoto: async (file: File): Promise<ApiResponse<UploadFileResponse>> => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            return await apiService.post<UploadFileResponse>("/api/v1/tutors/profile/upload-photo", formData);
        } catch (error) {
            console.warn("Failed to upload profile photo from API:", error);
            throw error;
        }
    },

    uploadIntroductionVideo: async (file: File): Promise<ApiResponse<UploadFileResponse>> => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            return await apiService.post<UploadFileResponse>("/api/v1/tutors/profile/upload-video", formData);
        } catch (error) {
            console.warn("Failed to upload introduction video from API:", error);
            throw error;
        }
    },

    updateResumeHighlights: async (resumeData: {
        education?: EducationItem[];
        experience?: ExperienceItem[];
        certifications?: CertificationItem[];
    }): Promise<
        ApiResponse<{ education: EducationItem[]; experience: ExperienceItem[]; certifications: CertificationItem[] }>
    > => {
        try {
            return await apiService.put<{
                education: EducationItem[];
                experience: ExperienceItem[];
                certifications: CertificationItem[];
            }>("/api/v1/tutors/profile/resume", resumeData);
        } catch (error) {
            console.warn("Failed to update resume highlights from API:", error);
            throw error;
        }
    },

    submitOnboarding: async (onboardingData: any): Promise<ApiResponse<{ message: string }>> => {
        try {
            return await apiService.post<{ message: string }>("/api/v1/tutors/onboarding", onboardingData);
        } catch (error) {
            console.warn("Failed to submit onboarding to API:", error);
            throw error;
        }
    },

    getTutorStats: async (isAll: boolean): Promise<ApiResponse<{
        totalEarnings: number;
        totalStudents: number;
        teachingHours: number;
        newReviews: number;
    }>> => {
        try {
            const params = isAll ? {} : { startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().replace('Z', '') };
            return await apiService.get<{
                totalEarnings: number;
                totalStudents: number;
                teachingHours: number;
                newReviews: number;
            }>("/v1/tutors/me/dashboard/stats", params);
        } catch (error) {
            console.warn("Failed to fetch tutor stats from API:", error);
            throw error;
        }
    },

    submitReview: async (tutorId: string, reviewData: SubmitReviewRequest): Promise<ApiResponse<{ message: string }>> => {
        try {
            return await apiService.post<{ message: string }>(`/api/v1/tutors/${tutorId}/reviews`, reviewData);
        } catch (error) {
            console.warn("Failed to submit review to API:", error);
            throw error;
        }
    },

    // Get charts data for tutor dashboard
    getTutorChartsData: async (): Promise<ApiResponse<ChartsData>> => {
        return await apiService.get<ChartsData>(`/v1/tutors/me/dashboard/charts`);
    },

    /**
     * Submit resume text to backend
     * After tutor uploads file or enters text manually
     * 
     * @param tutorId - Tutor ID from localStorage
     * @param resumeText - Extracted or manually entered resume text
     * @returns API response
     */
    submitResumeText: async (tutorId: string, resumeText: string): Promise<ApiResponse<{ message: string }>> => {
        try {
            return await apiService.post<{ message: string }>(
                `/v1/tutors/${tutorId}/onboarding/submit-file`,
                { resumeText }
            );
        } catch (error) {
            console.warn('Failed to submit resume text to API:', error);
            throw error;
        }
    },

    // ===== Career Entry (Education & Experience) API =====

    getCareerEntries: async (): Promise<ApiResponse<CareerEntryResponse[]>> => {
        try {
            return await apiService.get<CareerEntryResponse[]>("/v1/tutors/me/career-entries");
        } catch (error) {
            console.warn("Failed to fetch career entries:", error);
            throw error;
        }
    },

    getEducations: async (): Promise<ApiResponse<CareerEntryResponse[]>> => {
        try {
            return await apiService.get<CareerEntryResponse[]>("/v1/tutors/me/career-entries/educations");
        } catch (error) {
            console.warn("Failed to fetch educations:", error);
            throw error;
        }
    },

    getExperiences: async (): Promise<ApiResponse<CareerEntryResponse[]>> => {
        try {
            return await apiService.get<CareerEntryResponse[]>("/v1/tutors/me/career-entries/experiences");
        } catch (error) {
            console.warn("Failed to fetch experiences:", error);
            throw error;
        }
    },

    createCareerEntry: async (entryData: CareerEntryRequest): Promise<ApiResponse<CareerEntryResponse>> => {
        try {
            return await apiService.post<CareerEntryResponse>("/v1/tutors/me/career-entries", entryData);
        } catch (error) {
            console.warn("Failed to create career entry:", error);
            throw error;
        }
    },

    updateCareerEntry: async (id: string, entryData: CareerEntryRequest): Promise<ApiResponse<CareerEntryResponse>> => {
        try {
            return await apiService.put<CareerEntryResponse>(`/v1/tutors/me/career-entries/${id}`, entryData);
        } catch (error) {
            console.warn(`Failed to update career entry ${id}:`, error);
            throw error;
        }
    },

    getZoomAuthorizationUrl: async (tutorId: string): Promise<ApiResponse<{ authorizationUrl: string }>> => {
        try {
            return await apiService.get<{ authorizationUrl: string }>("/v1/tutors/zoom/oauth/authorize", { tutorId });
        } catch (error) {
            console.warn("Failed to get Zoom authorization URL:", error);
            throw error;
        }
    },

    deleteCareerEntry: async (id: string): Promise<ApiResponse<void>> => {
        try {
            return await apiService.delete<void>(`/v1/tutors/me/career-entries/${id}`);
        } catch (error) {
            console.warn(`Failed to delete career entry ${id}:`, error);
            throw error;
        }
    },
};
