import { Component, Inject, OnInit, PLATFORM_ID, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { TranslatePipe } from '../../../../i18n/translate.pipe';

export interface TopTutor {
    tutorId: string;
    tutorName: string;
    totalSessions: number;
    totalEarnings: number;
    avgEarningsPerSession: number;
}

@Component({
    selector: 'app-top-instructors-chart',
    standalone: true,
    imports: [CommonModule, CurrencyFormatPipe, TranslatePipe],
    templateUrl: './top-instructors-chart.component.html',
    styleUrl: './top-instructors-chart.component.scss'
})
export class TopInstructorsChartComponent implements OnInit, OnChanges {
    private isBrowser: boolean;
    private chartInstance: any;

    @Input() topTutorsData: {
        week: TopTutor[];
        month: TopTutor[];
        year: TopTutor[];
    } | null = null;
    @Input() selectedTimeFilter: 'week' | 'month' | 'year' = 'month';
    @Output() timeFilterChange = new EventEmitter<'week' | 'month' | 'year'>();

    topTutors: TopTutor[] = [];
    selectedView: 'chart' | 'table' = 'chart';
    isViewDropdownOpen: boolean = false;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    isTimeFilterDropdownOpen: boolean = false;

    ngOnInit(): void {
        this.loadTutorData();
        if (this.selectedView === 'chart') {
            setTimeout(() => this.loadChart(), 100);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['topTutorsData'] && this.topTutorsData) {
            this.loadTutorData();
            if (this.selectedView === 'chart' && this.chartInstance) {
                setTimeout(() => this.loadChart(), 100);
            }
        }
        if (changes['selectedTimeFilter']) {
            // Update data when timeFilter changes from parent
            this.loadTutorData();
            if (this.selectedView === 'chart' && this.chartInstance) {
                setTimeout(() => this.loadChart(), 100);
            }
        }
    }

    toggleViewDropdown(): void {
        this.isViewDropdownOpen = !this.isViewDropdownOpen;
    }

    toggleTimeFilterDropdown(): void {
        this.isTimeFilterDropdownOpen = !this.isTimeFilterDropdownOpen;
    }

    setView(view: 'chart' | 'table'): void {
        this.selectedView = view;
        this.isViewDropdownOpen = false;
        if (view === 'chart') {
            setTimeout(() => this.loadChart(), 100);
        }
    }

    getTimeFilterLabel(): string {
        const labelMap: Record<'week' | 'month' | 'year', string> = {
            'week': 'revenueDashboard.charts.topInstructors.timeFilter.weekly',
            'month': 'revenueDashboard.charts.topInstructors.timeFilter.monthly',
            'year': 'revenueDashboard.charts.topInstructors.timeFilter.yearly'
        };
        return labelMap[this.selectedTimeFilter];
    }

    setTimeFilter(filter: 'week' | 'month' | 'year'): void {
        this.selectedTimeFilter = filter;
        this.isTimeFilterDropdownOpen = false;
        this.timeFilterChange.emit(filter);
        this.loadTutorData();
        if (this.selectedView === 'chart') {
            setTimeout(() => this.loadChart(), 100);
        }
    }

    private loadTutorData(): void {
        if (this.topTutorsData) {
            // Use data from API
            if (this.selectedTimeFilter === 'week') {
                this.topTutors = this.topTutorsData.week;
            } else if (this.selectedTimeFilter === 'month') {
                this.topTutors = this.topTutorsData.month;
            } else {
                this.topTutors = this.topTutorsData.year;
            }
        } else {
            // Fallback to mock data
            const baseData = [
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

            // Apply time filter multiplier
            const multiplier = this.selectedTimeFilter === 'week' ? 0.35 : this.selectedTimeFilter === 'month' ? 1 : 12;

            this.topTutors = baseData.map(tutor => ({
                ...tutor,
                totalSessions: Math.ceil(tutor.totalSessions * multiplier),
                totalEarnings: Math.round(tutor.totalEarnings * multiplier * 10) / 10,
                avgEarningsPerSession: Math.round(tutor.avgEarningsPerSession * 10) / 10
            }));
        }
    }

    private async loadChart(): Promise<void> {
        if (this.isBrowser && this.topTutors.length > 0) {
            try {
                const ApexCharts = (await import('apexcharts')).default;

                const tutorNames = this.topTutors.map(t => t.tutorName);
                const earnings = this.topTutors.map(t => t.totalEarnings);

                const options = {
                    series: [
                        {
                            name: 'Total Earnings',
                            data: earnings
                        }
                    ],
                    chart: {
                        type: 'bar',
                        height: 240,
                        toolbar: {
                            show: false
                        }
                    },
                    colors: ['#605DFF'],
                    plotOptions: {
                        bar: {
                            columnWidth: '60%',
                            dataLabels: {
                                position: 'top'
                            }
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: tutorNames,
                        axisTicks: {
                            show: true,
                            color: '#F6F7F9'
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
                                return '$' + Math.round(val);
                            },
                            style: {
                                colors: '#64748B',
                                fontSize: '12px'
                            }
                        }
                    },
                    grid: {
                        show: true,
                        borderColor: '#F6F7F9'
                    },
                    tooltip: {
                        y: {
                            formatter: (val: any) => {
                                return '$' + Math.round(val);
                            }
                        }
                    }
                };

                const chartElement = document.querySelector('#top_instructors_chart');
                if (chartElement) {
                    this.chartInstance = new ApexCharts(chartElement, options);
                    this.chartInstance.render();
                }
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
}
