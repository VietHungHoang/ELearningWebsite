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
 *   - timeFilter (day|week|month) - Time filter for Top Tutors chart
 */
export interface RevenueDashboardData {
    /** KPI data for the selected date range */
    kpis: {
        totalRevenue: number;              // Tổng doanh thu từ tất cả giao dịch
        platformFeeEarned: number;         // Phí nền tảng thu được (30% của revenue)
        tutorPayouts: number;         // Tổng tiền trả cho giảng viên
        successRate: number;               // % tỷ lệ thành công (completed / total * 100)
        totalTransactions: number;         // Tổng số giao dịch
        averageOrderValue: number;         // Giá trị trung bình mỗi đơn (Revenue / Transactions)

        // Trend data (% so sánh với kỳ trước)
        revenueTrend: number;              // % thay đổi revenue
        platformFeeTrend: number;          // % thay đổi platform fee
        payoutTrend: number;               // % thay đổi payout
        successRateTrend: number;          // % thay đổi success rate
        transactionsTrend: number;         // % thay đổi transactions
        aovTrend: number;                  // % thay đổi AOV
    };
    /** Revenue trend chart data */
    revenueTrend: {
        Weekly: {
            series: Array<{ name: string; data: number[] }>;
            categories: string[];
        };
        Monthly: {
            series: Array<{ name: string; data: number[] }>;
            categories: string[];
        };
        Yearly: {
            series: Array<{ name: string; data: number[] }>;
            categories: string[];
        };
    };
    /** Payment method distribution */
    paymentMethods: {
        series: number[];
        labels: string[];
    };
    /** Top tutors data */
    topTutors: {
        week: Array<{
            tutorId: string;
            tutorName: string;
            totalSessions: number;
            totalEarnings: number;
            avgEarningsPerSession: number;
        }>;
        month: Array<{
            tutorId: string;
            tutorName: string;
            totalSessions: number;
            totalEarnings: number;
            avgEarningsPerSession: number;
        }>;
        year: Array<{
            tutorId: string;
            tutorName: string;
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
    constructor(private apiService: ApiService) { }

    /**
     * Get revenue dashboard data
     * @param dateRange Date range filter: today, 7days, 30days (for KPI cards)
     * @param timeframe Timeframe: Weekly, Monthly, Yearly (for Revenue Trend chart)
     * @param timeFilter Time filter: week, month, year (for Top Tutors chart)
     * @param languageCode Language code: en, vi
     * @returns Observable of RevenueDashboardData
     */
    getRevenueDashboardData(
        dateRange: string = '30days',
        timeframe: string = 'Weekly',
        timeFilter: string = 'month',
        languageCode: string = 'vi'
    ): Observable<RevenueDashboardData> {
        const queryParams = { dateRange, timeframe, timeFilter, languageCode };

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
    private getMockData(dateRange: string, timeframe: string = 'Weekly', timeFilter: string = 'month'): RevenueDashboardData {
        const kpisData: { [key: string]: any } = {
            today: {
                totalRevenue: 15000000,           // 15M VND
                platformFeeEarned: 4500000,       // 30% of revenue
                tutorPayouts: 10500000,      // 70% of revenue
                successRate: 87.5,                // 7/8 = 87.5%
                totalTransactions: 8,
                averageOrderValue: 1875000,       // 15M / 8 = 1.875M
                revenueTrend: 12.5,
                platformFeeTrend: 12.5,
                payoutTrend: 12.5,
                successRateTrend: 2.8,
                transactionsTrend: 14.3,
                aovTrend: -1.5
            },
            '7days': {
                totalRevenue: 85000000,           // 85M VND
                platformFeeEarned: 25500000,      // 30% of revenue
                tutorPayouts: 59500000,      // 70% of revenue
                successRate: 85.7,                // 36/42 = 85.7%
                totalTransactions: 42,
                averageOrderValue: 2023810,       // 85M / 42
                revenueTrend: 8.7,
                platformFeeTrend: 8.7,
                payoutTrend: 8.7,
                successRateTrend: 1.5,
                transactionsTrend: 9.1,
                aovTrend: -0.4
            },
            '30days': {
                totalRevenue: 280000000,          // 280M VND
                platformFeeEarned: 84000000,      // 30% of revenue
                tutorPayouts: 196000000,     // 70% of revenue
                successRate: 84.5,                // 142/168 = 84.5%
                totalTransactions: 168,
                averageOrderValue: 1666667,       // 280M / 168
                revenueTrend: 15.8,
                platformFeeTrend: 15.8,
                payoutTrend: 12.0,
                successRateTrend: -1.2,
                transactionsTrend: 18.3,
                aovTrend: -2.1
            }
        };

        const baseTopTutors = [
            {
                tutorId: 'tutor1',
                tutorName: 'Đặng Minh Tuấn',
                totalSessions: 24,
                totalEarnings: 456,
                avgEarningsPerSession: 19
            },
            {
                tutorId: 'tutor2',
                tutorName: 'Nguyễn Thị Hương',
                totalSessions: 18,
                totalEarnings: 342,
                avgEarningsPerSession: 19
            },
            {
                tutorId: 'tutor3',
                tutorName: 'Trần Quốc Bảo',
                totalSessions: 16,
                totalEarnings: 288,
                avgEarningsPerSession: 18
            },
            {
                tutorId: 'tutor4',
                tutorName: 'Lý Công Đức',
                totalSessions: 14,
                totalEarnings: 245,
                avgEarningsPerSession: 17.5
            },
            {
                tutorId: 'tutor5',
                tutorName: 'Vũ Hà Phương',
                totalSessions: 12,
                totalEarnings: 198,
                avgEarningsPerSession: 16.5
            }
        ];

        // Get revenue trend data based on timeframe
        const revenueTrendData = {
            Weekly: {
                series: [
                    {
                        name: 'Revenue',
                        data: [12500000, 15000000, 11000000, 14500000, 18000000, 9500000, 13000000]
                    }
                ],
                categories: ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN']
            },
            Monthly: {
                series: [
                    {
                        name: 'Revenue',
                        data: [65000000, 72000000, 68000000, 75000000]
                    }
                ],
                categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4']
            },
            Yearly: {
                series: [
                    {
                        name: 'Revenue',
                        data: [750000000, 820000000, 780000000, 910000000, 860000000, 950000000, 880000000, 920000000, 990000000, 1050000000, 1100000000, 1200000000]
                    }
                ],
                categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
            }
        };

        // Get top tutors data based on timeFilter
        const topTutorsData = {
            week: baseTopTutors.map(tutor => ({
                ...tutor,
                totalSessions: Math.ceil(tutor.totalSessions * 0.35),
                totalEarnings: Math.round(tutor.totalEarnings * 0.35 * 10) / 10,
                avgEarningsPerSession: Math.round(tutor.avgEarningsPerSession * 10) / 10
            })),
            month: baseTopTutors,
            year: baseTopTutors.map(tutor => ({
                ...tutor,
                totalSessions: tutor.totalSessions * 12,
                totalEarnings: tutor.totalEarnings * 12,
                avgEarningsPerSession: tutor.avgEarningsPerSession
            }))
        };

        return {
            kpis: kpisData[dateRange] || kpisData['30days'],
            revenueTrend: revenueTrendData,
            paymentMethods: {
                series: [45, 35, 20],
                labels: ['VNPay', 'Momo', 'SePay']
            },
            topTutors: topTutorsData
        };
    }
}

