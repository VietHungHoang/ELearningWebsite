import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';

/**
 * Revenue Dashboard Data Interface
 * API Endpoint: GET /api/v1/admin/revenue-dashboard
 * Query Params:
 *   - dateRange (today|7days|30days) - Date range filter for KPI cards
 *   - timeframe (Daily|Weekly|Monthly) - Timeframe for Revenue Trend chart
 *   - timeFilter (day|week|month) - Time filter for Top Instructors chart
 */
export interface RevenueDashboardData {
    /** KPI data for the selected date range */
    kpis: {
        adminAccountIncome: number;        // Tiền vào từ transaction
        adminAccountPayout: number;          // Tiền ra cho giảng viên
        peakTransactionAmount: number;       // Lần thanh toán cao nhất
        payoutFixedDate: number;            // Ngày cố định hàng tháng (e.g., 1, 15, 25)
        totalTransactions: number;          // Tổng số giao dịch
        totalPayouts: number;                // Tổng số lần thanh toán cho giảng viên
        // Trend data (so sánh với period trước)
        incomeTrend: number;                 // % thay đổi income
        payoutTrend: number;                 // % thay đổi payout
        balanceTrend: number;               // % thay đổi balance
        peakTrend: number;                  // % thay đổi peak
        transactionsTrend: number;          // % thay đổi transactions
        payoutsTrend: number;               // % thay đổi payouts
    };
    /** Revenue trend chart data */
    revenueTrend: {
        Daily: {
            series: Array<{ name: string; data: number[] }>;
            categories: string[];
        };
        Weekly: {
            series: Array<{ name: string; data: number[] }>;
            categories: string[];
        };
        Monthly: {
            series: Array<{ name: string; data: number[] }>;
            categories: string[];
        };
    };
    /** Payment method distribution */
    paymentMethods: {
        series: number[];
        labels: string[];
    };
    /** Top instructors data */
    topInstructors: {
        day: Array<{
            instructorId: string;
            instructorName: string;
            totalSessions: number;
            totalEarnings: number;
            avgEarningsPerSession: number;
        }>;
        week: Array<{
            instructorId: string;
            instructorName: string;
            totalSessions: number;
            totalEarnings: number;
            avgEarningsPerSession: number;
        }>;
        month: Array<{
            instructorId: string;
            instructorName: string;
            totalSessions: number;
            totalEarnings: number;
            avgEarningsPerSession: number;
        }>;
    };
}

@Injectable({
    providedIn: 'root'
})
export class RevenueDashboardService {
    constructor(private apiService: ApiService) {}

    /**
     * Get revenue dashboard data
     * @param dateRange Date range filter: today, 7days, 30days (for KPI cards)
     * @param timeframe Timeframe: Daily, Weekly, Monthly (for Revenue Trend chart)
     * @param timeFilter Time filter: day, week, month (for Top Instructors chart)
     * @returns Observable of RevenueDashboardData
     */
    getRevenueDashboardData(
        dateRange: string = '30days',
        timeframe: string = 'Daily',
        timeFilter: string = 'month'
    ): Observable<RevenueDashboardData> {
        const queryParams = { dateRange, timeframe, timeFilter };
        
        return this.apiService.get<RevenueDashboardData>('/revenue-dashboard', queryParams).pipe(
            map(response => {
                if (response.success && response.data) {
                    return response.data;
                }
                // If API returns error response, use mock data
                console.warn('[RevenueDashboardService] API failed:', response.message);
                return this.getMockData(dateRange, timeframe, timeFilter);
            }),
            catchError(error => {
                // If API throws error, use mock data
                console.warn('[RevenueDashboardService] API error:', error);
                return of(this.getMockData(dateRange, timeframe, timeFilter));
            })
        );
    }

