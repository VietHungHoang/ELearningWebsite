import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

/**
 * Top instructor data item
 * Represents a single instructor in the ranking
 */
export interface TopInstructorItem {
    /** Unique instructor ID */
    id: number;
    /** Instructor's full name */
    name: string;
    /** Instructor's avatar/profile image URL */
    image: string;
    /** Average rating (0-5) */
    rating: number;
    /** Total revenue in VND */
    revenue: number;
    /** Total teaching hours in the period */
    hours: number;
    /** Total number of bookings/sessions */
    totalBookings: number;
    /** Computed rank (1-based index) */
    rank?: number;
}

/**
 * Response data for Top Instructors API
 * API Endpoint: GET /api/v1/admin/dashboard/top-instructors
 * Query Params:
 *   - criteria (revenue|rating|bookings) - Ranking criteria
 *   - period (week|month|year|all) - Time period
 *   - limit (number) - Maximum number of instructors to return
 */
export interface TopInstructorsData {
    /** List of top instructors sorted by the specified criteria */
    instructors: TopInstructorItem[];
    /** Total number of instructors matching the criteria */
    total: number;
    /** The criteria used for ranking */
    criteria: 'revenue' | 'rating' | 'bookings';
    /** The time period for the ranking */
    period: 'week' | 'month' | 'year' | 'all';
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
export class TopInstructorsService {

    private apiUrl = `${environment.apiUrl}/v1/admin/dashboard`;

    constructor(private http: HttpClient) { }

    /**
     * Get mock data for Top Instructors when API fails
     */
    private getMockData(criteria: 'revenue' | 'rating' | 'bookings', period: 'week' | 'month' | 'year' | 'all'): TopInstructorsData {
        const mockInstructors: TopInstructorItem[] = [
            { id: 1, name: 'Nguyễn Minh Tuấn', rating: 4.9, revenue: 18000000, totalBookings: 9, image: 'images/users/user13.jpg', hours: 45, rank: 1 },
            { id: 2, name: 'Trần Thị Hương', rating: 4.8, revenue: 15000000, totalBookings: 8, image: 'images/users/user16.jpg', hours: 38, rank: 2 },
            { id: 3, name: 'Lê Hoàng Nam', rating: 4.5, revenue: 12000000, totalBookings: 7, image: 'images/users/user17.jpg', hours: 32, rank: 3 },
            { id: 4, name: 'Phạm Thu Hà', rating: 4.2, revenue: 9000000, totalBookings: 6, image: 'images/users/user18.jpg', hours: 25, rank: 4 },
            { id: 5, name: 'Hoàng Đức Anh', rating: 4.0, revenue: 6000000, totalBookings: 5, image: 'images/users/user19.jpg', hours: 18, rank: 5 }
        ];

        // Sort by criteria
        let sorted = [...mockInstructors];
        switch (criteria) {
            case 'revenue':
                sorted.sort((a, b) => b.revenue - a.revenue);
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'bookings':
                sorted.sort((a, b) => b.totalBookings - a.totalBookings);
                break;
        }

        // Update ranks after sorting
        sorted = sorted.map((instructor, index) => ({ ...instructor, rank: index + 1 }));

        return {
            instructors: sorted,
            total: sorted.length,
            criteria,
            period
        };
    }

    /**
     * Get top instructors data from API
     * @param criteria - Ranking criteria: 'revenue', 'rating', 'bookings'
     * @param period - Time period: 'week', 'month', 'year', 'all'
     * @param limit - Maximum number of instructors to return (default: 5)
     */
    getTopInstructorsData(
        criteria: 'revenue' | 'rating' | 'bookings' = 'revenue',
        period: 'week' | 'month' | 'year' | 'all' = 'month',
        limit: number = 5
    ): Observable<TopInstructorsData> {
        const params = new HttpParams()
            .set('criteria', criteria)
            .set('period', period)
            .set('limit', limit.toString());

        return this.http.get<ApiResponse<TopInstructorsData>>(`${this.apiUrl}/top-instructors`, { params })
            .pipe(
                map(response => {
                    if (response.success && response.data) {
                        // Add rank to each instructor
                        response.data.instructors = response.data.instructors.map((instructor, index) => ({
                            ...instructor,
                            rank: index + 1
                        }));
                        return response.data;
                    }
                    throw new Error(response.message || 'Invalid response');
                }),
                catchError(error => {
                    console.warn('⚠️ Top Instructors API failed, using mock data:', error);
                    return of(this.getMockData(criteria, period));
                })
            );
    }
}
