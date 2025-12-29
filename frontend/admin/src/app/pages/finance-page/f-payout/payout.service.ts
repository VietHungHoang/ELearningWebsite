import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { InstructorPayout, PayoutHistory } from './f-payout.component';

export interface PayoutSummary {
    totalPending: number;
    totalInstructors: number;
    totalOrders: number;
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
     * Query Params: summaryFilter (for KPI cards: 'all' | 'today' | '7days' | '30days' | 'thisMonth')
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
            } else if (summaryFilter === 'thisMonth') {
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
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
            totalInstructors: filteredPendingPayouts.length,
            totalOrders: filteredPendingPayouts.reduce((sum, p) => sum + p.orderCount, 0)
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
                totalOwed: 1368000,
                baseAmount: 1200000,
                platformFee: 120000,
                tax: 48000,
                totalAmount: 1368000,
                orderCount: 3,
                orders: mockOrders.slice(0, 3),
                createdDate: new Date(2025, 10, 5).toISOString(),
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
                totalOwed: 1024000,
                baseAmount: 900000,
                platformFee: 90000,
                tax: 34000,
                totalAmount: 1024000,
                orderCount: 2,
                orders: mockOrders.slice(3, 5),
                createdDate: new Date(2025, 10, 2).toISOString(),
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
                totalOwed: 2456000,
                baseAmount: 2200000,
                platformFee: 220000,
                tax: 36000,
                totalAmount: 2456000,
                orderCount: 5,
                orders: mockOrders.slice(5, 10),
                createdDate: new Date(2025, 10, 4).toISOString(),
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
                totalOwed: 1892000,
                baseAmount: 1700000,
                platformFee: 170000,
                tax: 22000,
                totalAmount: 1892000,
                orderCount: 4,
                orders: mockOrders.slice(10, 14),
                createdDate: new Date(2025, 10, 3).toISOString(),
                status: 'pending'
            },
            {
                id: 'payout-5',
                instructorId: 'ins5',
                instructorName: 'Phạm Văn Đức',
                bankAccount: '9988776655',
                bankName: 'ACB',
                accountHolderName: 'PHẠM VĂN ĐỨC',
                paymentMethod: 'momo',
                totalOwed: 3128000,
                baseAmount: 2800000,
                platformFee: 280000,
                tax: 48000,
                totalAmount: 3128000,
                orderCount: 6,
                orders: mockOrders.slice(14, 20),
                createdDate: new Date(2025, 10, 1).toISOString(),
                status: 'pending'
            },
            {
                id: 'payout-6',
                instructorId: 'ins6',
                instructorName: 'Võ Thị Lan',
                bankAccount: '4433221100',
                bankName: 'Sacombank',
                accountHolderName: 'VÕ THỊ LAN',
                paymentMethod: 'sepay',
                totalOwed: 1564000,
                baseAmount: 1400000,
                platformFee: 140000,
                tax: 24000,
                totalAmount: 1564000,
                orderCount: 3,
                orders: mockOrders.slice(20, 23),
                createdDate: new Date(2025, 10, 6).toISOString(),
                status: 'pending'
            }
        ];

        // Mock payout history
        this.mockPayoutHistory = [
            {
                id: 'payout-hist-1',
                batchNumber: 'PAYOUT-2025-10',
                instructorId: 'ins3',
                instructorName: 'Trần Quốc Bảo',
                paymentMethod: 'vnpay',
                paidAmount: 5000000,
                paidDate: new Date(2025, 9, 1).toISOString(),
                approvedBy: 'Admin - Ngô Thanh',
                notes: 'Thanh toán hàng tháng - Tháng 9/2025',
                orderCount: 12,
                status: 'complete'
            },
            {
                id: 'payout-hist-2',
                batchNumber: 'PAYOUT-2025-09',
                instructorId: 'ins4',
                instructorName: 'Ngô Thanh Tâm',
                paymentMethod: 'momo',
                paidAmount: 4500000,
                paidDate: new Date(2025, 8, 1).toISOString(),
                approvedBy: 'Admin - Ngô Thanh',
                notes: 'Thanh toán hàng tháng - Tháng 8/2025',
                orderCount: 10,
                status: 'complete'
            },
            {
                id: 'payout-hist-3',
                batchNumber: 'PAYOUT-2025-08',
                instructorId: 'ins5',
                instructorName: 'Vũ Hà Linh',
                paymentMethod: 'sepay',
                paidAmount: 3800000,
                paidDate: new Date(2025, 7, 1).toISOString(),
                approvedBy: 'Admin - Vũ Hà',
                notes: 'Thanh toán hàng tháng - Tháng 7/2025',
                orderCount: 8,
                status: 'complete'
            }
        ];
    }
}

