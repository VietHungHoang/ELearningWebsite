import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class TotalStudentsService {

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    async loadChart(): Promise<void> {
        if (this.isBrowser) {
            try {

                const ApexCharts = (await import('apexcharts')).default;

                const options = {
                    series: [
                        {
                            name: "Enrolled",
                            data: [65, 58, 72, 68]
                        },
                        {
                            name: "Completed",
                            data: [45, 38, 50, 45]
                        }
                    ],
                    chart: {
                        height: 100,
                        type: "bar",
                        zoom: {
                            enabled: false
                        },
                        toolbar: {
                            show: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    colors: [
                        "#605DFF", "#C2CDFF"
                    ],
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '60%',
                            borderRadius: 4
                        }
                    },
                    grid: {
                        show: false,
                        borderColor: "#ffffff"
                    },
                    xaxis: {
                        categories: [
                            "Q1",
                            "Q2",
                            "Q3",
                            "Q4"
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

                const chart = new ApexCharts(document.querySelector('#overview_total_students_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}
