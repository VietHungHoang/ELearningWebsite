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

export interface MonthlyIncomeResponse {
    incomes: Array<{ month: string; income: number }>;
}

export interface MonthlyStudentsResponse {
    students: Array<{ month: string; students: number }>;
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
            // Format params manually to avoid Axios default serialization issues
            const queryParams = new URLSearchParams();

            if (filters.category) queryParams.append('categoryId', filters.category);
            if (filters.subject) queryParams.append('subjectId', filters.subject);

            // Handle languageCodes array - append each separately
            if (filters.languageCodes && filters.languageCodes.length > 0) {
                filters.languageCodes.forEach(code => {
                    queryParams.append('languageCodes', code);
                });
            }

            if (filters.minFee !== undefined) queryParams.append('minPrice', filters.minFee.toString());
            if (filters.maxFee !== undefined) queryParams.append('maxPrice', filters.maxFee.toString());
            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters.keyword) queryParams.append('keyword', filters.keyword);
            if (filters.sessionType) queryParams.append('sessionType', filters.sessionType);

            // Handle availability - convert to availableDays format with timeSlot
            // Format: "MONDAY_MORNING", "TUESDAY_AFTERNOON", etc.
            // Backend expects availableDays as List<String> with format "DAY_TIMESLOT"
            if (filters.availability && filters.availability.length > 0) {
                // Map day numbers to day names
                const dayNames = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

                // Map timeSlot from Vietnamese/English to uppercase English
                const timeSlotMap: Record<string, string> = {
                    'Morning': 'MORNING',
                    'Afternoon': 'AFTERNOON',
                    'Evening': 'EVENING',
                    'Buổi sáng': 'MORNING',
                    'Buổi chiều': 'AFTERNOON',
                    'Buổi tối': 'EVENING',
                    'MORNING': 'MORNING',
                    'AFTERNOON': 'AFTERNOON',
                    'EVENING': 'EVENING'
                };

                // Convert each availability slot to "DAY_TIMESLOT" format
                filters.availability.forEach(slot => {
                    if (slot.day && slot.day >= 1 && slot.day <= 7 && slot.timeSlot) {
                        const dayName = dayNames[slot.day - 1];
                        const timeSlotUpper = timeSlotMap[slot.timeSlot] || slot.timeSlot.toUpperCase();

                        if (dayName && timeSlotUpper) {
                            // Format: "MONDAY_MORNING", "TUESDAY_AFTERNOON", etc.
                            const dayTimeSlot = `${dayName}_${timeSlotUpper}`;
                            queryParams.append('availableDays', dayTimeSlot);
                        }
                    }
                });
            }

            if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
            if (filters.size !== undefined) queryParams.append('size', filters.size.toString());
            if (studentId) queryParams.append('studentId', studentId);

            // Add timezone - use filter timezone or get user's current timezone
            if (filters.timezone) {
                queryParams.append('timezone', filters.timezone);
            } else {
                // Fallback to user's current timezone if not provided
                try {
                    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    queryParams.append('timezone', userTimezone);
                } catch (e) {
                    console.warn('Could not get user timezone:', e);
                }
            }

            const url = `/v1/public/search/tutors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await apiService.get<PaginatedResponse<TutorResponse>>(url);
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

    submitReview: async (reviewData: SubmitReviewRequest): Promise<ApiResponse<{ message: string }>> => {
        try {
            return await apiService.post<{ message: string }>(`/v1/reviews`, reviewData);
        } catch (error) {
            console.warn("Failed to submit review to API:", error);
            throw error;
        }
    },

    // Get charts data for tutor dashboard (DEPRECATED - use separate endpoints)
    // getTutorChartsData: async (): Promise<ApiResponse<ChartsData>> => {
    //     return await apiService.get<ChartsData>(`/v1/tutors/me/dashboard/charts`);
    // },

    // Get monthly income statistics for tutor
    getMonthlyIncomeStats: async (): Promise<ApiResponse<MonthlyIncomeResponse>> => {
        return await apiService.get<MonthlyIncomeResponse>(`/v1/tutors/me/income`);
    },

    // Get monthly student statistics for tutor
    getMonthlyStudentStats: async (): Promise<ApiResponse<MonthlyStudentsResponse>> => {
        return await apiService.get<MonthlyStudentsResponse>(`/v1/classes/statistics/me/students`);
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

    getSimilarTutors: async (tutorId: string, studentId?: string): Promise<ApiResponse<PaginatedResponse<Tutor>>> => {
        try {
            const queryParams = new URLSearchParams();
            if (studentId) queryParams.append('studentId', studentId);

            const url = `/v1/public/tutors/${tutorId}/similar${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await apiService.get<PaginatedResponse<TutorResponse>>(url);
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
            console.warn("Failed to fetch similar tutors from API:", error);
            throw error;
        }
    },
};
