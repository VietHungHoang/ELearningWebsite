import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { I18nService } from '../../../i18n/i18n.service';
import { environment } from '../../../../environments/environment';

/**
 * Response data for Total Revenue API (Backend format)
 */
interface BackendRevenueData {
    totalRevenue: number;
    growthPercentage: number;
    dailyData: {
        date: string;
        amount: number;
    }[];
}

/**
 * Transformed data for Total Revenue chart display
 */
export interface TotalRevenueData {
    /** Total revenue in the period (in VND) */
    totalRevenue: number;
    /** Growth percentage compared to previous period (can be negative) */
    growthPercentage: number;
    /** Revenue data series for chart */
    series: {
        name: string;
        data: number[];
    }[];
    /** Categories for X-axis (date labels) */
    categories: string[];
}

/**
 * Standard API response wrapper
 */
interface ApiResponse<T> {
    /** Indicates if the request was successful */
    success: boolean;
    /** Response data payload */
    data: T;
    /** Optional error or info message */
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class TotalSalesService {

    private isBrowser: boolean;
    private apiUrl = `${environment.apiUrl}/v1/admin/dashboard`;
    private chartInstance: any;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private http: HttpClient,
        private i18nService: I18nService
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }



    /**
     * Get total revenue data from API
     * @param startDate - Start date (YYYY-MM-DD)
     * @param endDate - End date (YYYY-MM-DD)
     */
    getTotalRevenueData(startDate: string, endDate: string): Observable<TotalRevenueData> {
        const lang = this.i18nService.getCurrentLanguage();

        const params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate)
            .set('lang', lang);

        return this.http.get<any>(`${this.apiUrl}/total-revenue`, { params })
            .pipe(
                map(response => {
                    // Debug: Log raw API response
                    console.log('📡 API Response:', response);

                    // Handle both wrapped { success, data } and direct response formats
                    const backendData: BackendRevenueData = response.data || response;

                    if (!backendData || !backendData.dailyData) {
                        console.error('❌ Invalid response format:', response);
                        throw new Error('Invalid response format');
                    }

                    // Transform dailyData to chart format
                    const categories = backendData.dailyData.map(d => {
                        const date = new Date(d.date);
                        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                    });

                    const series = [
                        {
                            name: lang === 'vi' ? 'Doanh thu' : 'Revenue',
                            data: backendData.dailyData.map(d => d.amount)
                        }
                    ];

                    console.log('✅ Transformed Data:', { series, categories, totalRevenue: backendData.totalRevenue });

                    return {
                        totalRevenue: backendData.totalRevenue,
                        growthPercentage: backendData.growthPercentage,
                        series,
                        categories
                    };
                }),
                catchError(error => {
                    console.error('❌ Total Revenue API failed:', error);
                    return of({
                        totalRevenue: 0,
                        growthPercentage: 0,
                        series: [{ name: 'Doanh thu', data: [] }],
                        categories: []
                    });
                })
            );
    }

    async loadChart(series: { name: string; data: number[] }[], categories: string[], chartId: string): Promise<void> {
        if (this.isBrowser) {
            try {
                const ApexCharts = (await import('apexcharts')).default;

                // Debug: Log chart data
                console.log('📊 Chart Data:', { series, categories, chartId });

                // Destroy existing chart if any
                if (this.chartInstance) {
                    this.chartInstance.destroy();
                }

                const options = {
                    series,
                    chart: {
                        type: "area",
                        height: 450,
                        zoom: {
                            enabled: false
                        }
                    },
                    colors: [
                        "#605DFF"
                    ],
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: "smooth",
                        width: 2
                    },
                    grid: {
                        show: false,
                        borderColor: "#ECEEF2"
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            stops: [0, 90, 100],
                            shadeIntensity: 1,
                            opacityFrom: 0,
                            opacityTo: 0.5
                        }
                    },
                    xaxis: {
                        categories,
                        axisTicks: {
                            show: false,
                            color: '#ECEEF2'
                        },
                        axisBorder: {
                            show: false,
                            color: '#ECEEF2'
                        },
                        labels: {
                            show: true,
                            style: {
                                colors: "#8695AA",
                                fontSize: "12px"
                            }
                        }
                    },
                    yaxis: {
                        min: 0,
                        title: {
                            text: 'Doanh thu (VNĐ)',
                            style: {
                                color: '#64748B',
                                fontSize: '12px'
                            }
                        },
                        labels: {
                            formatter: (val: any) => {
                                if (val >= 1000000) {
                                    return (val / 1000000).toFixed(1) + 'M';
                                } else if (val >= 1000) {
                                    return (val / 1000).toFixed(0) + 'K';
                                }
                                return val;
                            },
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
                        show: true,
                        position: 'top',
                        fontSize: '12px',
                        horizontalAlign: 'left',
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
                    },
                    tooltip: {
                        y: {
                            formatter: function (val: any) {
                                if (val >= 1000000) {
                                    return (val / 1000000).toFixed(1) + 'M VNĐ';
                                } else if (val >= 1000) {
                                    return (val / 1000).toFixed(0) + 'K VNĐ';
                                }
                                return val + ' VNĐ';
                            }
                        }
                    }
                };
                this.chartInstance = new ApexCharts(document.querySelector('#' + chartId), options);
                this.chartInstance.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

    updateChart(series: { name: string; data: number[] }[], categories: string[]): void {
        if (this.chartInstance) {
            this.chartInstance.updateOptions({ series, xaxis: { categories } });
        }
    }

    destroyChart(): void {
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    }
}
