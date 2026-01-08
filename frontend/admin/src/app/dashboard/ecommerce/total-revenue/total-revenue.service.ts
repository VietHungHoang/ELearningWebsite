import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TotalRevenueData {
    totalRevenue: number;
    growthPercentage: number;
    dailyData: {
        date: string;
        amount: number;
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class TotalRevenueService {

    private isBrowser: boolean;
    private apiUrl = `${environment.apiUrl}/v1/admin/dashboard/total-revenue`;
    private chart: any = null;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private http: HttpClient
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    getTotalRevenue(startDate?: string, endDate?: string): Observable<TotalRevenueData> {
        let params = new HttpParams();

        if (startDate) {
            params = params.set('startDate', startDate);
        }
        if (endDate) {
            params = params.set('endDate', endDate);
        }

        return this.http.get<TotalRevenueData>(this.apiUrl, { params });
    }

    async loadChart(data: TotalRevenueData): Promise<void> {
        if (this.isBrowser && data) {
            try {
                const ApexCharts = (await import('apexcharts')).default;

                if (this.chart) {
                    this.chart.destroy();
                }

                const options = {
                    series: [
                        {
                            name: "Revenue",
                            data: data.dailyData.map(d => d.amount)
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
                            enabled: true
                        }
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: "55%"
                        }
                    },
                    colors: [
                        "#605DFF"
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
                        categories: data.dailyData.map(d => {
                            const date = new Date(d.date);
                            return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                        }),
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
                            },
                            formatter: (value: number) => {
                                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
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
                        show: false
                    },
                    tooltip: {
                        y: {
                            formatter: function (val: any) {
                                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
                            }
                        }
                    }
                };

                const chartElement = document.querySelector('#ecommerce_total_revenue_chart');
                if (chartElement) {
                    this.chart = new ApexCharts(chartElement, options);
                    await this.chart.render();
                }
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }
}
