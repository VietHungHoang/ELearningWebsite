import apiService from "./apiService";
import type {
    ApiResponse,
    PaginatedResponse,
    TrialSessionRequest,
    TrialSessionRequestResponse,
    PayoutStats,
    PayoutSummary,
    PayoutMethod as PaymentMethod,
    PayoutHistoryItem,
    RecentEarning,
    PayoutFilters,
    RecentEarningsFilters,
} from "../types/api";
import type { ClassDetail, ClassTable, GetBookedSessionsRequest, GetBookedSessionsResponse, Session, ClassSchedule } from "../types/class";
import type { GroupClass } from "../types/tutor";
import { th } from "date-fns/locale";

// ClassData interface for class detail page
export interface ClassData {
    id: string;
    classTitle: string;
    students: StudentInfo[];
    type: '1-on-1' | 'Group';
    status: 'Ongoing' | 'Opening' | 'Completed';
    schedules: { day: string; time: string }[];
    startDate: string;
    completedSessions: number;
    totalSessions: number;
    quizzes: { id: string; title: string; status: 'Completed' | 'Pending' }[];
    materials: { id: string; name: string; type: 'PDF' | 'Video' | 'ZIP'; date: string }[];
    subject?: string;
    category?: string;
    tuitionFee?: number;
    description?: string;
}

export interface StudentInfo {
    id: string;
    name: string;
    avatar: string;
}

// Mock data for class detail page fallback
const mockClassDetailData: ClassData = {
    id: "class-1",
    classTitle: "English Conversation Advanced",
    students: [
        { id: "student-1", name: "John Doe", avatar: "https://via.placeholder.com/40" },
        { id: "student-2", name: "Jane Smith", avatar: "https://via.placeholder.com/40" },
        { id: "student-3", name: "Bob Johnson", avatar: "https://via.placeholder.com/40" }
    ],
    type: "Group",
    status: "Ongoing",
    schedules: [
        { day: "Monday", time: "14:00" },
        { day: "Wednesday", time: "14:00" },
        { day: "Friday", time: "14:00" }
    ],
    startDate: "2024-01-15",
    completedSessions: 8,
    totalSessions: 24,
    quizzes: [],
    materials: []
};

// Mock data for testing when API fails
const mockClassData: ClassTable[] = [
    {
        id: 'mock-1',
        title: 'Lập trình JavaScript Nâng Cao - Nhóm',
        students: [
            { id: 'student-1', fullName: 'Nguyễn Văn A', avatarUrl: '' },
            { id: 'student-2', fullName: 'Trần Thị B', avatarUrl: '' },
            { id: 'student-3', fullName: 'Lê Văn C', avatarUrl: '' }
        ],
        type: 'GROUP',
        status: 'ONGOING',
        schedules: [
            { dayOfWeek: 2, time: '19:00' },
            { dayOfWeek: 4, time: '19:00' }
        ],
        startDate: '2025-01-15',
        completedSessions: 8,
        totalSessions: 20
    },
    {
        id: 'mock-2',
        title: 'Lập trình Python Cơ Bản - 1-1',
        students: [
            { id: 'student-4', fullName: 'Phạm Thị D', avatarUrl: '' }
        ],
        type: 'ONE_ON_ONE',
        status: 'ONGOING',
        schedules: [
            { dayOfWeek: 3, time: '20:00' }
        ],
        startDate: '2025-02-01',
        completedSessions: 5,
        totalSessions: 15
    },
    {
        id: 'mock-3',
        title: 'Thiết kế Web Responsive - Nhóm',
        students: [],
        type: 'GROUP',
        status: 'OPENING',
        schedules: [
            { dayOfWeek: 6, time: '14:00' },
            { dayOfWeek: 7, time: '14:00' }
        ],
        startDate: '2025-12-25',
        completedSessions: 0,
        totalSessions: 12
    }
];

export interface CreateClassRequest {
    title: string;
    subjectId: string;
    tuitionFee: number;
    maxStudents: number;
    description: string;
    schedules: ClassSchedule[];
}

export interface ClassFilters {
    status?: "Ongoing" | "Completed";
    type?: "1-on-1" | "Group";
    search?: string;
    page?: number;
    size?: number;
}

