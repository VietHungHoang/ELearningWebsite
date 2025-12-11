import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {
  DashboardSummary,
  PendingApprovalsData,
  TopInstructor,
  RecentBooking,
  PopularSubject,
  ApiResponse,
  RankingCriteria,
  TimePeriod
} from '../types/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api/dashboard';

  // BehaviorSubjects for real-time updates
  private dashboardSummary$ = new BehaviorSubject<DashboardSummary | null>(null);

  // Mock data as fallback
  private mockDashboardSummary: DashboardSummary = {
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
        image: 'images/users/user13.jpg',
        hours: 120
      },
      {
        id: 2,
        name: 'Trần Thị B',
        rating: 4.8,
        revenue: 120000000,
        totalBookings: 180,
        image: 'images/users/user16.jpg',
        hours: 95
      },
      {
        id: 3,
        name: 'Lê Văn C',
        rating: 4.5,
        revenue: 90000000,
        totalBookings: 156,
        image: 'images/users/user17.jpg',
        hours: 78
      }
    ],
    recentBookings: [
      {
        id: '1',
        learnerName: 'Sarah Johnson',
        learnerAvatar: 'images/users/user11.jpg',
        instructorName: 'Oliver Khan',
        instructorAvatar: 'images/users/user6.jpg',
        subject: 'English Conversation',
        date: 'Dec 11, 2025',
        time: '2:00 PM - 3:00 PM',
        status: 'Completed',
        type: '1-1'
      },
      {
        id: '2',
        learnerName: 'Group Class',
        learnerAvatar: 'images/users/user12.jpg',
        instructorName: 'Ava Cooper',
        instructorAvatar: 'images/users/user7.jpg',
        subject: 'Python Programming',
        date: 'Dec 11, 2025',
        time: '4:00 PM - 5:00 PM',
        status: 'Upcoming',
        type: '1-n',
        learnerCount: 5
      },
      {
        id: '3',
        learnerName: 'Emma Wilson',
        learnerAvatar: 'images/users/user13.jpg',
        instructorName: 'James Wilson',
        instructorAvatar: 'images/users/user8.jpg',
        subject: 'Spanish Grammar',
        date: 'Dec 10, 2025',
        time: '10:00 AM - 11:00 AM',
        status: 'Completed',
        type: '1-1'
      }
    ]
  };

  constructor(private http: HttpClient) {}

  // Main dashboard summary API with fallback
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
        }),
        catchError(error => {
          console.warn('⚠️ Dashboard API failed, using mock data:', error);
          // Fallback to mock data
          this.dashboardSummary$.next(this.mockDashboardSummary);
          return of(this.mockDashboardSummary);
        })
      );
  }

  // Detailed APIs with fallbacks
  getTopInstructorsFull(
    criteria: RankingCriteria = 'revenue',
    period: TimePeriod = 'month',
    limit: number = 10
  ): Observable<TopInstructor[]> {
    const params = new HttpParams()
      .set('criteria', criteria)
      .set('period', period)
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<TopInstructor[]>>(
      `${this.apiUrl}/top-instructors-full`,
      { params }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error('Invalid response');
      }),
      catchError(error => {
        console.warn('⚠️ Top instructors API failed, using mock data');
        // Return extended mock data
        return of(this.getExtendedMockInstructors(criteria));
      })
    );
  }

  getRecentBookingsFull(limit: number = 20): Observable<RecentBooking[]> {
    const params = new HttpParams().set('limit', limit.toString());

    return this.http.get<ApiResponse<RecentBooking[]>>(
      `${this.apiUrl}/recent-bookings-full`,
      { params }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error('Invalid response');
      }),
      catchError(error => {
        console.warn('⚠️ Recent bookings API failed, using mock data');
        return of(this.getExtendedMockBookings());
      })
    );
  }

  getPopularSubjects(period: TimePeriod = 'month'): Observable<PopularSubject[]> {
    const params = new HttpParams().set('period', period);

    return this.http.get<ApiResponse<PopularSubject[]>>(
      `${this.apiUrl}/popular-subjects`,
      { params }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error('Invalid response');
      }),
      catchError(error => {
        console.warn('⚠️ Popular subjects API failed, using mock data');
        return of(this.getMockPopularSubjects());
      })
    );
  }

  // Separate method for pending approvals if needed
  getPendingApprovals(): Observable<PendingApprovalsData> {
    return this.http.get<ApiResponse<PendingApprovalsData>>(`${this.apiUrl}/pending-approvals`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error('Invalid response');
        }),
        catchError(error => {
          console.warn('⚠️ Pending approvals API failed, using mock data');
          return of(this.mockDashboardSummary.pendingApprovals);
        })
      );
  }

  // Observable getters for components
  get dashboardSummary() {
    return this.dashboardSummary$.asObservable();
  }

  // Mock data generators
  private getExtendedMockInstructors(criteria: RankingCriteria): TopInstructor[] {
    const allInstructors: TopInstructor[] = [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        rating: 4.9,
        revenue: 150000000,
        totalBookings: 245,
        image: 'images/users/user13.jpg',
        hours: 120
      },
      {
        id: 2,
        name: 'Trần Thị B',
        rating: 4.8,
        revenue: 120000000,
        totalBookings: 180,
        image: 'images/users/user16.jpg',
        hours: 95
      },
      {
        id: 3,
        name: 'Lê Văn C',
        rating: 4.5,
        revenue: 90000000,
        totalBookings: 156,
        image: 'images/users/user17.jpg',
        hours: 78
      },
      {
        id: 4,
        name: 'Phạm Thị D',
        rating: 4.2,
        revenue: 85000000,
        totalBookings: 132,
        image: 'images/users/user18.jpg',
        hours: 65
      },
      {
        id: 5,
        name: 'Hoàng Văn E',
        rating: 4.0,
        revenue: 75000000,
        totalBookings: 98,
        image: 'images/users/user19.jpg',
        hours: 52
      }
    ];

    // Sort by criteria
    return allInstructors.sort((a, b) => {
      switch (criteria) {
        case 'revenue':
          return b.revenue - a.revenue;
        case 'rating':
          return b.rating - a.rating;
        case 'bookings':
          return b.totalBookings - a.totalBookings;
        default:
          return 0;
      }
    });
  }

  private getExtendedMockBookings(): RecentBooking[] {
    return [
      {
        id: '1',
        learnerName: 'Sarah Johnson',
        learnerAvatar: 'images/users/user11.jpg',
        instructorName: 'Oliver Khan',
        instructorAvatar: 'images/users/user6.jpg',
        subject: 'English Conversation',
        date: 'Dec 11, 2025',
        time: '2:00 PM - 3:00 PM',
        status: 'Completed',
        type: '1-1'
      },
      {
        id: '2',
        learnerName: 'Group Class',
        learnerAvatar: 'images/users/user12.jpg',
        instructorName: 'Ava Cooper',
        instructorAvatar: 'images/users/user7.jpg',
        subject: 'Python Programming',
        date: 'Dec 11, 2025',
        time: '4:00 PM - 5:00 PM',
        status: 'Upcoming',
        type: '1-n',
        learnerCount: 5
      },
      {
        id: '3',
        learnerName: 'Emma Wilson',
        learnerAvatar: 'images/users/user13.jpg',
        instructorName: 'James Wilson',
        instructorAvatar: 'images/users/user8.jpg',
        subject: 'Spanish Grammar',
        date: 'Dec 10, 2025',
        time: '10:00 AM - 11:00 AM',
        status: 'Completed',
        type: '1-1'
      },
      {
        id: '4',
        learnerName: 'Group Class',
        learnerAvatar: 'images/users/user14.jpg',
        instructorName: 'Emma Davis',
        instructorAvatar: 'images/users/user9.jpg',
        subject: 'Web Development',
        date: 'Dec 12, 2025',
        time: '3:00 PM - 4:00 PM',
        status: 'Upcoming',
        type: '1-n',
        learnerCount: 8
      },
      {
        id: '5',
        learnerName: 'Lisa Anderson',
        learnerAvatar: 'images/users/user15.jpg',
        instructorName: 'Michael Brown',
        instructorAvatar: 'images/users/user10.jpg',
        subject: 'React Development',
        date: 'Dec 9, 2025',
        time: '1:00 PM - 2:00 PM',
        status: 'Completed',
        type: '1-1'
      }
    ];
  }

  private getMockPopularSubjects(): PopularSubject[] {
    return [
      { subject: 'English', instructors: 12, studentCount: 245 },
      { subject: 'Spanish', instructors: 18, studentCount: 189 },
      { subject: 'Math', instructors: 9, studentCount: 156 },
      { subject: 'Programming', instructors: 15, studentCount: 298 },
      { subject: 'French', instructors: 8, studentCount: 134 },
      { subject: 'Music', instructors: 20, studentCount: 167 }
    ];
  }
}
