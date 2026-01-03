import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

/**
 * Response data for Popular Subjects API
 * API Endpoint: GET /api/v1/admin/dashboard/popular-subjects
 * No query parameters required - returns all-time popular subjects
 */
export interface PopularSubjectsData {
    /** List of popular subjects with statistics */
    subjects: {
        /** Subject/topic name */
        name: string;
        /** Number of instructors teaching this subject */
        instructorCount: number;
        /** Number of students enrolled in this subject */
        studentCount: number;
        /** Total sessions/bookings for this subject */
        totalSessions: number;
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
export class StudentsInterestedTopicsService {

    private isBrowser: boolean;
    private apiUrl = `${environment.apiUrl}/v1/admin/dashboard`;
    private chartInstance: any;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private http: HttpClient
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    /**
     * Get mock data for Popular Subjects when API fails
     */
    private getMockData(): PopularSubjectsData {
        return {
            subjects: [
                { name: 'Tiếng Anh', instructorCount: 45, studentCount: 320, totalSessions: 1250 },
                { name: 'Toán học', instructorCount: 38, studentCount: 280, totalSessions: 980 },
                { name: 'Lập trình', instructorCount: 32, studentCount: 245, totalSessions: 850 },
                { name: 'Tiếng Nhật', instructorCount: 18, studentCount: 156, totalSessions: 520 },
                { name: 'Vật lý', instructorCount: 15, studentCount: 134, totalSessions: 420 },
                { name: 'Hóa học', instructorCount: 12, studentCount: 98, totalSessions: 310 }
            ]
        };
    }

    /**
     * Get popular subjects data from API
     * Returns all-time popular subjects (no period filter)
     */
    getPopularSubjectsData(): Observable<PopularSubjectsData> {
        return this.http.get<ApiResponse<PopularSubjectsData>>(`${this.apiUrl}/popular-subjects`)
            .pipe(
                map(response => {
                    if (response.success && response.data) {
                        return response.data;
                    }
                    throw new Error(response.message || 'Invalid response');
                }),
                catchError(error => {
                    console.warn('⚠️ Popular Subjects API failed, using mock data:', error);
                    return of(this.getMockData());
                })
            );
    }

    async loadChart(series: { name: string; data: number[] }[], categories: string[]): Promise<void> {
        if (this.isBrowser) {
            try {
                const ApexCharts = (await import('apexcharts')).default;

                // Destroy existing chart if any
                if (this.chartInstance) {
                    this.chartInstance.destroy();
                }

                const options = {
                    series: series,
                    chart: {
                        type: "bar",
                        height: 424,
                        toolbar: {
                            show: false
                        }
                    },
                    colors: [
                        "#605DFF"
                    ],
                    plotOptions: {
                        bar: {
                            barHeight: '21px',
                            horizontal: true
                        }
                    },
                    grid: {
                        show: true,
                        borderColor: "#ECEEF2"
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: categories,
                        axisTicks: {
                            show: true,
                            color: '#ECEEF2'
                        },
                        axisBorder: {
                            show: true,
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
                        labels: {
                            style: {
                                colors: "#64748B",
                                fontSize: "12px"
                            }
                        },
                        axisBorder: {
                            show: true,
                            color: '#ECEEF2'
                        },
                        axisTicks: {
                            show: true,
                            color: '#ECEEF2'
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: function(val: any) {
                                return val + ' học viên';
                            }
                        }
                    }
                };

                this.chartInstance = new ApexCharts(document.querySelector('#lms_students_interested_topics_chart'), options);
                this.chartInstance.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

    updateChart(series: { name: string; data: number[] }[], categories: string[]): void {
        if (this.chartInstance) {
            this.chartInstance.updateOptions({
                series: series,
                xaxis: {
                    categories: categories
                }
            });
        }
    }

    destroyChart(): void {
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    }
}
