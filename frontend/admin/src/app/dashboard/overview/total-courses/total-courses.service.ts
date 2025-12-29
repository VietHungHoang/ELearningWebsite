import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Response data for Tutor Pending Approvals API
 * API Endpoint: GET /api/v1/admin/dashboard/tutor-pending-approvals
 * Query Params: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
 */
export interface TutorPendingApprovalsData {
    /** Total number of tutor approval requests in the period */
    total: number;
    /** Number of pending tutor approval requests */
    pending: number;
    /** Number of approved tutor requests */
    approved: number;
    /** Number of rejected tutor requests */
    rejected: number;
    /** Percentage of pending requests out of total */
    percentage: number;
    /** Weekly breakdown of tutor approval requests */
    weeklyData: {
        /** Date in YYYY-MM-DD format */
        date: string;
        /** Number of approved tutors on this date */
        approved: number;
        /** Number of pending tutors on this date */
        pending: number;
        /** Number of rejected tutors on this date */
        rejected: number;
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
export class TotalCoursesService {

    private isBrowser: boolean;
    private apiUrl = 'http://localhost:8081/api/v1/admin/dashboard';
    private chart: any = null;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private http: HttpClient
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    getTutorPendingApprovalsData(startDate?: string, endDate?: string): Observable<TutorPendingApprovalsData> {
        let params = new HttpParams();
        
        // Default to this week if no dates provided
        if (!startDate || !endDate) {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 6);
            startDate = start.toISOString().split('T')[0];
            endDate = end.toISOString().split('T')[0];
        }
        
        params = params.set('startDate', startDate);
        params = params.set('endDate', endDate);

        return this.http.get<ApiResponse<TutorPendingApprovalsData>>(`${this.apiUrl}/tutor-pending-approvals`, { params })
            .pipe(
                map(response => {
                    if (response.success && response.data) {
                        return response.data;
                    }
                    throw new Error(response.message || 'Invalid response');
                })
            );
    }

    async loadChart(data: TutorPendingApprovalsData): Promise<void> {
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
                            name: "Đã duyệt",
                            data: data.weeklyData.map(d => d.approved)
                        },
                        {
                            name: "Chờ duyệt",
                            data: data.weeklyData.map(d => d.pending)
                        },
                        {
                            name: "Đã từ chối",
                            data: data.weeklyData.map(d => d.rejected)
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
                        categories: data.weeklyData.map(d => {
                            const date = new Date(d.date);
                            return date.toLocaleDateString('vi-VN', { day: '2-digit' });
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
                                return val + " gia sư";
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

                const chartElement = document.querySelector('#overview_total_courses_chart');
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
