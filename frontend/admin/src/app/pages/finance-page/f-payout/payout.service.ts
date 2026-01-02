import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { InstructorPayout, PayoutHistory } from './f-payout.component';

export interface PayoutSummary {
    totalPending: number;
    pendingAmount: number;
    totalInstructors: number;
}

export interface PayoutApiResponse {
    pendingPayouts: InstructorPayout[];
    payoutHistory: PayoutHistory[];
    summary: PayoutSummary;
}

@Injectable({
    providedIn: 'root'
})
export class PayoutService {
    private mockPendingPayouts: InstructorPayout[] = [];
    private mockPayoutHistory: PayoutHistory[] = [];

    constructor(private apiService: ApiService) {
        this.loadMockData();
    }

    /**
     * Get payout data from API
     * API Endpoint: GET /api/v1/admin/payout
     * Query Params: summaryFilter (for KPI cards: 'all' | 'today' | '7days' | '30days')
     * @returns Observable of PayoutApiResponse
     */
    getPayoutData(summaryFilter?: string): Observable<PayoutApiResponse> {
        const params: any = {};
        if (summaryFilter) {
            params.summaryFilter = summaryFilter;
        }

        return this.apiService.get<PayoutApiResponse>('/payout', params).pipe(
            map(response => {
                if (response.success && response.data) {
                    return response.data;
                }
                console.warn('[PayoutService] API failed, returning mock data:', response.message);
                return this.getMockData(summaryFilter);
            }),
            catchError(error => {
                console.error('[PayoutService] API error, returning mock data:', error);
                return of(this.getMockData(summaryFilter));
            })
        );
    }

    /**
     * Get mock data for fallback
     */
    private getMockData(summaryFilter?: string): PayoutApiResponse {
        // Filter mock data based on summaryFilter
        let filteredPendingPayouts = [...this.mockPendingPayouts];
        let filteredHistory = [...this.mockPayoutHistory];

        if (summaryFilter && summaryFilter !== 'all') {
            const today = new Date();
            let startDate: Date | null = null;
            let endDate: Date | null = null;

            if (summaryFilter === 'today') {
                startDate = new Date(today);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(today);
                endDate.setHours(23, 59, 59, 999);
            } else if (summaryFilter === '7days') {
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(today);
                endDate.setHours(23, 59, 59, 999);
            } else if (summaryFilter === '30days') {
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 30);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(today);
                endDate.setHours(23, 59, 59, 999);
            }

            if (startDate && endDate) {
                filteredPendingPayouts = this.mockPendingPayouts.filter(payout => {
                    const payoutDate = new Date(payout.createdDate);
                    return payoutDate >= startDate! && payoutDate <= endDate!;
                });

                filteredHistory = this.mockPayoutHistory.filter(history => {
                    const historyDate = new Date(history.paidDate);
                    return historyDate >= startDate! && historyDate <= endDate!;
                });
            }
        }

