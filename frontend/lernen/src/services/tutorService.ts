import type {
    ApiResponse,
    TutorSearchFilter,
    PaginatedResponse,
    FilterData,
    UpdateTutorProfileRequest,
    UploadFileResponse,

} from "../types/api";
import apiService from "./apiService";
import { mapTutorResponseToTutor, mapTutorDetailResponseToTutorDetail } from "../mappers/tutorMapper";
import type { CertificationItem, EducationItem, ExperienceItem, Tutor, TutorDetail, TutorDetailResponse, TutorResponse } from "../types/tutor";
import type { SubmitReviewRequest } from "../types/student";

export const tutorService = {
    getFilterData: async (): Promise<ApiResponse<FilterData>> => {
        return await apiService.get<FilterData>("/v1/public/common/tutor-filter");
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
    
    getTutorDetail: async (tutorId: string, studentId?: string): Promise<ApiResponse<TutorDetail>> => {
        try {
            const params: Record<string, string> = {};
            console.log("Fetching tutor detail with studentId:", studentId);
            if (studentId) {
                console.log("Including studentId in request params", studentId);
                params.studentId = studentId;
            }
            const response = await apiService.get<TutorDetailResponse>(`/v1/public/tutors/${tutorId}`, params);
            const tutor = await mapTutorDetailResponseToTutorDetail(response.data);
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: tutor,
            };
        } catch (error) {
            console.warn("Failed to fetch tutor detail from API:", error);
            throw error;
        }
    },

    getTutorProfile: async (): Promise<ApiResponse<any>> => {
        try {
            return await apiService.get<any>("/api/v1/tutors/profile");
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
            return await apiService.put<any>("/api/v1/tutors/profile", profileData);
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

    submitReview: async (tutorId: string, reviewData: SubmitReviewRequest): Promise<ApiResponse<{ message: string }>> => {
        try {
            return await apiService.post<{ message: string }>(`/api/v1/tutors/${tutorId}/reviews`, reviewData);
        } catch (error) {
            console.warn("Failed to submit review to API:", error);
            throw error;
        }
    },
};


export const getTutorSchedule = async (tutorId: string, includeBooked: boolean = false): Promise<any[]> => {
    try {
        const response = await apiService.get<any[]>(
            `/api/v1/tutors/${tutorId}/schedule?includeBooked=${includeBooked}`
        );
        return response.data;
    } catch (error) {
        console.warn("Failed to fetch tutor schedule from API:", error);
        return [];
    }
};
