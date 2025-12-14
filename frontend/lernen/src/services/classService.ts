import apiService from "./apiService";
import type {
    Class,
    ClassDetail,
    ApiResponse,
    PaginatedResponse,
    TrialSessionRequest,
    TrialSessionRequestResponse,
    PayoutSummary,
    PayoutMethod,
    PayoutHistoryItem,
    RecentEarning,
    PayoutFilters,
    RecentEarningsFilters,
} from "../types/api";
import type { GetBookedSessionsRequest, GetBookedSessionsResponse } from "../types/class";

export interface ClassFilters {
    status?: "Ongoing" | "Completed";
    type?: "1-on-1" | "Group";
    search?: string;
    page?: number;
    limit?: number;
}

export const classService = {
    getClassesByTutorId: async (
        tutorId: string,
        filters?: ClassFilters
    ): Promise<ApiResponse<PaginatedResponse<Class>>> => {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.status) queryParams.append("status", filters.status);
            if (filters?.type) queryParams.append("type", filters.type);
            if (filters?.search) queryParams.append("search", filters.search);
            if (filters?.page) queryParams.append("page", filters.page.toString());
            if (filters?.limit) queryParams.append("limit", filters.limit.toString());

            const url = `/tutors/${tutorId}/classes${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
            const response = await apiService.get<PaginatedResponse<Class>>(url);

            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error) {
            console.warn("Failed to fetch classes from API, using mock data:", error);
            throw error;
        }
    },

    getClassById: async (tutorId: string, classId: string): Promise<ApiResponse<Class>> => {
        return await apiService.get<Class>(`/tutors/${tutorId}/classes/${classId}`);
    },

    getClassDetail: async (tutorId: string, classId: string): Promise<ApiResponse<ClassDetail>> => {
        return await apiService.get<ClassDetail>(`/tutors/${tutorId}/classes/${classId}/detail`);
    },

    requestTrialSession: async (request: TrialSessionRequest): Promise<ApiResponse<null>> => {
        return await apiService.post<null>("/v1/classes/trial-session", request);
    },

    acceptRescheduleRequest: async (requestId: string): Promise<ApiResponse<null>> => {
        return await apiService.post<null>(`/v1/class/reschedule-requests/accept`, { requestId });
    },

    acceptTrialRequest: async (requestId: string): Promise<ApiResponse<null>> => {
        try {
            const response = await apiService.post<null>(`/v1/public/class/trial-session/${requestId}/accept`);
            return {
                status: response.status,
                success: true,
                message: "Trial session request accepted successfully",
                data: null,
            };
        } catch (error: any) {
            console.error("Error accepting trial session request:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to accept trial session request",
                data: null,
            };
        }
    },

    // Get Zoom authorization URL
    zoomAuthorize: async (tutorId: string): Promise<ApiResponse<{ authorizationUrl: string }>> => {
        try {
            const response = await apiService.get<{ authorizationUrl: string }>(
                `/v1/public/class/zoom/authorize?tutorId=${tutorId}`
            );
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error: any) {
            console.error("Error getting Zoom authorization URL:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to get Zoom authorization URL",
                data: null as any,
            };
        }
    },

    // Handle Zoom OAuth callback
    zoomCallback: async (code: string, tutorId: string): Promise<ApiResponse<{ message: string }>> => {
        try {
            const response = await apiService.post<{ message: string }>(`/v1/public/class/zoom/callback`, {
                code,
                state: tutorId,
            });
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error: any) {
            console.error("Error handling Zoom callback:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to complete Zoom authorization",
                data: null as any,
            };
        }
    },

    // Get trial session request for a tutor and student
    getTrialSessionRequest: async (
        tutorId: string,
        studentId: string
    ): Promise<ApiResponse<TrialSessionRequestResponse | null>> => {
        try {
            const response = await apiService.get<TrialSessionRequestResponse>(`/v1/classes/trial-session`, {
                tutorId,
                studentId,
            });
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error: any) {
            // If no record found (404), return null data
            if (error.response?.status === 404) {
                return {
                    status: 404,
                    success: true,
                    message: "No trial session request found",
                    data: null,
                };
            }
            console.error("Error fetching trial session request:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to fetch trial session request",
                data: null,
            };
        }
    },

    // Get list of trial session requests for tutor or student
    getTrialRequests: async (
        role: "tutor" | "student",
        userId: string
    ): Promise<ApiResponse<TrialSessionRequestResponse[]>> => {
        try {
            const response = await apiService.get<TrialSessionRequestResponse[]>(
                `/v1/public/class/trial-session/list`,
                {
                    role,
                    userId,
                }
            );
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error: any) {
            console.error("Error fetching trial requests:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to fetch trial requests",
                data: [],
            };
        }
    },

    // Get payout summary for a tutor
    getPayoutSummary: async (tutorId: string): Promise<ApiResponse<PayoutSummary>> => {
        return await apiService.get<PayoutSummary>(`/api/v1/classes/tutors/${tutorId}/earnings/summary`);
    },

    // Get payout methods for a tutor
    getPayoutMethods: async (tutorId: string): Promise<ApiResponse<PayoutMethod[]>> => {
        return await apiService.get<PayoutMethod[]>(`/api/v1/payouts/tutors/${tutorId}/methods`);
    },

    // Get payout history for a tutor with pagination
    getPayoutHistory: async (tutorId: string, filters?: PayoutFilters): Promise<ApiResponse<PaginatedResponse<PayoutHistoryItem>>> => {
        const queryParams = new URLSearchParams();

        if (filters?.status) queryParams.append("status", filters.status);
        if (filters?.page) queryParams.append("page", filters.page.toString());
        if (filters?.limit) queryParams.append("limit", filters.limit.toString());

        const url = `/api/v1/payouts/tutors/${tutorId}/history${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        return await apiService.get<PaginatedResponse<PayoutHistoryItem>>(url);
    },

    // Get recent earnings for a tutor with filters and pagination
    getRecentEarnings: async (tutorId: string, filters?: RecentEarningsFilters): Promise<ApiResponse<PaginatedResponse<RecentEarning>>> => {
        const queryParams = new URLSearchParams();

        if (filters?.type && filters.type !== 'All') queryParams.append("classType", filters.type);
        if (filters?.page) queryParams.append("page", filters.page.toString());
        if (filters?.size) queryParams.append("size", filters.size.toString());

        const url = `/api/v1/class/tutors/${tutorId}/earnings${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        return await apiService.get<PaginatedResponse<RecentEarning>>(url);
    },

    // Get booked sessions for a tutor within date range
    getBookedSessions: async (request: GetBookedSessionsRequest): Promise<ApiResponse<GetBookedSessionsResponse>> => {
        const params = new URLSearchParams({
            startDate: request.startDate,
            endDate: request.endDate,
        });

        return await apiService.get<GetBookedSessionsResponse>(
            `/api/v1/classes/sessions/tutors/${request.tutorId}?${params.toString()}`
        );
    },
};