        const summary: PayoutSummary = {
            totalPending: filteredPendingPayouts.reduce((sum, p) => sum + p.totalOwed, 0),
            pendingAmount: filteredPendingPayouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.totalOwed, 0),
            totalInstructors: filteredPendingPayouts.length
        };

        return {
            pendingPayouts: filteredPendingPayouts,
            payoutHistory: filteredHistory,
            summary: summary
        };
    }

    /**
     * Load mock data
     */
    private loadMockData(): void {
        // Mock pending payouts
        const mockOrders: any[] = [];
        for (let i = 0; i < 25; i++) {
            mockOrders.push({
                orderId: crypto.randomUUID(),
                orderNumber: `ORD-2025-${String(i + 1).padStart(5, '0')}`,
                learnerName: `Học viên ${i + 1}`,
                sessionName: 'English Conversation',
                sessionType: i % 2 === 0 ? '1 and 1' : '1 and n',
                hourlyRate: 15 + (i % 5) * 2,
                hours: Math.floor(Math.random() * 5) + 1,
                amount: (15 + (i % 5) * 2) * (Math.floor(Math.random() * 5) + 1) * (i % 2 === 0 ? 1 : 0.8),
                date: new Date(2025, 10, Math.floor(Math.random() * 30) + 1).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
            });
        }

        this.mockPendingPayouts = [
            {
                id: 'payout-1',
                instructorId: 'ins1',
                instructorName: 'Đặng Minh Tuấn',
                bankAccount: '0123456789',
                bankName: 'Vietcombank',
                accountHolderName: 'ĐẶNG MINH TUẤN',
                paymentMethod: 'vnpay',
                totalOwed: 5250000,
                baseAmount: 7500000,
                platformFee: 2250000,
                tax: 0,
                totalAmount: 5250000,
                orderCount: 8,
                orders: mockOrders.slice(0, 8),
                createdDate: new Date(2025, 11, 20).toISOString(), // Dec 20, 2025 - trong chu kỳ hiện tại
                status: 'pending'
            },
            {
                id: 'payout-2',
                instructorId: 'ins2',
                instructorName: 'Nguyễn Thị Hương',
                bankAccount: '9876543210',
                bankName: 'Techcombank',
                accountHolderName: 'NGUYỄN THỊ HƯƠNG',
                paymentMethod: 'momo',
                totalOwed: 3850000,
                baseAmount: 5500000,
                platformFee: 1650000,
                tax: 0,
                totalAmount: 3850000,
                orderCount: 5,
                orders: mockOrders.slice(8, 13),
                createdDate: new Date(2025, 11, 25).toISOString(), // Dec 25, 2025 - trong chu kỳ hiện tại
                status: 'pending'
            },
            {
                id: 'payout-3',
                instructorId: 'ins3',
                instructorName: 'Trần Quốc Bảo',
                bankAccount: '1122334455',
                bankName: 'BIDV',
                accountHolderName: 'TRẦN QUỐC BẢO',
                paymentMethod: 'sepay',
                totalOwed: 4200000,
                baseAmount: 6000000,
                platformFee: 1800000,
                tax: 0,
                totalAmount: 4200000,
                orderCount: 6,
                orders: mockOrders.slice(13, 19),
                createdDate: new Date(2026, 0, 5).toISOString(), // Jan 5, 2026 - trong chu kỳ hiện tại
                status: 'pending'
            },
            {
                id: 'payout-4',
                instructorId: 'ins4',
                instructorName: 'Lê Thị Mai',
                bankAccount: '5566778899',
                bankName: 'Vietinbank',
                accountHolderName: 'LÊ THỊ MAI',
                paymentMethod: 'vnpay',
                totalOwed: 2800000,
                baseAmount: 4000000,
                platformFee: 1200000,
                tax: 0,
                totalAmount: 2800000,
                orderCount: 4,
                orders: mockOrders.slice(19, 23),
                createdDate: new Date(2026, 0, 10).toISOString(), // Jan 10, 2026 - trong chu kỳ hiện tại
                status: 'pending'
            }
        ];

        // Mock payout history
        this.mockPayoutHistory = [
            {
                id: 'payout-hist-1',
                batchNumber: 'PAYOUT-2025-12',
                instructorId: 'ins5',
                instructorName: 'Phạm Văn Đức',
                paymentMethod: 'vnpay',
                paidAmount: 8500000,
                paidDate: new Date(2025, 11, 20).toISOString(), // Dec 20, 2025
                approvedBy: 'Admin - Ngô Thanh',
                notes: 'Thanh toán chu kỳ 16/11 - 15/12/2025',
                orderCount: 15,
                status: 'complete'
            },
            {
                id: 'payout-hist-2',
                batchNumber: 'PAYOUT-2025-11',
                instructorId: 'ins6',
                instructorName: 'Võ Thị Lan',
                paymentMethod: 'momo',
                paidAmount: 6200000,
                paidDate: new Date(2025, 10, 20).toISOString(), // Nov 20, 2025
                approvedBy: 'Admin - Vũ Hà',
                notes: 'Thanh toán chu kỳ 16/10 - 15/11/2025',
                orderCount: 12,
                status: 'complete'
            }
        ];
    }
}

