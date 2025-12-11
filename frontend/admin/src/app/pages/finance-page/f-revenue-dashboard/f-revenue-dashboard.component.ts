import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RevenueTrendComponent } from './revenue-trend/revenue-trend.component';
import { PaymentMethodChartComponent } from './payment-method-chart/payment-method-chart.component';
import { TopInstructorsChartComponent } from './top-instructors-chart/top-instructors-chart.component';

@Component({
    selector: 'app-f-revenue-dashboard',
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
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
        totalPayouts: 0                // Tổng số lần thanh toán cho giảng viên
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
                adminAccountIncome: 15000000,         // 15M VND vào tài khoản admin
                adminAccountPayout: 0,                 // Chưa có payout hôm nay
                peakTransactionAmount: 2000000,        // Lần thanh toán cao nhất 2M VND
                payoutFixedDate: 1,                    // Thanh toán vào ngày 1 hàng tháng
                totalTransactions: 8,
                totalPayouts: 0
            },
            '7days': {
                adminAccountIncome: 85000000,         // 85M VND trong 7 ngày
                adminAccountPayout: 0,                 // Chưa có payout trong tuần này
                peakTransactionAmount: 3500000,        // Peak 3.5M VND
                payoutFixedDate: 1,
                totalTransactions: 42,
                totalPayouts: 0
            },
            '30days': {
                adminAccountIncome: 280000000,        // 280M VND trong 30 ngày
                adminAccountPayout: 224000000,        // 224M VND trả cho giảng viên (80% của income)
                peakTransactionAmount: 5000000,        // Peak 5M VND
                payoutFixedDate: 1,                    // Thanh toán vào ngày 1 hàng tháng
                totalTransactions: 168,
                totalPayouts: 1                        // 1 lần thanh toán trong tháng
            },
            thisMonth: {
                adminAccountIncome: 250000000,        // 250M VND trong tháng
                adminAccountPayout: 200000000,        // 200M VND trả cho giảng viên
                peakTransactionAmount: 4800000,        // Peak 4.8M VND
                payoutFixedDate: 1,
                totalTransactions: 155,
                totalPayouts: 1
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
            'today': 'Today',
            '7days': 'Last 7 Days',
            '30days': 'Last 30 Days',
            'thisMonth': 'This Month'
        };
        return displayMap[this.selectedDateRange] || 'Last 30 Days';
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
