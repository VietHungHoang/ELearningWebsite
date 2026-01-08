import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

/**
 * Response data for New Tutors API
 * API Endpoint: GET /api/v1/admin/dashboard/new-tutors
 * Query Params: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
 */
export interface NewTutorsData {
    /** Total number of new tutors registered in the period */
    totalNewTutors: number;
    /** Growth percentage compared to previous period (can be negative) */
    growthPercentage: number;
    /** Daily breakdown of new tutor registrations */
    dailyData: {
        /** Date in YYYY-MM-DD format */
        date: string;
        /** Day name from backend (e.g. "T2", "T3", "CN") */
        dayName: string;
        /** Number of new tutors registered on this date */
        count: number;
    }[];
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
export class TotalMentorsService {

    private isBrowser: boolean;
    private apiUrl = `${environment.apiUrl}/v1/admin/dashboard`;
    private chart: any = null;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private http: HttpClient
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    getNewTutorsData(startDate?: string, endDate?: string): Observable<NewTutorsData> {
        let params = new HttpParams();

        // Default to last 7 days (weekly) if no dates provided
        if (!startDate || !endDate) {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 6);
            startDate = start.toISOString().split('T')[0];
            endDate = end.toISOString().split('T')[0];
        }

        params = params.set('startDate', startDate);
        params = params.set('endDate', endDate);

        return this.http.get<any>(`${this.apiUrl}/new-tutors`, { params })
            .pipe(
                map(response => {
                    // Handle both wrapped { success, data } and direct response formats
                    const backendData = response.data || response;
                    if (!backendData || !backendData.dailyData) {
                        throw new Error('Invalid response format');
                    }
                    return backendData as NewTutorsData;
                })
            );
    }

    async loadChart(data: NewTutorsData): Promise<void> {
        if (this.isBrowser && data) {
            try {
                const ApexCharts = (await import('apexcharts')).default;

                // Destroy existing chart if any
                if (this.chart) {
                    this.chart.destroy();
                }

                const options = {
                    series: [
                        {
                            name: "Gia sư mới",
                            data: data.dailyData.map(d => d.count)
                        }
                    ],
                    chart: {
                        type: "line",
                        height: 100,
                        toolbar: {
                            show: false
                        },
                        zoom: {
                            enabled: false
                        },
                        sparkline: {
                            enabled: true
                        }
                    },
                    colors: [
                        "#1F64F1"
                    ],
                    stroke: {
                        width: 3,
                        curve: "smooth"
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shade: 'light',
                            type: 'vertical',
                            shadeIntensity: 0.5,
                            gradientToColors: ['#1F64F1'],
                            inverseColors: false,
                            opacityFrom: 0.6,
                            opacityTo: 0.1,
                            stops: [0, 100]
                        }
                    },
                    markers: {
                        size: 0
                    },
                    dataLabels: {
                        enabled: false
                    },
                    grid: {
                        show: false
                    },
                    xaxis: {
                        categories: data.dailyData.map(d => d.dayName),
                        labels: {
                            show: false
                        },
                        axisBorder: {
                            show: false
                        },
                        axisTicks: {
                            show: false
                        }
                    },
                    yaxis: {
                        show: false
                    },
                    tooltip: {
                        x: {
                            formatter: function (val: any, opts: any) {
                                const date = new Date(data.dailyData[opts.dataPointIndex]?.date);
                                return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                            }
                        },
                        y: {
                            formatter: function (val: any) {
                                return val + " gia sư";
                            }
                        }
                    }
                };

                const chartElement = document.querySelector('#overview_new_tutors_chart');
                if (chartElement) {
                    this.chart = new ApexCharts(chartElement, options);
                    this.chart.render();
                }
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }
}
