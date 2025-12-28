import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface TopInstructor {
    instructorId: string;
    instructorName: string;
    totalSessions: number;
    totalEarnings: number;
    avgEarningsPerSession: number;
}

@Component({
    selector: 'app-top-instructors-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './top-instructors-chart.component.html',
    styleUrl: './top-instructors-chart.component.scss'
})
export class TopInstructorsChartComponent implements OnInit {
    private isBrowser: boolean;
    private chartInstance: any;

    topInstructors: TopInstructor[] = [];
    selectedView: 'chart' | 'table' = 'chart';
    isViewDropdownOpen: boolean = false;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    selectedTimeFilter: 'day' | 'week' | 'month' = 'month';
    isTimeFilterDropdownOpen: boolean = false;

    ngOnInit(): void {
        this.loadInstructorData();
        if (this.selectedView === 'chart') {
            setTimeout(() => this.loadChart(), 100);
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

    setTimeFilter(filter: 'day' | 'week' | 'month'): void {
        this.selectedTimeFilter = filter;
        this.isTimeFilterDropdownOpen = false;
        this.loadInstructorData();
        if (this.selectedView === 'chart') {
            setTimeout(() => this.loadChart(), 100);
        }
    }

    private loadInstructorData(): void {
        const baseData = [
            {
                instructorId: 'ins1',
                instructorName: 'Đặng Minh Tuấn',
                totalSessions: 24,
                totalEarnings: 456,
                avgEarningsPerSession: 19
            },
            {
                instructorId: 'ins2',
                instructorName: 'Nguyễn Thị Hương',
                totalSessions: 18,
                totalEarnings: 342,
                avgEarningsPerSession: 19
            },
            {
                instructorId: 'ins3',
                instructorName: 'Trần Quốc Bảo',
                totalSessions: 16,
                totalEarnings: 288,
                avgEarningsPerSession: 18
            },
            {
                instructorId: 'ins4',
                instructorName: 'Lý Công Đức',
                totalSessions: 14,
                totalEarnings: 245,
                avgEarningsPerSession: 17.5
            },
            {
                instructorId: 'ins5',
                instructorName: 'Vũ Hà Phương',
                totalSessions: 12,
                totalEarnings: 198,
                avgEarningsPerSession: 16.5
            }
        ];

        // Apply time filter multiplier
        const multiplier = this.selectedTimeFilter === 'day' ? 0.14 : this.selectedTimeFilter === 'week' ? 0.35 : 1;

        this.topInstructors = baseData.map(instructor => ({
            ...instructor,
            totalSessions: Math.ceil(instructor.totalSessions * multiplier),
            totalEarnings: Math.round(instructor.totalEarnings * multiplier * 10) / 10,
            avgEarningsPerSession: Math.round(instructor.avgEarningsPerSession * 10) / 10
        }));
    }

    private async loadChart(): Promise<void> {
        if (this.isBrowser && this.topInstructors.length > 0) {
            try {
                const ApexCharts = (await import('apexcharts')).default;

                const instructorNames = this.topInstructors.map(i => i.instructorName);
                const earnings = this.topInstructors.map(i => i.totalEarnings);

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
                        categories: instructorNames,
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
