// Dashboard interfaces
export interface DashboardSummary {
  pendingApprovals: PendingApprovalsData;
  topInstructors: TopInstructor[];
  recentBookings: RecentBooking[];
}

export interface PendingApprovalsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  percentage: number;
}

export interface TopInstructor {
  id: number;
  name: string;
  rating: number;
  revenue: number;
  totalBookings: number;
  image: string;
  rank?: number;
  hours?: number;
}

export interface RecentBooking {
  id: string;
  learnerName: string;
  instructorName: string;
  subject: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  type: '1-1' | '1-n';
  learnerCount?: number;
  learnerAvatar?: string;
  instructorAvatar?: string;
  date?: string;
  time?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Popular Subjects interface
export interface PopularSubject {
  subject: string;
  instructors: number;
  studentCount?: number;
}

// Dashboard filter types
export type RankingCriteria = 'revenue' | 'rating' | 'bookings';
export type TimePeriod = 'week' | 'month' | 'year' | 'all' | 'Last 2 Months' | 'Last 4 Months' | 'Last 6 Months' | 'Last 8 Months' | 'Last 10 Months' | 'Last 12 Months';
