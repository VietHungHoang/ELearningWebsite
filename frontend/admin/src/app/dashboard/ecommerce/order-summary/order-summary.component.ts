import { Component, HostListener } from '@angular/core';
import { OrderSummaryService } from './order-summary.service';

@Component({
    selector: 'app-order-summary',
    imports: [],
    templateUrl: './order-summary.component.html',
    styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {

    selectedTimeframe: string = 'This Year'; 
    chartData: { [key: string]: { series: number[]; labels: string[] } };

    constructor(
        private orderSummaryService: OrderSummaryService
    ) {

        this.chartData = {
            'This Day': {
                series: [40, 30, 30],
                labels: ['Completed', 'New Order', 'Pending']
            },
            'This Week': {
                series: [60, 25, 15],
                labels: ['Completed', 'New Order', 'Pending']
            },
            'This Month': {
                series: [50, 40, 10],
                labels: ['Completed', 'New Order', 'Pending']
            },
            'This Year': {
                series: [60, 30, 10],
                labels: ['Completed', 'New Order', 'Pending']
            }
        };
    }

    ngOnInit(): void {

        const defaultData = this.chartData[this.selectedTimeframe];
        this.orderSummaryService.loadChart(defaultData.series, defaultData.labels);
    }

    onTimeframeChange(timeframe: string): void {
        this.selectedTimeframe = timeframe; 
        const selectedData = this.chartData[timeframe];
        this.orderSummaryService.updateChart(selectedData.series, selectedData.labels);
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

}