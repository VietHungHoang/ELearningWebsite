import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { TotalSalesService } from './total-sales.service';

@Component({
    selector: 'app-total-sales',
    imports: [],
    templateUrl: './total-sales.component.html',
    styleUrl: './total-sales.component.scss'
})
export class TotalSalesComponent implements OnInit, OnDestroy {

    selectedTimeframe: string = 'Monthly'; 
    instanceId: string;
    private initialized = false;
    chartData: { [key: string]: { series: { name: string; data: number[] }[]; categories: string[] } } = {
        Weekly: {
            series: [
                { name: 'Current Sale', data: [35, 50, 55, 60, 50, 60, 55] },
                { name: 'Last Year Sale', data: [70, 50, 40, 40, 62, 52, 80] }
            ],
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        Monthly: {
            series: [
                { name: 'Current Sale', data: [35, 50, 55, 60, 50, 60, 55, 60, 78, 40, 95, 80] },
                { name: 'Last Year Sale', data: [70, 50, 40, 40, 62, 52, 80, 40, 60, 53, 70, 70] }
            ],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        Yearly: {
            series: [
                { name: 'Current Sale', data: [2000, 3000, 2500, 4000] },
                { name: 'Last Year Sale', data: [1500, 2000, 1800, 3000] }
            ],
            categories: ['Q1', 'Q2', 'Q3', 'Q4']
        }
    };

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

        const defaultData = this.chartData[this.selectedTimeframe];
        this.totalSalesService.loadChart(defaultData.series, defaultData.categories, 'overview_total_sales_chart');
    }

    onTimeframeChange(timeframe: string): void {
        this.selectedTimeframe = timeframe; 
        const selectedData = this.chartData[timeframe];
        this.totalSalesService.updateChart(selectedData.series, selectedData.categories);
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

    ngOnDestroy(): void {
        if (this.totalSalesService['chartInstance']) {
            this.totalSalesService['chartInstance'].destroy();
        }
    }
}
