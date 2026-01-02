import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { RevenueTrendComponent } from './revenue-trend/revenue-trend.component';
import { PaymentMethodChartComponent } from './payment-method-chart/payment-method-chart.component';
import { TopInstructorsChartComponent } from './top-instructors-chart/top-instructors-chart.component';
import { RevenueDashboardService, RevenueDashboardData } from './revenue-dashboard.service';

@Component({
    selector: 'app-f-revenue-dashboard',
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        TranslatePipe,
        CurrencyFormatPipe,
        RevenueTrendComponent,
        PaymentMethodChartComponent,
        TopInstructorsChartComponent
    ],
    templateUrl: './f-revenue-dashboard.component.html',
    styleUrl: './f-revenue-dashboard.component.scss'
})
export class FRevenueDashboardComponent implements OnInit {
    selectedDateRange: string = '30days';
    selectedTimeframe: string = 'Daily';  // For Revenue Trend chart
    selectedTimeFilter: 'day' | 'week' | 'month' = 'month';  // For Top Instructors chart
    isDateRangeDropdownOpen: boolean = false;

    kpis = {
        // Main Metrics
        totalRevenue: 0,              // Tổng doanh thu từ tất cả giao dịch
        platformFeeEarned: 0,         // Phí nền tảng thu được (15% của revenue)
        instructorPayouts: 0,         // Tổng tiền trả cho giảng viên
        successRate: 0,               // % tỷ lệ thành công (completed / total * 100)
        totalTransactions: 0,         // Tổng số giao dịch
        averageOrderValue: 0,         // Giá trị trung bình mỗi đơn (Revenue / Transactions)

        // Trend data (% so sánh với kỳ trước)
        revenueTrend: 0,              // % thay đổi revenue
        platformFeeTrend: 0,          // % thay đổi platform fee
        payoutTrend: 0,               // % thay đổi payout
        successRateTrend: 0,          // % thay đổi success rate
        transactionsTrend: 0,         // % thay đổi transactions
        aovTrend: 0                   // % thay đổi AOV
    };

    dashboardData: RevenueDashboardData | null = null;

    constructor(private revenueDashboardService: RevenueDashboardService) {}

    ngOnInit(): void {
        this.loadDashboardData();
    }

    toggleDateRangeDropdown(): void {
        this.isDateRangeDropdownOpen = !this.isDateRangeDropdownOpen;
    }

    setDateRange(range: string): void {
        this.selectedDateRange = range;
        this.isDateRangeDropdownOpen = false;
        this.loadDashboardData();
    }

    onTimeframeChange(timeframe: string): void {
        this.selectedTimeframe = timeframe;
        this.loadDashboardData();
    }

    onTimeFilterChange(timeFilter: 'day' | 'week' | 'month'): void {
        this.selectedTimeFilter = timeFilter;
        this.loadDashboardData();
    }

    private loadDashboardData(): void {
        this.revenueDashboardService.getRevenueDashboardData(
            this.selectedDateRange,
            this.selectedTimeframe,
            this.selectedTimeFilter
        ).subscribe({
            next: (data: RevenueDashboardData) => {
                this.dashboardData = data;
                this.kpis = data.kpis;
            },
            error: (error) => {
                console.error('Error loading revenue dashboard data:', error);
            }
        });
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
    }

    getDateRangeDisplayText(): string {
        const displayMap: { [key: string]: string } = {
            'today': 'revenueDashboard.dateRange.today',
            '7days': 'revenueDashboard.dateRange.last7Days',
            '30days': 'revenueDashboard.dateRange.last30Days'
        };
        return displayMap[this.selectedDateRange] || 'revenueDashboard.dateRange.last30Days';
    }

    getTrendIcon(trend: number): string {
        return trend >= 0 ? 'trending_up' : 'trending_down';
    }

    getTrendColor(trend: number): string {
        return trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    }

    getTrendBgColor(trend: number): string {
        return trend >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20';
    }

    formatTrend(trend: number): string {
        const sign = trend >= 0 ? '+' : '';
        return `${sign}${trend.toFixed(1)}%`;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        const target = event.target as HTMLElement;
        const dropdown = target.closest('.trezo-card-dropdown');
        if (!dropdown) {
            this.isDateRangeDropdownOpen = false;
        }
    }
}
