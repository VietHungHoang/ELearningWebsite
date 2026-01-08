import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TotalSalesService, TotalRevenueData } from './total-sales.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
    selector: 'app-total-sales',
    imports: [TranslatePipe],
    templateUrl: './total-sales.component.html',
    styleUrl: './total-sales.component.scss'
})
export class TotalSalesComponent implements OnInit, OnDestroy {

    selectedTimeframe: string = 'Filter';
    instanceId: string;
    totalRevenue: number = 0;
    growthPercentage: number = 0;
    private initialized = false;
    private subscription?: Subscription;

    constructor(
        private totalSalesService: TotalSalesService
    ) {
        this.instanceId = 'total-sales-' + Math.random().toString(36).substr(2, 9);
    }

    ngOnInit(): void {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        this.loadData();
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
        this.totalSalesService.destroyChart();
    }

    /**
     * Calculate date range based on selected timeframe
     * Supports: 'weekly' (7 days) and 'monthly' (30 days)
     */
    private getDateRange(): { startDate: string; endDate: string } {
        const now = new Date();
        const endDate = now.toISOString().split('T')[0]; // Today YYYY-MM-DD
        let startDate: string;

        switch (this.selectedTimeframe) {
            case 'weekly':
                // Last 7 days
                const weekAgo = new Date(now);
                weekAgo.setDate(weekAgo.getDate() - 6);
                startDate = weekAgo.toISOString().split('T')[0];
                break;
            case 'monthly':
            default:
                // Last 30 days
                const monthAgo = new Date(now);
                monthAgo.setDate(monthAgo.getDate() - 29);
                startDate = monthAgo.toISOString().split('T')[0];
                break;
        }

        return { startDate, endDate };
    }

    private loadData(): void {
        const { startDate, endDate } = this.getDateRange();

        this.subscription = this.totalSalesService.getTotalRevenueData(startDate, endDate).subscribe({
            next: (data: TotalRevenueData) => {
                this.totalRevenue = data.totalRevenue;
                this.growthPercentage = data.growthPercentage;

                // Use series directly from transformed data
                this.totalSalesService.loadChart(data.series, data.categories, 'overview_total_sales_chart');
            },
            error: (error) => {
                console.error('Error loading total revenue data:', error);
            }
        });
    }

    onTimeframeChange(timeframe: string): void {
        this.selectedTimeframe = timeframe;
        this.isCardHeaderOpen = false;
        this.loadData();
    }

    isCardHeaderOpen = false;
    toggleCardHeaderMenu() {
        this.isCardHeaderOpen = !this.isCardHeaderOpen;
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.trezo-card-dropdown')) {
            this.isCardHeaderOpen = false;
        }
    }

    formatRevenue(amount: number): string {
        if (amount >= 1000000000) {
            return (amount / 1000000000).toFixed(1) + 'B';
        } else if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(1) + 'K';
        }
        return amount.toString();
    }
}
