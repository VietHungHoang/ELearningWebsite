import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class OnlineClassesService {

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
                            name: "Live",
                            data: [75, 68, 72, 80, 85, 78, 88]
                        },
                        {
                            name: "Scheduled",
                            data: [25, 32, 28, 20, 15, 22, 12]
                        }
                    ],
                    chart: {
                        type: "bar",
                        height: 100,
                        toolbar: {
                            show: false
                        }
                    },
                    colors: [
                        "#1F64F1", "#C2CDFF"
                    ],
                    plotOptions: {
                        bar: {
                            columnWidth: "85%"
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        width: 2,
                        show: true,
                        colors: ["transparent"]
                    },
                    grid: {
                        show: true,
                        borderColor: "#ffffff"
                    },
                    xaxis: {
                        categories: [
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun"
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
                                return val + " Classes";
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

                const chart = new ApexCharts(document.querySelector('#overview_online_classes_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}