export const classService = {
    getClassesForTutor: async (
        filters?: ClassFilters
    ): Promise<ApiResponse<PaginatedResponse<ClassTable>>> => {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.status) queryParams.append("status", filters.status);
            if (filters?.type) queryParams.append("type", filters.type);
            if (filters?.search) queryParams.append("search", filters.search);
            if (filters?.page) queryParams.append("page", filters.page.toString());
            if (filters?.size) queryParams.append("size", filters.size.toString());

            const url = `/v1/classes/tutors/me${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
            const response = await apiService.get<PaginatedResponse<ClassTable>>(url);

            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error) {
            console.warn("Failed to fetch classes from API, using mock data:", error);
            
            // Return mock data for testing when API fails
            return {
                status: 200,
                success: true,
                message: "Mock data returned due to API failure",
                data: {
                    content: mockClassData,
                    pageable: {
                        pageNumber: (filters?.page || 1) - 1,
                        pageSize: filters?.size || 10,
                        offset: ((filters?.page || 1) - 1) * (filters?.size || 10),
                        paged: true
                    },
                    totalPages: 1,
                    totalElements: mockClassData.length,
                    last: true,
                    first: true,
                    numberOfElements: mockClassData.length,
                    size: filters?.size || 10,
                    number: (filters?.page || 1) - 1,
                    empty: false
                }
            };
        }
    },

    getClassesForStudent: async (
        filters?: ClassFilters
    ): Promise<ApiResponse<PaginatedResponse<ClassTable>>> => {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.status) queryParams.append("status", filters.status);
            if (filters?.type) queryParams.append("type", filters.type);
            if (filters?.search) queryParams.append("search", filters.search);
            if (filters?.page) queryParams.append("page", filters.page.toString());
            if (filters?.size) queryParams.append("size", filters.size.toString());

            const url = `/v1/classes/students/me${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
            const response = await apiService.get<PaginatedResponse<ClassTable>>(url);

            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error) {
            console.warn("Failed to fetch classes from API, using mock data:", error);
            
            // Return mock data for testing when API fails
            return {
                status: 200,
                success: true,
                message: "Mock data returned due to API failure",
                data: {
                    content: mockClassData,
                    pageable: {
                        pageNumber: (filters?.page || 1) - 1,
                        pageSize: filters?.size || 10,
                        offset: ((filters?.page || 1) - 1) * (filters?.size || 10),
                        paged: true
                    },
                    totalPages: 1,
                    totalElements: mockClassData.length,
                    last: true,
                    first: true,
                    numberOfElements: mockClassData.length,
                    size: filters?.size || 10,
                    number: (filters?.page || 1) - 1,
                    empty: false
                }
            };
        }
    },

    createClass: async (classData: CreateClassRequest): Promise<ApiResponse<ClassTable>> => {
        try {
            const response = await apiService.post<ClassTable>("/classes/tutors/me", classData);
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error) {
            console.error("Failed to create class:", error);
            throw error;
        }
    },

    getClassById: async (tutorId: string, classId: string): Promise<ApiResponse<ClassTable>> => {
        return await apiService.get<ClassTable>(`/tutors/${tutorId}/classes/${classId}`);
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

    // Get list of reschedule requests for tutor or student
    getRescheduleRequests: async (
        role: "tutor" | "student",
        userId: string
    ): Promise<ApiResponse<any[]>> => {
        try {
            const response = await apiService.get<any[]>(
                `/v1/class/reschedule-requests/by-user`,
                {
                    role,
                    userId,
                }
            );
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data || [],
            };
        } catch (error: any) {
            console.error("Error fetching reschedule requests:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to fetch reschedule requests",
                data: [],
            };
        }
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

    getTrialSessionRequest: async (
        tutorId: string,
        studentId: string
    ): Promise<ApiResponse<TrialSessionRequestResponse | null>> => {
        try {
            return await apiService.get<TrialSessionRequestResponse>(`/v1/classes/trial-session`, {
                tutorId,
                studentId,
            });
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
                `/v1/classes/trial-session/by-user`,
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

    // Get list of trial session requests by tutor ID or student ID
    getTrialRequestsByUser: async (
        userId: string,
        userType: "tutor" | "student"
    ): Promise<ApiResponse<TrialSessionRequestResponse[]>> => {
        try {
            const response = await apiService.get<TrialSessionRequestResponse[]>(
                `/v1/classes/trial-session/by-user`,
                {
                    userId,
                    userType,
                }
            );

            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data || [],
            };
        } catch (error: any) {
            console.error("Error fetching trial requests by user:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to fetch trial requests",
                data: [],
            };
        }
    },

    // Get payout stats for a tutor (4 main stats)
    getPayoutStats: async (): Promise<ApiResponse<PayoutStats>> => {
        return await apiService.get<PayoutStats>(`/v1/tutors/me/earnings/stats`);
    },

    // Get payout summary for a tutor (full details)
    getPayoutSummary: async (): Promise<ApiResponse<PayoutSummary>> => {
        return await apiService.get<PayoutSummary>(`/v1/tutors/me/earnings/summary`);
    },

    // Get payout methods for a tutor
    getPayoutMethods: async (): Promise<ApiResponse<PaymentMethod[]>> => {
        return await apiService.get<PaymentMethod[]>(`/v1/tutors/me/payment-methods`);
    },

    // Get payout history for a tutor with pagination
    getPayoutHistory: async (
        filters?: PayoutFilters
    ): Promise<ApiResponse<PaginatedResponse<PayoutHistoryItem>>> => {
        const queryParams = new URLSearchParams();

        if (filters?.status) queryParams.append("status", filters.status);
        if (filters?.page) queryParams.append("page", filters.page.toString());
        if (filters?.limit) queryParams.append("limit", filters.limit.toString());

        const url = `/v1/payments/me/history${
            queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;
        return await apiService.get<PaginatedResponse<PayoutHistoryItem>>(url);
    },

    // Get recent earnings for a tutor with filters and pagination
    getRecentEarnings: async (
        filters?: RecentEarningsFilters
    ): Promise<ApiResponse<PaginatedResponse<RecentEarning>>> => {
        const queryParams = new URLSearchParams();

        if (filters?.type && filters.type !== "All") queryParams.append("classType", filters.type);
        if (filters?.page) queryParams.append("page", filters.page.toString());
        if (filters?.size) queryParams.append("size", filters.size.toString());

        const url = `/v1/tutors/me/earnings${
            queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;
        return await apiService.get<PaginatedResponse<RecentEarning>>(url);
    },

    // Get booked sessions for a tutor within date range
    getBookedSessions: async (request: GetBookedSessionsRequest): Promise<ApiResponse<GetBookedSessionsResponse>> => {
        const params = new URLSearchParams({
            startDate: request.startDate,
            endDate: request.endDate,
        });

        return await apiService.get<GetBookedSessionsResponse>(
            `/v1/classes/sessions/tutors/${request.tutorId}?${params.toString()}`
        );
    },

    getSessionsByTime: async (startDate: string, endDate: string): Promise<ApiResponse<Session[]>> => {
        const url = `/v1/classes/sessions/me?startDate=${startDate.replace('Z', '')}&endDate=${endDate.replace('Z', '')}`;

        return await apiService.get<Session[]>(url);
    },

    // Get class details for detail page with fallback to mock data
    getClassDetailForPage: async (classId: string): Promise<ClassData> => {
        try {
            // TODO: Replace with actual API call when backend is ready
            const response = await fetch(`/api/classes/${classId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch class details');
            }
            const data: any = await response.json();
            return data;
        } catch (error) {
            console.warn('API fetch failed, using mock data:', error);
            // Return mock data as fallback
            return mockClassDetailData;
        }
    },

    getTutorSessions: async (tutorId: string, startDate?: string, endDate?: string): Promise<ApiResponse<GetBookedSessionsResponse>> => {
        try {
            // Use provided dates or default to current month +/- 1 month
            const now = new Date();
            const defaultStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);

            const request: GetBookedSessionsRequest = {
                tutorId,
                startDate: startDate || defaultStartDate.toISOString().split('T')[0],
                endDate: endDate || defaultEndDate.toISOString().split('T')[0]
            };

            const response = await apiService.get<GetBookedSessionsResponse>(
                `/v1/classes/sessions/tutors/${request.tutorId}?startDate=${request.startDate}&endDate=${request.endDate}`
            );
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data
            };
        } catch (error) {
            console.warn("Failed to fetch tutor sessions:", error);
            throw error;
        }
    },

    getStudentSessions: async (studentId: string, startDate?: string, endDate?: string): Promise<ApiResponse<GetBookedSessionsResponse>> => {
        try {
            // Use provided dates or default to current month +/- 1 month
            const now = new Date();
            const defaultStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);

            const request: GetBookedSessionsRequest = {
                tutorId: studentId, // Reuse the same interface, but use studentId as tutorId field
                startDate: startDate || defaultStartDate.toISOString().split('T')[0],
                endDate: endDate || defaultEndDate.toISOString().split('T')[0]
            };

            const response = await apiService.get<GetBookedSessionsResponse>(
                `/v1/classes/sessions/students/${studentId}?startDate=${request.startDate}&endDate=${request.endDate}`
            );
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data
            };
        } catch (error) {
            console.warn("Failed to fetch student sessions:", error);
            throw error;
        }
    },

    // Check conflicts for selected time slots
    checkSlotConflicts: async (tutorId: string, slotDateTimes: string[]): Promise<ApiResponse<Session[]>> => {
        try {
            return await apiService.post<GetBookedSessionsResponse>(
                `/v1/classes/sessions/check-slot-conflicts`,
                {
                    tutorId,
                    slotDateTimes
                }
            );
        } catch (error: any) {
            console.error("Failed to check slot conflicts:", error);
            throw error;
        }
    },

    // Get group classes for a specific tutor
    getGroupClassesForTutor: async (tutorId: string): Promise<ApiResponse<GroupClass[]>> => {
        try {
            return await apiService.get<GroupClass[]>(`/tutors/${tutorId}/group-classes`);
        } catch (error: any) {
            console.error("Failed to fetch group classes for tutor:", error);
            throw error;
        }
    },
};
