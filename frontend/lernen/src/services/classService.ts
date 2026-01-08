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
    RescheduleRequest,
} from "../types/api";
import type { ClassTable, GetBookedSessionsRequest, GetBookedSessionsResponse, Session, ClassSchedule } from "../types/class";
import type { GroupClass, GroupClassApiResponse } from "../types/tutor";

// Response for slot conflict check API
export interface SlotConflictResponse {
    tutorBusySlots: string[];    // Slots to HIDE (tutor already has sessions)
    studentBusySlots: string[];  // Slots to show with WARNING style (student has sessions with other tutors)
}

// ClassData interface for class detail page
export interface ClassData {
    id: string;
    classTitle: string | null;
    tutor?: {
        id: string;
        fullName: string;
        avatarUrl?: string;
    } | null;
    students: StudentInfo[];
    type: '1-on-1' | 'Group';
    status: 'Ongoing' | 'Opening' | 'Completed';
    schedules: { day: string; time: string }[];
    startDate: string;
    completedSessions: number;
    totalSessions: number;
    sessions?: {
        id: string;
        sessionNumber: number | null;
        title: string;
        startTime: string;
        endTime: string;
        meetingLink: string;
        status: string;
        participantsCount: number;
    }[];
    quizzes: { id: string; title: string; status: 'Completed' | 'Pending' }[];
    materials: { id: string; name: string; type: 'PDF' | 'Video' | 'ZIP'; date: string }[];
    subject?: string;
    category?: string;
    tuitionFee?: number;
    description?: string;
    maxStudents?: number;
}

export interface StudentInfo {
    id: string;
    name: string;
    avatar: string;
    email?: string;
}

// ClassDetailResponse matches BE ClassDetailResponse.java
export interface ClassDetailResponse {
    id: string;
    title: string;
    description: string;
    subjectId: string;
    type: string; // ONE_ON_ONE, GROUP
    status: string; // CREATED, DRAFT, OPENING, PUBLISHED, IN_PROGRESS, COMPLETED, CANCELLED
    maxStudents: number;
    pricePerHour: number;
    createdAt: string;

    // Tutor info
    tutor: {
        id: string;
        fullName: string;
        avatarUrl: string;
    };

    // Students
    students: {
        id: string;
        fullName: string;
        avatarUrl: string;
        enrollmentStatus: string;
    }[];

    // Schedules
    schedules: {
        dayOfWeek: number; // 1=Monday, 7=Sunday
        time: string; // HH:mm
        durationMinutes: number;
    }[];

    // Sessions
    sessions: {
        id: string;
        sessionNumber: number | null;
        title: string;
        startTime: string;
        endTime: string;
        meetingLink: string;
        status: string;
        participantsCount: number;
    }[];
    completedSessions: number;
    totalSessions: number;

    // Materials
    materials: {
        id: string;
        name: string;
        type: string;
        s3Url: string;
        uploadDate: string;
        fileSize: number;
        description: string;
    }[];

    // Announcements
    announcements: {
        id: string;
        title: string;
        content: string;
        date: string;
        author: string;
    }[];

    // Assignments
    assignments: {
        id: string;
        title: string;
        description: string;
        dueDate: string;
        submissionsCount: number;
    }[];

    // Stats
    stats: {
        totalStudents: number;
        activeStudents: number;
        completedSessions: number;
        totalSessions: number;
        completionRate: number;
    };
}

