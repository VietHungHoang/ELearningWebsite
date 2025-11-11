import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TransactionService } from '../../../../services/transaction.service';

@Component({
    selector: 'app-top-instructors-chart',
    template: `
        <div class="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div class="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div class="trezo-card-title">
                    <h5 class="!mb-0">Top 5 Instructors by Orders</h5>
                </div>
                <div class="trezo-card-subtitle">
                    <div class="trezo-card-dropdown relative">
                        <button type="button" class="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]" (click)="toggleFilterDropdown()">
                            <span class="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                                {{ selectedFilter }}
                                <i class="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                            </span>
                        </button>
                        @if (isFilterDropdownOpen) {
                            <ul class="trezo-card-dropdown-menu transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[160px] z-[5] dark:bg-dark dark:shadow-none">
                                <li>
                                    <button type="button" class="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black" (click)="setFilter('By Hour')">
                                        By Hour
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black" (click)="setFilter('By Day')">
                                        By Day
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="block w-full transition-all text-black ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black" (click)="setFilter('By Week')">
                                        By Week
                                    </button>
                                </li>
                            </ul>
                        }
                    </div>
                </div>
            </div>
            <div class="trezo-card-content">
                <div class="-mt-[20px] -mb-[22px]">
                    <div id="top_courses_chart"></div>
                </div>
            </div>
        </div>
    `,
    styleUrl: './top-instructors-chart.component.scss'
})
export class TopInstructorsChartComponent implements OnInit {
    private isBrowser: boolean;
    private chartInstance: any;

    selectedFilter: string = 'By Day';
    isFilterDropdownOpen: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private transactionService: TransactionService
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
        this.loadChart();
    }

    toggleFilterDropdown(): void {
        this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
    }

    setFilter(filter: string): void {
        this.selectedFilter = filter;
        this.isFilterDropdownOpen = false;
        this.loadChart(); 
    }

    private async loadChart(): Promise<void> {
        if (this.isBrowser) {
            try {
                const ApexCharts = (await import('apexcharts')).default;

                const topInstructors = this.transactionService.getTopInstructorsByOrders(5);

                let filteredInstructors = topInstructors;
                if (this.selectedFilter === 'By Hour') {

                    filteredInstructors = topInstructors.map(instructor => ({
                        ...instructor,
                        orderCount: Math.floor(instructor.orderCount * 0.3) 
                    }));
                } else if (this.selectedFilter === 'By Week') {

                    filteredInstructors = topInstructors.map(instructor => ({
                        ...instructor,
                        orderCount: Math.floor(instructor.orderCount * 0.7) 
                    }));
                }

                const instructorNames = filteredInstructors.map((i: any) => i.instructorName);
                const orderCounts = filteredInstructors.map((i: any) => i.orderCount);

                const options = {
                    series: [
                        {
                            name: 'Total Orders',
                            data: orderCounts
                        }
                    ],
                    chart: {
                        type: 'bar',
                        height: 350,
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
                                return Math.round(val).toString();
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
                            formatter: function (val: any) {
                                return Math.round(val) + ' orders';
                            }
                        }
                    }
                };

                this.chartInstance = new ApexCharts(
                    document.querySelector('#top_courses_chart'),
                    options
                );
                this.chartInstance.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }
}
