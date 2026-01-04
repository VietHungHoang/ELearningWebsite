import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18nService } from '../../../i18n/i18n.service';
import { environment } from '../../../../environments/environment';

/**
 * Response data for Completed Sessions API
 * API Endpoint: GET /api/v1/admin/dashboard/completed-sessions
 * Query Params: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
 */
export interface CompletedSessionsData {
    /** Total number of completed learning sessions in the period */
    totalSessions: number;
    /** Growth percentage compared to previous period (can be negative) */
    growthPercentage: number;
    /** Daily breakdown of completed sessions */
    dailyData: {
        /** Date in YYYY-MM-DD format */
        date: string;
        /** Day of week as number (0 = Sunday, 1 = Monday, ..., 6 = Saturday) */
        dayOfWeek: number;
        /** Number of completed sessions on this date */
        sessions: number;
    }[];
}

/** i18n keys for day of week mapping */
export const DAY_OF_WEEK_I18N_KEYS = [
    'dashboard.overview.completedSessions.days.sun',  // 0 - Sunday
    'dashboard.overview.completedSessions.days.mon',  // 1 - Monday
    'dashboard.overview.completedSessions.days.tue',  // 2 - Tuesday
    'dashboard.overview.completedSessions.days.wed',  // 3 - Wednesday
    'dashboard.overview.completedSessions.days.thu',  // 4 - Thursday
    'dashboard.overview.completedSessions.days.fri',  // 5 - Friday
    'dashboard.overview.completedSessions.days.sat',  // 6 - Saturday
];

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
export class OnlineClassesService {

    private isBrowser: boolean;
    private apiUrl = `${environment.apiUrl}/v1/admin/dashboard`;
    private chart: any = null;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private http: HttpClient,
        private i18nService: I18nService
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    /**
     * Get translated day name from dayOfWeek number
     * @param dayOfWeek 0 = Sunday, 1 = Monday, ..., 6 = Saturday
     */
    getDayName(dayOfWeek: number): string {
        const key = DAY_OF_WEEK_I18N_KEYS[dayOfWeek];
        return this.i18nService.translate(key);
    }

    getCompletedSessionsData(startDate?: string, endDate?: string): Observable<CompletedSessionsData> {
        let params = new HttpParams();

        // Default to last 7 days if no dates provided
        if (!startDate || !endDate) {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 6);
            startDate = start.toISOString().split('T')[0];
            endDate = end.toISOString().split('T')[0];
        }

        params = params.set('startDate', startDate);
        params = params.set('endDate', endDate);

        return this.http.get<ApiResponse<CompletedSessionsData>>(`${this.apiUrl}/completed-sessions`, { params })
            .pipe(
                map(response => {
                    if (response.success && response.data) {
                        return response.data;
                    }
                    throw new Error(response.message || 'Invalid response');
                })
            );
    }

    async loadChart(data: CompletedSessionsData): Promise<void> {
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
                            name: "Phiên học",
                            data: data.dailyData.map(d => d.sessions)
                        }
                    ],
                    chart: {
                        height: 150,
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
                        "#605DFF"
                    ],
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            columnWidth: '50%'
                        }
                    },
                    grid: {
                        show: false,
                        borderColor: "#ffffff"
                    },
                    xaxis: {
                        categories: data.dailyData.map(d => this.getDayName(d.dayOfWeek)),
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
                            formatter: function(val: any) {
                                return val + " phiên";
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                };

                const chartElement = document.querySelector('#overview_online_classes_chart');
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
