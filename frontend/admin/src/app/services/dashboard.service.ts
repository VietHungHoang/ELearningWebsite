import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DashboardSummary,
  RecentBooking,
  ApiResponse
} from '../types/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8081/api/v1/admin/dashboard';

  // BehaviorSubjects for real-time updates
  private dashboardSummary$ = new BehaviorSubject<DashboardSummary | null>(null);

  constructor(private http: HttpClient) {}

  // Main dashboard summary API
  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<ApiResponse<DashboardSummary>>(`${this.apiUrl}/summary`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            console.log('✅ Dashboard API success:', response.data);
            this.dashboardSummary$.next(response.data);
            return response.data;
          }
          throw new Error(response.message || 'Invalid API response');
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
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error('Invalid response');
      })
    );
  }

  // Observable getters for components
  get dashboardSummary() {
    return this.dashboardSummary$.asObservable();
  }
}
