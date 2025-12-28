import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Response data for New Students API
 * API Endpoint: GET /api/v1/admin/dashboard/new-students
 * Query Params: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
 */
export interface NewStudentsData {
    /** Total number of new students registered in the period */
    totalNewStudents: number;
    /** Growth percentage compared to previous period (can be negative) */
    growthPercentage: number;
    /** Daily breakdown of new student registrations */
    dailyData: {
        /** Date in YYYY-MM-DD format */
        date: string;
        /** Number of new students registered on this date */
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
export class TotalStudentsService {

    private isBrowser: boolean;
    private apiUrl = 'http://localhost:8081/api/v1/admin/dashboard';
    private chart: any = null;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private http: HttpClient
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    getNewStudentsData(startDate?: string, endDate?: string): Observable<NewStudentsData> {
        let params = new HttpParams();
        
        // Default to current month (from 1st day to today)
        if (!startDate || !endDate) {
            const today = new Date();
            const start = new Date(today.getFullYear(), today.getMonth(), 1);
            startDate = start.toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];
        }
        
        params = params.set('startDate', startDate);
        params = params.set('endDate', endDate);

        return this.http.get<ApiResponse<NewStudentsData>>(`${this.apiUrl}/new-students`, { params })
            .pipe(
                map(response => {
                    if (response.success && response.data) {
                        return response.data;
                    }
                    throw new Error(response.message || 'Invalid response');
                })
            );
    }

    async loadChart(data: NewStudentsData): Promise<void> {
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
                            name: "Học viên mới",
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
                        "#605DFF"
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
                            gradientToColors: ['#605DFF'],
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
                        categories: data.dailyData.map(d => d.date),
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
                            formatter: function(val: any, opts: any) {
                                const date = new Date(data.dailyData[opts.dataPointIndex]?.date);
                                return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                            }
                        },
                        y: {
                            formatter: function(val: any) {
                                return val + " học viên";
                            }
                        }
                    }
                };

                const chartElement = document.querySelector('#overview_new_students_chart');
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
