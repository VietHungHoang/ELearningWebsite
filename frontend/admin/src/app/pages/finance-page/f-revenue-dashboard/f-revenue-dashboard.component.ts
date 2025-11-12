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
        grossRevenue: 0,
        instructorEarnings: 0,
        platformProfit: 0,
        totalOrders: 0,
        gatewayFees: 0
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
                grossRevenue: 1500000,
                instructorEarnings: 450000,
                platformProfit: 1050000,
                totalOrders: 5,
                gatewayFees: 33000
            },
            '7days': {
                grossRevenue: 8500000,
                instructorEarnings: 2550000,
                platformProfit: 5950000,
                totalOrders: 28,
                gatewayFees: 187000
            },
            '30days': {
                grossRevenue: 35000000,
                instructorEarnings: 10500000,
                platformProfit: 24500000,
                totalOrders: 112,
                gatewayFees: 770000
            },
            thisMonth: {
                grossRevenue: 32000000,
                instructorEarnings: 9600000,
                platformProfit: 22400000,
                totalOrders: 105,
                gatewayFees: 704000
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
