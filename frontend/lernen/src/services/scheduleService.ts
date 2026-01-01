import apiService from "./apiService";
import type { ApiResponse } from "../types/api";
import type {
    ScheduleViewMode,
    GetAvailabilityRequest,
    GetAvailabilityResponse,
    UpdateAvailabilityRequest,
} from "../types/tutor";

/**
 * Get current timezone offset in minutes
 * Returns negative value for timezones ahead of UTC (e.g., -420 for GMT+7)
 *
 * Examples:
 * - GMT+7 (Vietnam): -420
 * - GMT-5 (US Eastern): 300
 * - GMT+0 (UTC): 0
 */
export const getTimezoneOffset = (): number => {
    return new Date().getTimezoneOffset();
};

/**
 * Calculate date range for prefetching based on view mode
 *
 * Strategy:
 * - Daily view: Fetch 3 days before + current day + 3 days after = 7 days
 * - Weekly view: Fetch 1 week before + current week + 1 week after = 3 weeks
 * - Monthly view: Fetch current month + next month = 2 months
 */
export const calculatePrefetchRange = (
    currentDate: Date,
    viewMode: ScheduleViewMode
): { startDate: string; endDate: string } => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    switch (viewMode) {
        case "daily":
            // 3 days before, 3 days after
            start.setDate(start.getDate() - 3);
            end.setDate(end.getDate() + 3);
            break;

        case "weekly":
            // 1 week before, 1 week after (total 3 weeks)
            start.setDate(start.getDate() - 7);
            end.setDate(end.getDate() + 14);
            break;

        case "monthly":
            // Current month + next month
            start.setDate(1); // First day of current month
            end.setMonth(end.getMonth() + 2);
            end.setDate(0); // Last day of next month
            break;
    }

    return {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
    };
};

export const scheduleService = {
    getAvailability: async (request: GetAvailabilityRequest): Promise<ApiResponse<GetAvailabilityResponse>> => {
        try {
            const params = new URLSearchParams({
                startDate: request.startDate,
                endDate: request.endDate,
            });

            return await apiService.get<GetAvailabilityResponse>(
                `/v1/tutors/${request.tutorId}/availabilities?${params.toString()}`
            );
        } catch (error) {
            console.error("Failed to fetch availability from API:", error);
            throw error;
        }
    },

    updateAvailability: async (tutorId: string, request: UpdateAvailabilityRequest): Promise<ApiResponse<null>> => {
        return await apiService.put<null>(`/v1/tutors/${tutorId}/availabilities`, request);
    }
};

export default scheduleService;
