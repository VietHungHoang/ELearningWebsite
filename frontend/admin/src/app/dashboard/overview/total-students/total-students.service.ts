import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

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
        /** Day name from backend (e.g. "T2", "T3", "CN") */
        dayName: string;
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
    private apiUrl = `${environment.apiUrl}/v1/admin/dashboard`;
    private chart: any = null;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private http: HttpClient
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    getNewStudentsData(startDate?: string, endDate?: string): Observable<NewStudentsData> {
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

        return this.http.get<any>(`${this.apiUrl}/new-students`, { params })
            .pipe(
                map(response => {
                    // Always generate mock data and merge with backend data
                    const mockData = this.generateMockData(startDate!, endDate!);

                    // Handle both wrapped { success, data } and direct response formats
                    const backendData = response.data || response;

                    // If backend has data, merge it with mock data
                    if (backendData && backendData.dailyData && backendData.dailyData.length > 0) {
                        return this.mergeWithBackendData(mockData, backendData);
                    }

                    // Otherwise just return mock data
                    return mockData;
                })
            );
    }

    /**
     * Merge mock data with backend data
     * Backend data takes priority, mock data fills in missing dates
     */
    private mergeWithBackendData(mockData: NewStudentsData, backendData: any): NewStudentsData {
        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

        // Create a map of backend data by date
        const backendMap = new Map<string, number>();
        if (backendData.dailyData) {
            backendData.dailyData.forEach((item: any) => {
                backendMap.set(item.date, item.count || 0);
            });
        }

        // Merge: use backend data if available, otherwise use mock data
        const mergedDailyData = mockData.dailyData.map(mockItem => {
            const backendCount = backendMap.get(mockItem.date);
            return {
                ...mockItem,
                count: backendCount !== undefined ? backendCount : mockItem.count
            };
        });

        const totalNewStudents = mergedDailyData.reduce((sum, d) => sum + d.count, 0);

        return {
            totalNewStudents: totalNewStudents,
            growthPercentage: backendData.growthPercentage || 0,
            dailyData: mergedDailyData
        };
    }

    /**
     * Generate mock data pattern
     * Days 1-4: count = day number (1,2,3,4)
     * Days 5-7: count = 1,2,3
     */
    private generateMockData(startDate: string, endDate: string): NewStudentsData {
        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dailyData: NewStudentsData['dailyData'] = [];

        let dayCounter = 1;
        let current = new Date(start);

        while (current <= end) {
            const dateStr = current.toISOString().split('T')[0];
            const dayName = dayNames[current.getDay()];

            // Days 1-4: count = day number, Days 5-7: count = 1,2,3
            const count = dayCounter <= 4 ? dayCounter : (dayCounter - 4);

            dailyData.push({
                date: dateStr,
                dayName: dayName,
                count: count
            });

            current.setDate(current.getDate() + 1);
            dayCounter++;
        }

        const totalNewStudents = dailyData.reduce((sum, d) => sum + d.count, 0);

        return {
            totalNewStudents: totalNewStudents,
            growthPercentage: 0,
            dailyData: dailyData
        };
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
                            name: "học viên mới",
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
