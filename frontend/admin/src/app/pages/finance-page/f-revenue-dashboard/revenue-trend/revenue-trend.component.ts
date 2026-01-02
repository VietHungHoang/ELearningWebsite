import { Component, Inject, OnInit, PLATFORM_ID, HostListener, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '../../../../i18n/translate.pipe';

@Component({
    selector: 'app-revenue-trend',
    template: `
        <div class="trezo-card bg-white dark:bg-[#0c1427] p-[16px] rounded-md">
            <div class="trezo-card-header mb-[12px] flex items-center justify-between">
                <div class="trezo-card-title">
                    <h5 class="!mb-0">{{ 'revenueDashboard.charts.revenueTrend.title' | translate }}</h5>
                </div>
                <div class="trezo-card-subtitle">
                    <div class="trezo-card-dropdown relative">
                        <button type="button" class="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]" (click)="toggleTimeframeMenu()">
                            <span class="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                                {{ 'revenueDashboard.charts.revenueTrend.timeframe.' + selectedTimeframe.toLowerCase() | translate }}
                                <i class="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                            </span>
                        </button>
                        @if (isTimeframeMenuOpen) {
                            <ul class="trezo-card-dropdown-menu transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[160px] z-[4] dark:bg-dark dark:shadow-none">
                                <li>
                                    <button type="button" class="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black" (click)="changeTimeframe('Daily')">
                                        {{ 'revenueDashboard.charts.revenueTrend.timeframe.daily' | translate }}
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black" (click)="changeTimeframe('Weekly')">
                                        {{ 'revenueDashboard.charts.revenueTrend.timeframe.weekly' | translate }}
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black" (click)="changeTimeframe('Monthly')">
                                        {{ 'revenueDashboard.charts.revenueTrend.timeframe.monthly' | translate }}
                                    </button>
                                </li>
                            </ul>
                        }
                    </div>
                </div>
            </div>
            <div class="trezo-card-content">
                <div class="-mt-[20px] -mb-[22px]">
                    <div id="revenue_trend_chart"></div>
                </div>
            </div>
        </div>
    `,
    styleUrl: './revenue-trend.component.scss',
    imports: [TranslatePipe]
})
export class RevenueTrendComponent implements OnInit, OnChanges {
    private isBrowser: boolean;
    private chartInstance: any;

    @Input() revenueTrendData: {
        Daily: { series: Array<{ name: string; data: number[] }>; categories: string[] };
        Weekly: { series: Array<{ name: string; data: number[] }>; categories: string[] };
        Monthly: { series: Array<{ name: string; data: number[] }>; categories: string[] };
    } | null = null;
    @Input() selectedTimeframe: string = 'Daily';
    @Output() timeframeChange = new EventEmitter<string>();

    isTimeframeMenuOpen = false;

    chartData: { [key: string]: { series: any[]; categories: string[] } } = {
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

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
        if (this.revenueTrendData) {
            this.chartData = this.revenueTrendData as any;
        }
        this.loadChart();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['revenueTrendData'] && this.revenueTrendData) {
            this.chartData = this.revenueTrendData as any;
            if (this.chartInstance) {
                this.updateChart();
            }
        }
        if (changes['selectedTimeframe']) {
            // Update chart when timeframe changes from parent
            if (this.chartInstance) {
                this.updateChart();
            }
        }
    }

    toggleTimeframeMenu(): void {
        this.isTimeframeMenuOpen = !this.isTimeframeMenuOpen;
    }

    changeTimeframe(timeframe: string): void {
        this.selectedTimeframe = timeframe;
        this.isTimeframeMenuOpen = false;
        this.timeframeChange.emit(timeframe);
        this.updateChart();
    }

    private async loadChart(): Promise<void> {
        if (this.isBrowser) {
            try {
                const ApexCharts = (await import('apexcharts')).default;

                const defaultData = this.chartData[this.selectedTimeframe];
                const options = this.getChartOptions(defaultData.series, defaultData.categories);

                this.chartInstance = new ApexCharts(
                    document.querySelector('#revenue_trend_chart'),
                    options
                );
                this.chartInstance.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

    private updateChart(): void {
        if (this.chartInstance) {
            const selectedData = this.chartData[this.selectedTimeframe];
            this.chartInstance.updateOptions(this.getChartOptions(selectedData.series, selectedData.categories));
        }
    }

    private getChartOptions(series: any[], categories: string[]): any {
        return {
            series,
            chart: {
                type: 'line',
                height: 280,
                toolbar: {
                    show: false
                }
            },
            colors: ['#605DFF'],
            stroke: {
                width: 3,
                curve: 'smooth'
            },
            grid: {
                show: true,
                borderColor: '#F6F7F9',
                strokeDashArray: 3
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories,
                axisTicks: {
                    show: true,
                    color: '#F6F7F9'
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    style: {
                        colors: '#64748B',
                        fontSize: '12px'
                    }
                }
            },
            yaxis: {
                labels: {
                    formatter: (val: any) => {
                        return '$' + (val / 1000000).toFixed(1) + 'M';
                    },
                    style: {
                        colors: '#64748B',
                        fontSize: '12px'
                    }
                }
            },
            tooltip: {
                y: {
                    formatter: function (val: any) {
                        return '$' + (val / 1000000).toFixed(1) + 'M';
                    }
                }
            },
            legend: {
                show: true,
                position: 'top',
                fontSize: '12px',
                horizontalAlign: 'center',
                labels: {
                    colors: '#64748B'
                }
            }
        };
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.trezo-card-dropdown')) {
            this.isTimeframeMenuOpen = false;
        }
    }
}
