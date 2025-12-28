import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { I18nService } from '../../../i18n/i18n.service';

/**
 * Response data for Total Revenue API
 * API Endpoint: GET /api/v1/admin/dashboard/total-revenue
 * Query Params: 
 *   - period (weekly|monthly|yearly) - Time period
 *   - startDate (YYYY-MM-DD) - Optional start date
 *   - endDate (YYYY-MM-DD) - Optional end date
 *   - lang (en|vi) - Language code for localized labels
 */
export interface TotalRevenueData {
    /** Total revenue in the period (in VND) */
    totalRevenue: number;
    /** Growth percentage compared to previous period (can be negative) */
    growthPercentage: number;
    /** Revenue data series for chart */
    series: {
        /** Current period revenue data */
        currentPeriod: {
            /** Series name for display */
            name: string;
            /** Revenue values array */
            data: number[];
        };
        /** Previous period revenue data for comparison */
        previousPeriod: {
            /** Series name for display */
            name: string;
            /** Revenue values array */
            data: number[];
        };
    };
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
    private apiUrl = 'http://localhost:8081/api/v1/admin/dashboard';
    private chartInstance: any;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private http: HttpClient,
        private i18nService: I18nService
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    /**
     * Get mock data for Total Revenue when API fails
     */
    private getMockData(period: string): TotalRevenueData {
        const mockDataByPeriod: { [key: string]: TotalRevenueData } = {
            weekly: {
                totalRevenue: 245000000,
                growthPercentage: 12.5,
                series: {
                    currentPeriod: { name: 'Tuần này', data: [35, 50, 55, 60, 50, 60, 55] },
                    previousPeriod: { name: 'Tuần trước', data: [70, 50, 40, 40, 62, 52, 80] }
                },
                categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
            },
            monthly: {
                totalRevenue: 1250000000,
                growthPercentage: 8.3,
                series: {
                    currentPeriod: { 
                        name: 'Tháng này', 
                        data: [35, 50, 55, 60, 50, 60, 55, 60, 78, 40, 95, 80, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150]
                    },
                    previousPeriod: { 
                        name: 'Tháng trước', 
                        data: [70, 50, 40, 40, 62, 52, 80, 40, 60, 53, 70, 70, 65, 68, 72, 75, 78, 82, 85, 88, 92, 95, 98, 102, 105, 108, 112, 115, 118, 122]
                    }
                },
                categories: Array.from({ length: 30 }, (_, i) => (i + 1).toString())
            },
            yearly: {
                totalRevenue: 5800000000,
                growthPercentage: 15.2,
                series: {
                    currentPeriod: { name: 'Năm nay', data: [2000, 3000, 2500, 4000] },
                    previousPeriod: { name: 'Năm trước', data: [1500, 2000, 1800, 3000] }
                },
                categories: ['Q1', 'Q2', 'Q3', 'Q4']
            }
        };
        return mockDataByPeriod[period] || mockDataByPeriod['monthly'];
    }

    /**
     * Get total revenue data from API
     * @param period - Time period: 'weekly', 'monthly', 'yearly'
     * @param startDate - Optional start date (YYYY-MM-DD)
     * @param endDate - Optional end date (YYYY-MM-DD)
     */
    getTotalRevenueData(period: string = 'monthly', startDate?: string, endDate?: string): Observable<TotalRevenueData> {
        // Get current language code
        const lang = this.i18nService.getCurrentLanguage();
        
        let params = new HttpParams()
            .set('period', period)
            .set('lang', lang);
        
        if (startDate) {
            params = params.set('startDate', startDate);
        }
        if (endDate) {
            params = params.set('endDate', endDate);
        }

        return this.http.get<ApiResponse<TotalRevenueData>>(`${this.apiUrl}/total-revenue`, { params })
            .pipe(
                map(response => {
                    if (response.success && response.data) {
                        return response.data;
                    }
                    throw new Error(response.message || 'Invalid response');
                }),
                catchError(error => {
                    console.warn('⚠️ Total Revenue API failed, using mock data:', error);
                    return of(this.getMockData(period));
                })
            );
    }

    async loadChart(series: { name: string; data: number[] }[], categories: string[], chartId: string): Promise<void> {
        if (this.isBrowser) {
            try {
                const ApexCharts = (await import('apexcharts')).default;
                
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
                        "#605DFF", "#DDE4FF"
                    ],
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: "smooth",
                        width: [2, 2, 0],
                        dashArray: [0, 6, 0]
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
                            formatter: function(val: any) {
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