// Mock data for testing when API fails
const mockClassData: ClassTable[] = [
    {
        id: 'mock-1',
        title: 'Lập trình JavaScript Nâng Cao - Nhóm',
        students: [
            { id: 'student-1', fullName: 'Nguyễn Nam Sơn', avatarUrl: '' },
            { id: 'student-2', fullName: 'Trần Thị Mai', avatarUrl: '' },
            { id: 'student-3', fullName: 'Lê Minh Đức', avatarUrl: '' }
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
            { id: 'student-4', fullName: 'Phạm Thị Hương', avatarUrl: '' }
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

    createClass: async (classData: CreateClassRequest): Promise<ApiResponse<PaginatedResponse<ClassTable>>> => {
        try {
            const response = await apiService.post<PaginatedResponse<ClassTable>>("/v1/classes/tutors/me", classData);
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

    updateClass: async (classId: string, classData: Partial<CreateClassRequest>): Promise<ApiResponse<ClassTable>> => {
        try {
            const response = await apiService.put<ClassTable>(`/v1/classes/${classId}`, classData);
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error) {
            console.error("Failed to update class:", error);
            throw error;
        }
    },

    deleteClass: async (classId: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiService.delete<void>(`/v1/classes/${classId}`);
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: undefined,
            };
        } catch (error) {
            console.error("Failed to delete class:", error);
            throw error;
        }
    },

    getClassById: async (classId: string): Promise<ApiResponse<ClassDetailResponse>> => {
        try {
            const response = await apiService.get<ClassDetailResponse>(`/v1/classes/${classId}`);
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error) {
            console.error("Failed to get class detail:", error);
            throw error;
        }
    },

    getClassDetail: async (classId: string): Promise<ApiResponse<ClassDetailResponse>> => {
        try {
            const response = await apiService.get<ClassDetailResponse>(`/v1/classes/${classId}`);
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error) {
            console.error("Failed to get class detail:", error);
            throw error;
        }
    },

    requestTrialSession: async (request: TrialSessionRequest): Promise<ApiResponse<null>> => {
        return await apiService.post<null>("/v1/classes/trial-session", request);
    },

    // Get list of reschedule requests by user type (tutor or student)
    // userId is automatically added in axios interceptor
    getRescheduleRequestsByUser: async (
        userType: 'tutor' | 'student'
    ): Promise<ApiResponse<RescheduleRequest[]>> => {
        try {
            const response = await apiService.get<RescheduleRequest[]>(
                `/v1/classes/reschedule-requests/by-user`,
                {
                    userType
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

    // Accept reschedule request
    // userId is automatically added in axios interceptor
    acceptRescheduleRequest: async (requestId: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiService.put<void>(
                `/v1/classes/reschedule-requests/${requestId}/accept`
            );
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: undefined,
            };
        } catch (error: any) {
            console.error("Error accepting reschedule request:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to accept reschedule request",
                data: undefined,
            };
        }
    },

    // Reject reschedule request
    // userId is automatically added in axios interceptor
    rejectRescheduleRequest: async (requestId: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiService.delete<void>(
                `/v1/classes/reschedule-requests/${requestId}/reject`
            );
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: undefined,
            };
        } catch (error: any) {
            console.error("Error rejecting reschedule request:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to reject reschedule request",
                data: undefined,
            };
        }
    },

    acceptTrialRequest: async (requestId: string): Promise<ApiResponse<null>> => {
        try {
            const response = await apiService.post<null>(`/v1/classes/trial-session/${requestId}/accept`);
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

    rejectTrialRequest: async (requestId: string): Promise<ApiResponse<null>> => {
        try {
            const response = await apiService.post<null>(`/v1/classes/trial-session/${requestId}/reject`);
            return {
                status: response.status,
                success: true,
                message: "Trial session request rejected successfully",
                data: null,
            };
        } catch (error: any) {
            console.error("Error rejecting trial session request:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to reject trial session request",
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
            const response = await apiService.post<{ message: string }>(`/v1/tutors/zoom/oauth/callback`, {
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
                    userType: role,
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

        const url = `/v1/payments/me/history${queryParams.toString() ? `?${queryParams.toString()}` : ""
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

        const url = `/v1/tutors/me/earnings${queryParams.toString() ? `?${queryParams.toString()}` : ""
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

    // Get class details for detail page
    getClassDetailForPage: async (classId: string): Promise<ClassData> => {
        try {
            // Call API to get class detail
            const url = `/v1/classes/${classId}`;
            const response = await apiService.get<any>(url);

            if (response.data) {
                const data = response.data;

                // Helper function to convert day of week number to name
                // Backend returns dayOfWeek: 1-7 (ISO format: 1=Monday, 7=Sunday)
                // Our array uses: 0=Sunday, 1=Monday, ..., 6=Saturday
                const getDayName = (dayOfWeek: number, isVietnamese: boolean = false): string => {
                    // Convert ISO format (1-7) to array index (0-6)
                    // 1=Monday -> index 1, 2=Tuesday -> index 2, ..., 7=Sunday -> index 0
                    let normalizedDay = dayOfWeek;
                    if (dayOfWeek === 7) {
                        normalizedDay = 0; // Sunday
                    } else if (dayOfWeek >= 1 && dayOfWeek <= 6) {
                        normalizedDay = dayOfWeek; // Monday to Saturday (1-6)
                    } else if (dayOfWeek === 0) {
                        normalizedDay = 0; // Sunday (if backend uses 0-6 format)
                    }

                    if (isVietnamese) {
                        const vietnameseDays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                        return vietnameseDays[normalizedDay] || 'Unknown';
                    } else {
                        const englishDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        return englishDays[normalizedDay] || 'Unknown';
                    }
                };

                // Get subject and category names from subjectId
                let subjectName = '';
                let categoryName = '';

                if (data.subjectId) {
                    try {
                        // Import commonUtils dynamically to avoid circular dependency
                        const commonUtils = await import('../utils/commonUtils');
                        const subjects = await commonUtils.default.getSubjects();
                        const categories = await commonUtils.default.getCategories();

                        const subject = subjects.find(s => s.id === data.subjectId);
                        if (subject) {
                            // For now, use English name. Can be made dynamic based on i18n later
                            subjectName = subject.nameEn || subject.nameVi || '';

                            // Get category from subject
                            const category = categories.find(c => c.id === subject.categoryId);
                            if (category) {
                                categoryName = category.nameEn || category.nameVi || '';
                            }
                        }
                    } catch (error) {
                        console.warn('Failed to fetch subject/category details:', error);
                    }
                }

                // Map response to ClassData format
                return {
                    id: data.id || classId,
                    classTitle: data.title || '',
                    students: (data.students || []).map((student: any) => ({
                        id: student.id,
                        name: student.fullName || student.name || '',
                        avatar: student.avatarUrl || student.avatar || `https://picsum.photos/seed/${student.id}/48/48`,
                        email: student.email
                    })),
                    type: data.type === 'ONE_ON_ONE' ? '1-on-1' : 'Group',
                    status: data.status === 'ONGOING' ? 'Ongoing' :
                        data.status === 'COMPLETED' ? 'Completed' :
                            data.status === 'CANCELLED' ? 'Completed' : 'Opening',
                    schedules: (data.schedules || []).map((schedule: any) => {
                        // Backend returns dayOfWeek as number (0-6 or 1-7)
                        // dayOfWeek: 0=Sunday, 1=Monday, ..., 6=Saturday
                        // If backend returns 1-7, we need to convert: 1=Monday (index 1), 7=Sunday (index 0)
                        if (typeof schedule.dayOfWeek === 'number') {
                            // Handle both 0-6 and 1-7 formats
                            let dayIndex = schedule.dayOfWeek;
                            if (dayIndex === 7) {
                                dayIndex = 0; // Sunday
                            } else if (dayIndex > 0 && dayIndex < 7) {
                                // If it's 1-6, keep as is (1=Monday, 6=Saturday)
                                dayIndex = dayIndex;
                            }
                            return {
                                day: getDayName(dayIndex, false), // Can be made dynamic based on i18n
                                time: schedule.time || ''
                            };
                        }
                        return {
                            day: schedule.day || '',
                            time: schedule.time || ''
                        };
                    }),
                    startDate: data.createdAt ? data.createdAt.split('T')[0] : (data.startDate || ''),
                    completedSessions: data.completedSessions ?? data.stats?.completedSessions ?? 0,
                    totalSessions: data.totalSessions ?? data.stats?.totalSessions ?? 0,
                    subject: subjectName || data.subject?.name || data.subjectName || data.subject || '',
                    category: categoryName || data.category?.name || data.categoryName || data.category || '',
                    tuitionFee: data.pricePerHour ?? data.tuitionFee ?? data.price ?? 0,
                    description: data.description || '',
                    maxStudents: data.maxStudents ?? (data.students?.length || 0),
                    quizzes: data.quizzes || [],
                    materials: data.materials || []
                };
            }

            throw new Error('No data in response');
        } catch (error) {
            console.error('Failed to fetch class details:', error);
            throw error;
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

    // Start session for student (marks attendance)
    startSession: async (sessionId: string, studentId: string): Promise<ApiResponse<{ status: string; message: string }>> => {
        try {
            return await apiService.post<{ status: string; message: string }>(`/v1/classes/sessions/${sessionId}/join`, { studentId });
        } catch (error) {
            console.error('Error starting session:', error);
            throw error;
        }
    },

    // Start session for tutor (marks session as started/BOOKED)
    startSessionByTutor: async (sessionId: string): Promise<ApiResponse<void>> => {
        try {
            return await apiService.post<void>(`/v1/classes/sessions/${sessionId}/start`, {});
        } catch (error) {
            console.error('Error starting session by tutor:', error);
            throw error;
        }
    },

    // Check conflicts for selected time slots
    // Returns both tutor busy slots (to hide) and student busy slots (to show with warning)
    checkSlotConflicts: async (tutorId: string, startDate: string, endDate: string): Promise<ApiResponse<SlotConflictResponse>> => {
        try {
            return await apiService.post<SlotConflictResponse>(
                `/v1/classes/sessions/check-slot-conflicts`,
                {
                    tutorId,
                    startDate: startDate.replace('Z', ''),
                    endDate: endDate.replace('Z', '')
                }
            );
        } catch (error: any) {
            console.error("Failed to check slot conflicts:", error);
            throw error;
        }
    },

    // Helper function to convert 24h time format to 12h format
    convertTimeTo12Hour: (time24: string): string => {
        // Handle format like "15:00:00" or "15:00"
        const timeStr = time24.split(':').slice(0, 2).join(':');
        const [hours, minutes] = timeStr.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    },

    // Helper function to map API response to GroupClass format
    mapGroupClassApiResponse: (apiData: GroupClassApiResponse): GroupClass => {
        return {
            id: apiData.id,
            title: apiData.title,
            classDescription: apiData.description,
            maxStudents: apiData.maxStudents,
            enrolledStudents: apiData.enrolledStudents, // Map enrolled students count
            students: [], // API doesn't provide student list, only enrolledStudents count
            schedule: apiData.schedules.map(schedule => ({
                dayOfWeek: schedule.dayOfWeek,
                time: classService.convertTimeTo12Hour(schedule.time)
            })),
            pricePerHour: apiData.pricePerHour,
            // startDate is not provided in API response
        };
    },

    // Get group classes for a specific tutor
    getGroupClassesForTutor: async (tutorId: string): Promise<ApiResponse<GroupClass[]>> => {
        try {
            const response = await apiService.get<GroupClassApiResponse[] | { content: GroupClassApiResponse[] }>(`/v1/classes/tutors/${tutorId}/opening`);

            // Handle both response formats: direct array or { content: [...] }
            let apiData: GroupClassApiResponse[] = [];
            if (Array.isArray(response.data)) {
                // Direct array format
                apiData = response.data;
            } else if (response.data?.content && Array.isArray(response.data.content)) {
                // Wrapped in content object
                apiData = response.data.content;
            }

            console.log('Group classes API response:', response);
            console.log('Parsed API data:', apiData);

            // Map API response to GroupClass format
            const mappedData: GroupClass[] = apiData.map(item =>
                classService.mapGroupClassApiResponse(item)
            );

            console.log('Mapped group classes:', mappedData);

            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: mappedData
            };
        } catch (error: any) {
            console.error("Failed to fetch group classes from API:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to fetch group classes",
                data: []
            };
        }
    },

    // Add student to group class
    addStudentToClass: async (classId: string, studentId: string): Promise<ApiResponse<void>> => {
        try {
            return await apiService.post<void>(`/v1/classes/${classId}/students/${studentId}`);
        } catch (error: any) {
            console.error("Failed to add student to class:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to add student to class",
                data: undefined
            };
        }
    },

    // Remove student from group class
    removeStudentFromClass: async (classId: string, studentId: string): Promise<ApiResponse<void>> => {
        try {
            return await apiService.delete<void>(`/v1/classes/${classId}/students/${studentId}`);
        } catch (error: any) {
            console.error("Failed to remove student from class:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to remove student from class",
                data: undefined
            };
        }
    },

    // Create reschedule request for a session
    createRescheduleRequest: async (
        sessionId: string,
        oldSchedule: string,
        newSchedule: string,
        reason: string
    ): Promise<ApiResponse<any>> => {
        try {
            // Convert newSchedule from local datetime to UTC ISO string
            // newSchedule is from datetime-local input (e.g., "2026-01-15T14:00")
            const newScheduleDate = new Date(newSchedule);
            const newScheduleISO = newScheduleDate.toISOString();

            // oldSchedule is UTC string from backend without timezone indicator (e.g., "2026-01-15T07:00:00")
            // Backend stores datetime in UTC but without 'Z' suffix
            // Need to parse it as UTC, not local time, to avoid double conversion
            const hasTimezone = oldSchedule.endsWith('Z') ||
                /[+-]\d{2}:\d{2}$/.test(oldSchedule) ||
                /[+-]\d{4}$/.test(oldSchedule);
            const oldScheduleUTCString = hasTimezone ? oldSchedule : `${oldSchedule}Z`;
            const oldScheduleDate = new Date(oldScheduleUTCString);
            const oldScheduleISO = oldScheduleDate.toISOString();

            // Call API with sessionId in path
            const response = await apiService.post<any>(
                `/v1/classes/sessions/${sessionId}/reschedule`,
                {
                    oldSchedule: oldScheduleISO,
                    newSchedule: newScheduleISO,
                    reason
                }
            );

            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data
            };
        } catch (error: any) {
            console.error("Failed to create reschedule request:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to create reschedule request";
            return {
                status: error.response?.status || 500,
                success: false,
                message: errorMessage,
                data: null
            };
        }
    },

    addMaterial: async (classId: string, materialData: any): Promise<ApiResponse<any>> => {
        try {
            const response = await apiService.post<any>(`/v1/classes/${classId}/materials`, materialData);
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data
            };
        } catch (error: any) {
            console.error("Failed to add material:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to add material",
                data: null
            };
        }
    },

    deleteMaterial: async (classId: string, materialId: string): Promise<ApiResponse<void>> => {
        try {
            const response = await apiService.delete<void>(`/v1/classes/${classId}/materials/${materialId}`);
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: undefined
            };
        } catch (error: any) {
            console.error("Failed to delete material:", error);
            return {
                status: error.response?.status || 500,
                success: false,
                message: error.response?.data?.message || "Failed to delete material",
                data: undefined
            };
        }
    },
};
