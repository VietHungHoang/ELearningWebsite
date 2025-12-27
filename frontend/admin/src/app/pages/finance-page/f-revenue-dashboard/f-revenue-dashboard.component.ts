import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { RevenueTrendComponent } from './revenue-trend/revenue-trend.component';
import { PaymentMethodChartComponent } from './payment-method-chart/payment-method-chart.component';
import { TopInstructorsChartComponent } from './top-instructors-chart/top-instructors-chart.component';

@Component({
    selector: 'app-f-revenue-dashboard',
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        TranslatePipe,
        RevenueTrendComponent,
        PaymentMethodChartComponent,
        TopInstructorsChartComponent
    ],
    templateUrl: './f-revenue-dashboard.component.html',
    styleUrl: './f-revenue-dashboard.component.scss'
})
export class FRevenueDashboardComponent implements OnInit {
    selectedDateRange: string = '30days';
    isDateRangeDropdownOpen: boolean = false;

    kpis = {
        adminAccountIncome: 0,        // Tiền vào từ transaction
        adminAccountPayout: 0,         // Tiền ra cho giảng viên
        peakTransactionAmount: 0,      // Lần thanh toán cao nhất
        payoutFixedDate: 1,            // Ngày cố định hàng tháng (e.g., 1, 15, 25)
        totalTransactions: 0,          // Tổng số giao dịch
        totalPayouts: 0,                // Tổng số lần thanh toán cho giảng viên
        // Trend data (so sánh với period trước)
        incomeTrend: 0,                 // % thay đổi income
        payoutTrend: 0,                 // % thay đổi payout
        balanceTrend: 0,                // % thay đổi balance
        peakTrend: 0,                   // % thay đổi peak
        transactionsTrend: 0,           // % thay đổi transactions
        payoutsTrend: 0                 // % thay đổi payouts
    };

    constructor() {}

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

    private loadDashboardData(): void {

        const mockData: { [key: string]: any } = {
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
            },
            thisMonth: {
                adminAccountIncome: 250000000,
                adminAccountPayout: 200000000,
                peakTransactionAmount: 4800000,
                payoutFixedDate: 1,
                totalTransactions: 155,
                totalPayouts: 1,
                incomeTrend: 12.3,
                payoutTrend: 10.5,
                balanceTrend: 16.8,
                peakTrend: 3.7,
                transactionsTrend: 15.2,
                payoutsTrend: 0
            }
        };

        this.kpis = mockData[this.selectedDateRange];
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
            '30days': 'revenueDashboard.dateRange.last30Days',
            'thisMonth': 'revenueDashboard.dateRange.thisMonth'
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