    /**
     * Get mock data for fallback
     */
    private getMockData(dateRange: string, timeframe: string = 'Daily', timeFilter: string = 'month'): RevenueDashboardData {
        const kpisData: { [key: string]: any } = {
            today: {
                adminAccountIncome: 15000000,
                adminAccountPayout: 0,
                peakTransactionAmount: 2000000,
                payoutFixedDate: 1,
                totalTransactions: 8,
                totalPayouts: 0,
                incomeTrend: 12.5,
                payoutTrend: 0,
                balanceTrend: 15.2,
                peakTrend: 8.3,
                transactionsTrend: 14.3,
                payoutsTrend: 0
            },
            '7days': {
                adminAccountIncome: 85000000,
                adminAccountPayout: 0,
                peakTransactionAmount: 3500000,
                payoutFixedDate: 1,
                totalTransactions: 42,
                totalPayouts: 0,
                incomeTrend: 8.7,
                payoutTrend: 0,
                balanceTrend: 10.5,
                peakTrend: 5.2,
                transactionsTrend: 9.1,
                payoutsTrend: 0
            },
            '30days': {
                adminAccountIncome: 280000000,
                adminAccountPayout: 224000000,
                peakTransactionAmount: 5000000,
                payoutFixedDate: 1,
                totalTransactions: 168,
                totalPayouts: 1,
                incomeTrend: 15.8,
                payoutTrend: 12.0,
                balanceTrend: 22.5,
                peakTrend: 4.2,
                transactionsTrend: 18.3,
                payoutsTrend: 0
            }
        };

        const baseTopInstructors = [
            {
                instructorId: 'ins1',
                instructorName: 'Đặng Minh Tuấn',
                totalSessions: 24,
                totalEarnings: 456,
                avgEarningsPerSession: 19
            },
            {
                instructorId: 'ins2',
                instructorName: 'Nguyễn Thị Hương',
                totalSessions: 18,
                totalEarnings: 342,
                avgEarningsPerSession: 19
            },
            {
                instructorId: 'ins3',
                instructorName: 'Trần Quốc Bảo',
                totalSessions: 16,
                totalEarnings: 288,
                avgEarningsPerSession: 18
            },
            {
                instructorId: 'ins4',
                instructorName: 'Lý Công Đức',
                totalSessions: 14,
                totalEarnings: 245,
                avgEarningsPerSession: 17.5
            },
            {
                instructorId: 'ins5',
                instructorName: 'Vũ Hà Phương',
                totalSessions: 12,
                totalEarnings: 198,
                avgEarningsPerSession: 16.5
            }
        ];

        // Get revenue trend data based on timeframe
        const revenueTrendData = {
            Daily: {
                series: [
                    {
                        name: 'Revenue',
                        data: [2500000, 2800000, 2600000, 3100000, 3500000, 3200000, 3800000]
                    }
                ],
                categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            Weekly: {
                series: [
                    {
                        name: 'Revenue',
                        data: [18500000, 19200000, 17800000, 22100000]
                    }
                ],
                categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
            },
            Monthly: {
                series: [
                    {
                        name: 'Revenue',
                        data: [75000000, 82000000, 78000000, 91000000, 86000000, 95000000]
                    }
                ],
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            }
        };

        // Get top instructors data based on timeFilter
        const topInstructorsData = {
            day: baseTopInstructors.map(instructor => ({
                ...instructor,
                totalSessions: Math.ceil(instructor.totalSessions * 0.14),
                totalEarnings: Math.round(instructor.totalEarnings * 0.14 * 10) / 10,
                avgEarningsPerSession: Math.round(instructor.avgEarningsPerSession * 10) / 10
            })),
            week: baseTopInstructors.map(instructor => ({
                ...instructor,
                totalSessions: Math.ceil(instructor.totalSessions * 0.35),
                totalEarnings: Math.round(instructor.totalEarnings * 0.35 * 10) / 10,
                avgEarningsPerSession: Math.round(instructor.avgEarningsPerSession * 10) / 10
            })),
            month: baseTopInstructors
        };

        return {
            kpis: kpisData[dateRange] || kpisData['30days'],
            revenueTrend: revenueTrendData,
            paymentMethods: {
                series: [60, 40],
                labels: ['VNPay', 'Momo']
            },
            topInstructors: topInstructorsData
        };
    }
}

