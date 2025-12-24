import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class TotalCoursesService {

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    async loadChart(): Promise<void> {
        if (this.isBrowser) {
            try {
                console.log('Loading chart for Pending Approvals...');

                const ApexCharts = (await import('apexcharts')).default;

                const options = {
                    series: [
                        {
                            name: "Approved",
                            data: [5, 7, 9, 12, 15, 18, 20]
                        },
                        {
                            name: "Pending",
                            data: [3, 5, 4, 6, 5, 7, 8]
                        },
                        {
                            name: "Rejected",
                            data: [1, 2, 1, 2, 3, 2, 3]
                        }
                    ],
                    chart: {
                        type: "bar",
                        height: 100,
                        stacked: true,
                        toolbar: {
                            show: false
                        },
                        zoom: {
                            enabled: false
                        }
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: "50%"
                        }
                    },
                    colors: [
                        "#10B981", "#EAB308", "#EF4444"
                    ],
                    grid: {
                        show: true,
                        borderColor: "#ffffff"
                    },
                    stroke: {
                        width: 2,
                        show: true,
                        colors: ["transparent"]
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul"
                        ],
                        axisTicks: {
                            show: false,
                            color: '#ECEEF2'
                        },
                        axisBorder: {
                            show: false,
                            color: '#ECEEF2'
                        },
                        labels: {
                            show: false,
                            style: {
                                colors: "#8695AA",
                                fontSize: "12px"
                            }
                        }
                    },
                    yaxis: {
                        show: false,
                        labels: {
                            style: {
                                colors: "#64748B",
                                fontSize: "12px"
                            }
                        },
                        axisBorder: {
                            show: false,
                            color: '#ECEEF2'
                        },
                        axisTicks: {
                            show: false,
                            color: '#ECEEF2'
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: function(val:any) {
                                return val + " Requests";
                            }
                        }
                    },
                    legend: {
                        show: false,
                        fontSize: '12px',
                        position: 'bottom',
                        horizontalAlign: 'center',
                        itemMargin: {
                            horizontal: 8,
                            vertical: 0
                        },
                        labels: {
                            colors: '#64748B'
                        },
                        markers: {
                            size: 7,
                            offsetX: -2,
                            offsetY: -.5,
                            shape: 'diamond'
                        }
                    }
                };

                console.log('Creating chart with options:', options);
                const chart = new ApexCharts(document.querySelector('#overview_total_courses_chart'), options);
                await chart.render();
                console.log('Chart rendered successfully');

            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        } else {
            console.log('Not in browser environment, skipping chart load');
        }
    }

}
