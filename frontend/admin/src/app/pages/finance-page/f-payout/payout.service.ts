import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { InstructorPayout, PayoutHistory } from './f-payout.component';

// LocalStorage key for payout history
const PAYOUT_HISTORY_STORAGE_KEY = 'elearning_payout_history';

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
    private storedPayoutHistory: PayoutHistory[] = [];

    constructor(private apiService: ApiService) {
        this.loadMockData();
        // Load payment history from localStorage
        this.storedPayoutHistory = this.loadPayoutHistoryFromLocalStorage();
        console.log('[PayoutService] Loaded payment history from localStorage:', this.storedPayoutHistory.length);
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

        // Merge localStorage history with mock history
        const mergedHistory = [...this.storedPayoutHistory, ...this.mockPayoutHistory];
        // Remove duplicates based on ID
        const uniqueHistory = mergedHistory.filter((item, index, self) =>
            index === self.findIndex(h => h.id === item.id)
        );
        // Sort by date descending (newest first)
        uniqueHistory.sort((a, b) => new Date(b.paidDate).getTime() - new Date(a.paidDate).getTime());

        const summary: PayoutSummary = {
            totalPending: filteredPendingPayouts.reduce((sum, p) => sum + p.totalOwed, 0),
            pendingAmount: filteredPendingPayouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.totalOwed, 0),
            totalInstructors: filteredPendingPayouts.length
        };

        return {
            pendingPayouts: filteredPendingPayouts,
            payoutHistory: uniqueHistory,
            summary: summary
        };
    }

    /**
     * Load mock data
     */
    private loadMockData(): void {
        // Mock pending payouts
        const mockOrders: any[] = [];
        for (let i = 0; i < 40; i++) {
            mockOrders.push({
                orderId: crypto.randomUUID(),
                orderNumber: `ORD-2025-${String(i + 1).padStart(5, '0')}`,
                learnerName: `học viên ${i + 1}`,
                sessionName: 'English Conversation',
                sessionType: i % 2 === 0 ? '1 and 1' : '1 and n',
                hourlyRate: 15 + (i % 5) * 2,
                hours: Math.floor(Math.random() * 5) + 1,
                amount: (15 + (i % 5) * 2) * (Math.floor(Math.random() * 5) + 1) * (i % 2 === 0 ? 1 : 0.8),
                date: new Date(2025, 10, Math.floor(Math.random() * 30) + 1).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
            });
        }

        // Helper function to scale order amounts to match target baseAmount
        const scaleOrderAmounts = (orders: any[], targetBaseAmount: number) => {
            const currentTotal = orders.reduce((sum, order) => sum + order.amount, 0);
            const scaleFactor = targetBaseAmount / currentTotal;
            return orders.map(order => ({
                ...order,
                amount: Math.round(order.amount * scaleFactor)
            }));
        };

        // Payout 1-10
        const payout1Orders = scaleOrderAmounts(mockOrders.slice(0, 8), 7500000);
        const payout2Orders = scaleOrderAmounts(mockOrders.slice(8, 13), 5500000);
        const payout3Orders = scaleOrderAmounts(mockOrders.slice(13, 19), 6000000);
        const payout4Orders = scaleOrderAmounts(mockOrders.slice(19, 23), 4000000);
        const payout5Orders = scaleOrderAmounts(mockOrders.slice(23, 28), 5800000);
        const payout6Orders = scaleOrderAmounts(mockOrders.slice(28, 32), 4500000);
        const payout7Orders = scaleOrderAmounts(mockOrders.slice(32, 35), 3200000);
        const payout8Orders = scaleOrderAmounts(mockOrders.slice(35, 38), 3800000);
        const payout9Orders = scaleOrderAmounts(mockOrders.slice(38, 40), 2500000);
        const payout10Orders = scaleOrderAmounts(mockOrders.slice(0, 4), 3000000);

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
                orders: payout1Orders,
                createdDate: new Date(2025, 11, 20).toISOString(),
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
                orders: payout2Orders,
                createdDate: new Date(2025, 11, 25).toISOString(),
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
                orders: payout3Orders,
                createdDate: new Date(2026, 0, 5).toISOString(),
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
                orders: payout4Orders,
                createdDate: new Date(2026, 0, 10).toISOString(),
                status: 'pending'
            },
            {
                id: 'payout-5',
                instructorId: 'ins5',
                instructorName: 'Hoàng Thị Lan',
                bankAccount: '2233445566',
                bankName: 'ACB Bank',
                accountHolderName: 'HOÀNG THỊ LAN',
                paymentMethod: 'vnpay',
                totalOwed: 4060000,
                baseAmount: 5800000,
                platformFee: 1740000,
                tax: 0,
                totalAmount: 4060000,
                orderCount: 5,
                orders: payout5Orders,
                createdDate: new Date(2026, 0, 8).toISOString(),
                status: 'pending'
            },
            {
                id: 'payout-6',
                instructorId: 'ins6',
                instructorName: 'Vũ Minh Anh',
                bankAccount: '3344556677',
                bankName: 'VPBank',
                accountHolderName: 'VŨ MINH ANH',
                paymentMethod: 'momo',
                totalOwed: 3150000,
                baseAmount: 4500000,
                platformFee: 1350000,
                tax: 0,
                totalAmount: 3150000,
                orderCount: 4,
                orders: payout6Orders,
                createdDate: new Date(2026, 0, 7).toISOString(),
                status: 'pending'
            },
            {
                id: 'payout-7',
                instructorId: 'ins7',
                instructorName: 'Phạm Văn Long',
                bankAccount: '4455667788',
                bankName: 'MB Bank',
                accountHolderName: 'PHẠM VĂN LONG',
                paymentMethod: 'sepay',
                totalOwed: 2240000,
                baseAmount: 3200000,
                platformFee: 960000,
                tax: 0,
                totalAmount: 2240000,
                orderCount: 3,
                orders: payout7Orders,
                createdDate: new Date(2026, 0, 6).toISOString(),
                status: 'pending'
            },
            {
                id: 'payout-8',
                instructorId: 'ins8',
                instructorName: 'Đỗ Thị Thu',
                bankAccount: '5566778800',
                bankName: 'Sacombank',
                accountHolderName: 'ĐỖ THỊ THU',
                paymentMethod: 'vnpay',
                totalOwed: 2660000,
                baseAmount: 3800000,
                platformFee: 1140000,
                tax: 0,
                totalAmount: 2660000,
                orderCount: 3,
                orders: payout8Orders,
                createdDate: new Date(2026, 0, 9).toISOString(),
                status: 'pending'
            },
            {
                id: 'payout-9',
                instructorId: 'ins9',
                instructorName: 'Lý Quốc Hưng',
                bankAccount: '6677889900',
                bankName: 'TPBank',
                accountHolderName: 'LÝ QUỐC HƯNG',
                paymentMethod: 'momo',
                totalOwed: 1750000,
                baseAmount: 2500000,
                platformFee: 750000,
                tax: 0,
                totalAmount: 1750000,
                orderCount: 2,
                orders: payout9Orders,
                createdDate: new Date(2026, 0, 11).toISOString(),
                status: 'pending'
            },
            {
                id: 'payout-10',
                instructorId: 'ins10',
                instructorName: 'Bùi Thị Ngọc',
                bankAccount: '7788990011',
                bankName: 'HDBank',
                accountHolderName: 'BÙI THỊ NGỌC',
                paymentMethod: 'vnpay',
                totalOwed: 2100000,
                baseAmount: 3000000,
                platformFee: 900000,
                tax: 0,
                totalAmount: 2100000,
                orderCount: 4,
                orders: payout10Orders,
                createdDate: new Date(2026, 0, 12).toISOString(),
                status: 'pending'
            }
        ];

        // Mock payout history
        this.mockPayoutHistory = [
            {
                id: 'payout-hist-1',
                batchNumber: 'PAYOUT-2025-12',
                instructorId: 'ins11',
                instructorName: 'Phạm Văn Đức',
                paymentMethod: 'vnpay',
                paidAmount: 8500000,
                paidDate: new Date(2025, 11, 20).toISOString(),
                approvedBy: 'Admin - Ngô Thanh',
                notes: 'Thanh toán chu kỳ 16/11 - 15/12/2025',
                orderCount: 15,
                status: 'complete'
            },
            {
                id: 'payout-hist-2',
                batchNumber: 'PAYOUT-2025-11',
                instructorId: 'ins12',
                instructorName: 'Võ Thị Lan',
                paymentMethod: 'momo',
                paidAmount: 6200000,
                paidDate: new Date(2025, 10, 20).toISOString(),
                approvedBy: 'Admin - Vũ Hà',
                notes: 'Thanh toán chu kỳ 16/10 - 15/11/2025',
                orderCount: 12,
                status: 'complete'
            }
        ];
    }

    /**
     * Save payout history to localStorage
     */
    savePayoutHistoryToLocalStorage(history: PayoutHistory[]): void {
        try {
            localStorage.setItem(PAYOUT_HISTORY_STORAGE_KEY, JSON.stringify(history));
            this.storedPayoutHistory = history;
            console.log('[PayoutService] Saved payout history to localStorage:', history.length);
        } catch (error) {
            console.error('[PayoutService] Error saving payout history to localStorage:', error);
        }
    }

    /**
     * Load payout history from localStorage
     */
    private loadPayoutHistoryFromLocalStorage(): PayoutHistory[] {
        try {
            const stored = localStorage.getItem(PAYOUT_HISTORY_STORAGE_KEY);
            if (stored) {
                const history = JSON.parse(stored) as PayoutHistory[];
                console.log('[PayoutService] Loaded payout history from localStorage:', history.length);
                return history;
            }
        } catch (error) {
            console.error('[PayoutService] Error loading payout history from localStorage:', error);
        }
        return [];
    }

    /**
     * Clear payout history from localStorage (for debugging)
     */
    clearPayoutHistoryLocalStorage(): void {
        localStorage.removeItem(PAYOUT_HISTORY_STORAGE_KEY);
        this.storedPayoutHistory = [];
        console.log('[PayoutService] Cleared payout history from localStorage');
    }
}
