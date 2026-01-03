import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  DashboardSummary,
  RecentBooking,
  ApiResponse
} from '../types/dashboard';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/v1/admin/dashboard`;

  // BehaviorSubjects for real-time updates
  private dashboardSummary$ = new BehaviorSubject<DashboardSummary | null>(null);

  constructor(private http: HttpClient) {}

  // Main dashboard summary API
  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<ApiResponse<DashboardSummary>>(`${this.apiUrl}/summary`)
      .pipe(
        map(response => {
          // ✅ ƯU TIÊN: Xử lý data thật từ API
          if (response.success && response.data) {
            console.log('✅ Dashboard API success:', response.data);
            this.dashboardSummary$.next(response.data);
            return response.data;
          }
          // ⚠️ FALLBACK: Chỉ khi API trả về success=false
          console.warn('[DashboardService] API failed, returning mock data:', response.message);
          return this.getMockDashboardSummary();
        }),
        catchError(error => {
          // ⚠️ FALLBACK: Chỉ khi API throw exception (network error, timeout)
          console.error('[DashboardService] API error, returning mock data:', error);
          return of(this.getMockDashboardSummary());
        })
      );
  }

  /**
   * Get recent bookings list
   * API Endpoint: GET /api/v1/admin/dashboard/recent-bookings
   * @param limit - Maximum number of bookings to return
   */
  getRecentBookingsFull(limit: number = 20): Observable<RecentBooking[]> {
    const params = new HttpParams().set('limit', limit.toString());

    return this.http.get<ApiResponse<RecentBooking[]>>(
      `${this.apiUrl}/recent-bookings`,
      { params }
    ).pipe(
      map(response => {
        // ✅ ƯU TIÊN: Xử lý data thật từ API
        if (response.success && response.data) {
          return response.data;
        }
        // ⚠️ FALLBACK: Chỉ khi API trả về success=false
        console.warn('[DashboardService] API failed for recent bookings, returning mock data:', response.message);
        return this.getMockRecentBookings(limit);
      }),
      catchError(error => {
        // ⚠️ FALLBACK: Chỉ khi API throw exception (network error, timeout)
        console.error('[DashboardService] API error for recent bookings, returning mock data:', error);
        return of(this.getMockRecentBookings(limit));
      })
    );
  }

  /**
   * Get mock dashboard summary for fallback
   */
  private getMockDashboardSummary(): DashboardSummary {
    return {
      pendingApprovals: {
        total: 25,
        pending: 8,
        approved: 15,
        rejected: 2,
        percentage: 32
      },
      topInstructors: [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          rating: 4.9,
          revenue: 150000000,
          totalBookings: 245,
          image: 'images/users/user13.jpg'
        }
      ],
      recentBookings: this.getMockRecentBookings(5)
    };
  }

  /**
   * Get mock recent bookings for fallback
   */
  private getMockRecentBookings(limit: number = 20): RecentBooking[] {
    const mockBookings: RecentBooking[] = [
      {
        id: '1',
        learnerName: 'Sarah Johnson',
        instructorName: 'Oliver Khan',
        subject: 'English Conversation',
        status: 'Completed' as const,
        type: '1-1' as const,
        learnerCount: 1,
        learnerAvatar: 'images/users/user11.jpg',
        instructorAvatar: 'images/users/user6.jpg',
        date: 'Dec 11, 2025',
        time: '2:00 PM - 3:00 PM'
      }
    ];
    return mockBookings.slice(0, limit);
  }

  // Observable getters for components
  get dashboardSummary() {
    return this.dashboardSummary$.asObservable();
  }
}
