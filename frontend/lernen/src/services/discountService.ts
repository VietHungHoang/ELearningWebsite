import apiService from './apiService';
import axiosInstance from '../lib/axiosInstance';

// Types matching backend DTOs
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type DiscountApplyTo = 'ENROLLMENT' | 'SESSION' | 'BOTH';

export interface Discount {
    id: string;
    code: string;
    type: DiscountType;
    discountValue: number;
    maxDiscount?: number;
    maxUses?: number;
    maxUsesPerUser: number;
    currentUses: number;
    minOrderValue: number;
    applyTo: DiscountApplyTo;
    startDate: string;
    endDate: string;
    description?: string;
    isActive: boolean;
    applicableClasses?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateDiscountRequest {
    code: string;
    type: DiscountType;
    discountValue: number;
    maxDiscount?: number;
    maxUses?: number;
    maxUsesPerUser?: number;
    minOrderValue?: number;
    applyTo: DiscountApplyTo;
    startDate: string;
    endDate: string;
    description?: string;
    applicableClasses?: string[];
}

export interface UpdateDiscountRequest {
    code?: string;
    type?: DiscountType;
    discountValue?: number;
    maxDiscount?: number;
    maxUses?: number;
    maxUsesPerUser?: number;
    minOrderValue?: number;
    applyTo?: DiscountApplyTo;
    startDate?: string;
    endDate?: string;
    description?: string;
    isActive?: boolean;
    applicableClasses?: string[];
}

export interface ValidateDiscountRequest {
    code: string;
    classId?: string;
    bookingType?: string;
    amount: number;
}

export interface ValidateDiscountResponse {
    valid: boolean;
    message: string;
    discountAmount?: number;
    finalAmount?: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    pageable?: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last?: boolean;
    first?: boolean;
    numberOfElements?: number;
    sort?: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    empty?: boolean;
}

const discountService = {
    // Tutor endpoints
    async getTutorDiscounts(page = 0, size = 10): Promise<PageResponse<Discount>> {
        // Use axiosInstance directly as backend returns PageResponse without ApiResponse wrapper
        const response = await axiosInstance.get<PageResponse<Discount>>(
            `/v1/tutor/discounts?page=${page}&size=${size}`
        );
        return response.data;
    },

    async createDiscount(data: CreateDiscountRequest): Promise<Discount> {
        const response = await apiService.post<Discount>('/v1/tutor/discounts', data);
        return response.data;
    },

    async updateDiscount(id: string, data: UpdateDiscountRequest): Promise<Discount> {
        const response = await apiService.put<Discount>(`/v1/tutor/discounts/${id}`, data);
        return response.data;
    },

    async toggleDiscount(id: string): Promise<void> {
        await apiService.patch(`/v1/tutor/discounts/${id}/toggle`);
    },

    async deleteDiscount(id: string): Promise<void> {
        await apiService.delete(`/v1/tutor/discounts/${id}`);
    },

    // Public endpoints
    async validateDiscount(data: ValidateDiscountRequest, tutorId?: string): Promise<ValidateDiscountResponse> {
        const params = tutorId ? `?tutorId=${tutorId}` : '';
        const response = await apiService.post<ValidateDiscountResponse>(
            `/v1/discounts/validate${params}`,
            data
        );
        return response.data;
    },
};

export default discountService;
