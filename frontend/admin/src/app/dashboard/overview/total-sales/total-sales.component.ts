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

    selectedTimeframe: string = 'monthly';
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

    private loadData(): void {
        this.subscription = this.totalSalesService.getTotalRevenueData(this.selectedTimeframe).subscribe({
            next: (data: TotalRevenueData) => {
                this.totalRevenue = data.totalRevenue;
                this.growthPercentage = data.growthPercentage;
                
                const series = [
                    { name: data.series.currentPeriod.name, data: data.series.currentPeriod.data },
                    { name: data.series.previousPeriod.name, data: data.series.previousPeriod.data }
                ];
                
                this.totalSalesService.loadChart(series, data.categories, 'overview_total_sales_chart');
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
