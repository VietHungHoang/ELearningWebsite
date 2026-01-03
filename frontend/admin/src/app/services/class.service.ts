import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PaginatedResponse } from '../types/pagination';
import { CurrencyService } from './currency.service';

export type ClassStatus = 'upcoming' | 'ongoing' | 'completed' | 'OPENING' | 'CLOSED' | 'CANCELLED' | 'COMPLETED';
export type ClassType = '1-on-1' | '1-on-n' | 'GROUP' | 'ONE_ON_ONE';

// API Response Interface
export interface ClassApiResponse {
  id: string;
  title: string;
  students: any[];
  type: 'GROUP' | 'ONE_ON_ONE';
  status: 'OPENING' | 'CLOSED' | 'CANCELLED' | 'COMPLETED';
  schedules: Array<{
    dayOfWeek: number;
    time: string;
  }>;
  startDate: string;
  completedSessions: number;
  totalSessions: number;
  instructorId?: string;
  instructorName?: string;
  courseId?: string;
  courseName?: string;
}

export interface GroupClass {
  id: string;
  class_name: string;
  class_description?: string;
  class_type: ClassType;
  instructor_id?: string;
  instructor_name?: string;
  course_id?: string;
  course_name?: string;
  start_datetime: Date;
  end_datetime?: Date;
  duration_in_minutes?: number;
  price_per_student?: number;
  max_capacity: number;
  enrollment_count: number;
  platform_fee_percentage?: number;
  status: ClassStatus;
  created_at?: Date;
  // New fields from API
  schedules?: Array<{
    dayOfWeek: number;
    time: string;
  }>;
  completedSessions?: number;
  totalSessions?: number;
  students?: any[]; // Students enrolled in this class
}

export interface StudentEnrollment {
  class_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  registered_at: Date;
}

export interface ClassFinancialReport {
  class_id: string;
  price_per_student: number;
  enrollment_count: number;
  total_revenue: number;
  platform_fee: number;
  instructor_payout: number;
  revenue_per_hour: number;
}

export interface ClassFilters {
  status?: ClassStatus | 'all';
  instructorId?: string | 'all';
  search?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private classesSubject = new BehaviorSubject<GroupClass[]>([]);
  public classes$ = this.classesSubject.asObservable();

  private enrollmentsSubject = new BehaviorSubject<{ [classId: string]: StudentEnrollment[] }>({});
  public enrollments$ = this.enrollmentsSubject.asObservable();

  private mockClasses: GroupClass[] = [];

  constructor(
    private apiService: ApiService,
    private currencyService: CurrencyService
  ) {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockClasses: GroupClass[] = [
      {
        id: 'class_001',
        class_name: 'Angular Advanced Fundamentals - Lớp 1',
        class_description: 'Khóa học nâng cao Angular với các best practices và patterns hiện đại. Bao gồm: Reactive Forms, RxJS Advanced, Change Detection, Dependency Injection.',
        class_type: '1-on-n',
        instructor_id: 'instr_001',
        instructor_name: 'Nguyễn Văn A',
        course_id: 'course_001',
        course_name: 'Angular Advanced',
        start_datetime: new Date('2025-11-15T09:00:00'),
        end_datetime: new Date('2025-11-15T10:30:00'),
        duration_in_minutes: 90,
        price_per_student: 150000,
        max_capacity: 20,
        enrollment_count: 18,
        platform_fee_percentage: 20,
        status: 'upcoming',
        created_at: new Date('2025-10-01')
      },
      {
        id: 'class_002',
        class_name: 'React Hooks & State Management - Lớp 1',
        class_description: 'Khóa học React Hooks từ cơ bản đến nâng cao. Tìm hiểu State, Context API, Custom Hooks, Redux Toolkit và Performance Optimization.',
        class_type: '1-on-1',
        instructor_id: 'instr_002',
        instructor_name: 'Trần Thị B',
        course_id: 'course_002',
        course_name: 'React Pro',
        start_datetime: new Date('2025-11-10T14:00:00'),
        end_datetime: new Date('2025-11-10T15:30:00'),
        duration_in_minutes: 90,
        price_per_student: 140000,
        max_capacity: 25,
        enrollment_count: 22,
        platform_fee_percentage: 20,
        status: 'ongoing',
        created_at: new Date('2025-10-02')
      },
      {
        id: 'class_003',
        class_name: 'TypeScript Mastery - Lớp 1',
        class_description: 'Nắm vững TypeScript từ cơ bản đến các tính năng advanced. Bao gồm: Types, Interfaces, Generics, Decorators, Modules.',
        class_type: '1-on-n',
        instructor_id: 'instr_001',
        instructor_name: 'Nguyễn Văn A',
        course_id: 'course_003',
        course_name: 'TypeScript Pro',
        start_datetime: new Date('2025-11-05T10:00:00'),
        end_datetime: new Date('2025-11-05T11:30:00'),
        duration_in_minutes: 90,
        price_per_student: 130000,
        max_capacity: 30,
        enrollment_count: 28,
        platform_fee_percentage: 20,
        status: 'completed',
        created_at: new Date('2025-09-15')
      },
      {
        id: 'class_004',
        class_name: 'Node.js & Express - Lớp 2',
        class_description: 'Xây dựng RESTful API bằng Node.js và Express. Tìm hiểu Middleware, Routing, Authentication, Database Integration.',
        class_type: '1-on-1',
        instructor_id: 'instr_003',
        instructor_name: 'Lê Văn C',
        course_id: 'course_004',
        course_name: 'Backend Master',
        start_datetime: new Date('2025-11-20T16:00:00'),
        end_datetime: new Date('2025-11-20T17:30:00'),
        duration_in_minutes: 90,
        price_per_student: 160000,
        max_capacity: 20,
        enrollment_count: 15,
        platform_fee_percentage: 20,
        status: 'upcoming',
        created_at: new Date('2025-10-05')
      },
      {
        id: 'class_005',
        class_name: 'Database Design - Lớp 1',
        class_description: 'Thiết kế cơ sở dữ liệu hiệu quả. Bao gồm: Normalization, Index, Query Optimization, SQL Advanced.',
        class_type: '1-on-n',
        instructor_id: 'instr_002',
        instructor_name: 'Trần Thị B',
        course_id: 'course_005',
        course_name: 'Database Pro',
        start_datetime: new Date('2025-11-12T13:00:00'),
        end_datetime: new Date('2025-11-12T14:30:00'),
        duration_in_minutes: 90,
        price_per_student: 120000,
        max_capacity: 25,
        enrollment_count: 20,
        platform_fee_percentage: 20,
        status: 'upcoming',
        created_at: new Date('2025-10-03')
      },
      {
        id: 'class_006',
        class_name: 'Cybersecurity Fundamentals - Lớp 1',
        class_description: 'Nền tảng bảo mật mạng và ứng dụng. Bao gồm: Cryptography, Network Security, Penetration Testing, Security Best Practices.',
        class_type: '1-on-n',
        instructor_id: '1',
        instructor_name: 'Oliver Khan',
        course_id: 'course_006',
        course_name: 'Cybersecurity Pro',
        start_datetime: new Date('2025-11-18T10:00:00'),
        end_datetime: new Date('2025-11-18T11:30:00'),
        duration_in_minutes: 90,
        price_per_student: 180000,
        max_capacity: 25,
        enrollment_count: 20,
        platform_fee_percentage: 20,
        status: 'upcoming',
        created_at: new Date('2025-10-06')
      },
      {
        id: 'class_007',
        class_name: 'Advanced Python Programming - Lớp 1',
        class_description: 'Lập trình Python nâng cao với focus vào performance. Bao gồm: Decorators, Generators, Async/Await, Optimization, Design Patterns.',
        class_type: '1-on-1',
        instructor_id: '1',
        instructor_name: 'Oliver Khan',
        course_id: 'course_007',
        course_name: 'Python Master',
        start_datetime: new Date('2025-11-22T14:00:00'),
        end_datetime: new Date('2025-11-22T15:30:00'),
        duration_in_minutes: 90,
        price_per_student: 170000,
        max_capacity: 1,
        enrollment_count: 1,
        platform_fee_percentage: 20,
        status: 'ongoing',
        created_at: new Date('2025-10-08')
      },
      {
        id: 'class_008',
        class_name: 'Machine Learning Essentials - Lớp 2',
        class_description: 'Giới thiệu Machine Learning từ lý thuyết đến thực hành. Bao gồm: Supervised/Unsupervised Learning, Feature Engineering, Model Evaluation, TensorFlow.',
        class_type: '1-on-n',
        instructor_id: '1',
        instructor_name: 'Oliver Khan',
        course_id: 'course_008',
        course_name: 'ML Fundamentals',
        start_datetime: new Date('2025-11-25T09:00:00'),
        end_datetime: new Date('2025-11-25T10:30:00'),
        duration_in_minutes: 90,
        price_per_student: 200000,
        max_capacity: 20,
        enrollment_count: 16,
        platform_fee_percentage: 20,
        status: 'upcoming',
        created_at: new Date('2025-10-10')
      }
    ];

    this.mockClasses = mockClasses;
    this.classesSubject.next(mockClasses);

    const mockEnrollments: { [classId: string]: StudentEnrollment[] } = {
      class_001: [
        { class_id: 'class_001', student_id: 'std_001', student_name: 'Phạm Minh Đức', student_email: 'duc@example.com', registered_at: new Date('2025-10-20') },
        { class_id: 'class_001', student_id: 'std_002', student_name: 'Hoàng Thu Hương', student_email: 'huong@example.com', registered_at: new Date('2025-10-21') },
        { class_id: 'class_001', student_id: 'std_003', student_name: 'Võ Thành Long', student_email: 'long@example.com', registered_at: new Date('2025-10-22') }
      ],
      class_002: [
        { class_id: 'class_002', student_id: 'std_004', student_name: 'Ngô Hải Nam', student_email: 'nam@example.com', registered_at: new Date('2025-10-18') },
        { class_id: 'class_002', student_id: 'std_005', student_name: 'Dương Minh Châu', student_email: 'chau@example.com', registered_at: new Date('2025-10-19') }
      ],
      class_003: [
        { class_id: 'class_003', student_id: 'std_006', student_name: 'Bùi Quốc Hùng', student_email: 'hung@example.com', registered_at: new Date('2025-09-20') }
      ],
      class_004: [
        { class_id: 'class_004', student_id: 'std_007', student_name: 'Trần Khánh Linh', student_email: 'linh@example.com', registered_at: new Date('2025-10-25') }
      ],
      class_005: [
        { class_id: 'class_005', student_id: 'std_008', student_name: 'Lý Thị Phương Thảo', student_email: 'thao@example.com', registered_at: new Date('2025-10-24') }
      ],
      class_006: [
        { class_id: 'class_006', student_id: 'std_009', student_name: 'Mạc Gia Bảo', student_email: 'bao@example.com', registered_at: new Date('2025-10-26') },
        { class_id: 'class_006', student_id: 'std_010', student_name: 'Phan Thị Thanh Tuyền', student_email: 'tuyen@example.com', registered_at: new Date('2025-10-27') },
        { class_id: 'class_006', student_id: 'std_011', student_name: 'Vũ Minh Khánh', student_email: 'khanh@example.com', registered_at: new Date('2025-10-28') },
        { class_id: 'class_006', student_id: 'std_012', student_name: 'Đinh Văn Hải', student_email: 'hai@example.com', registered_at: new Date('2025-10-29') }
      ],
      class_007: [
        { class_id: 'class_007', student_id: 'std_013', student_name: 'Nguyễn Hữu Tuấn', student_email: 'tuan@example.com', registered_at: new Date('2025-11-01') }
      ],
      class_008: [
        { class_id: 'class_008', student_id: 'std_014', student_name: 'Cao Thị Lan Anh', student_email: 'lananh@example.com', registered_at: new Date('2025-10-30') },
        { class_id: 'class_008', student_id: 'std_015', student_name: 'Đỗ Quang Vinh', student_email: 'vinh@example.com', registered_at: new Date('2025-11-02') },
        { class_id: 'class_008', student_id: 'std_016', student_name: 'Tạ Thị Mỹ Tiên', student_email: 'tien@example.com', registered_at: new Date('2025-11-03') }
      ]
    };

    this.enrollmentsSubject.next(mockEnrollments);
  }

  /**
   * Get paginated classes with filters
   * @param page Page number (0-based)
   * @param size Page size
   * @param filters Filter options
   * @returns Observable of paginated classes
   */
  getClasses(page: number = 0, size: number = 10, filters?: ClassFilters): Observable<PaginatedResponse<GroupClass>> {
    const params: any = {
      page,
      size
    };

    if (filters) {
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }
      if (filters.instructorId && filters.instructorId !== 'all') {
        params.instructorId = filters.instructorId;
      }
      if (filters.search && filters.search.trim()) {
        params.search = filters.search.trim();
      }
      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }
    }

    return this.apiService.get<PaginatedResponse<ClassApiResponse>>('/classes', params).pipe(
      map(response => {
        if (response.success && response.data) {
          // Map API response to GroupClass format
          const classes: GroupClass[] = response.data.content.map((apiClass: ClassApiResponse) => {
            // Map type
            let classType: ClassType = '1-on-n';
            if (apiClass.type === 'ONE_ON_ONE') {
              classType = '1-on-1';
            } else if (apiClass.type === 'GROUP') {
              classType = '1-on-n';
            }

            // Map status
            let status: ClassStatus = 'upcoming';
            if (apiClass.status === 'OPENING') {
              status = 'ongoing';
            } else if (apiClass.status === 'CLOSED' || apiClass.status === 'COMPLETED') {
              status = 'completed';
            } else if (apiClass.status === 'CANCELLED') {
              status = 'completed'; // or create new status
            }

            // Parse startDate
            const startDate = apiClass.startDate ? new Date(apiClass.startDate) : new Date();
            
            // Calculate enrollment from students array
            const enrollmentCount = apiClass.students ? apiClass.students.length : 0;
            // For max_capacity, we might need to get from API or use a default
            // For now, use enrollmentCount + some buffer or get from API if available
            const maxCapacity = enrollmentCount > 0 ? enrollmentCount + 10 : 20; // Default fallback

            return {
              id: apiClass.id,
              class_name: apiClass.title || '',
              class_description: '',
              class_type: classType,
              instructor_id: apiClass.instructorId || '',
              instructor_name: apiClass.instructorName || 'N/A',
              course_id: apiClass.courseId || '',
              course_name: apiClass.courseName || '',
              start_datetime: startDate,
              end_datetime: undefined,
              duration_in_minutes: undefined,
              price_per_student: undefined,
              max_capacity: maxCapacity,
              enrollment_count: enrollmentCount,
              platform_fee_percentage: undefined,
              status: status,
              created_at: undefined,
              schedules: apiClass.schedules,
              completedSessions: apiClass.completedSessions,
              totalSessions: apiClass.totalSessions,
              students: apiClass.students || [] // Keep students array for enrollment counting
            };
          });

          return {
            ...response.data,
            content: classes
          };
        }
        console.warn('[ClassService] API failed, returning mock data:', response.message);
        return this.getMockPaginatedResponse(page, size, filters);
      }),
      catchError(error => {
        console.error('[ClassService] API error, returning mock data:', error);
        return of(this.getMockPaginatedResponse(page, size, filters));
      })
    );
  }

  /**
   * Get all classes (for backward compatibility, uses first page with large size)
   * @deprecated Use getClasses() instead
   */
  getAllClasses(): Observable<GroupClass[]> {
    return this.getClasses(0, 1000).pipe(
      map(response => response.content)
    );
  }

  getClassById(classId: string): Observable<GroupClass | undefined> {
    const classes = this.classesSubject.value;
    return of(classes.find(c => c.id === classId));
  }

  getClassesByStatus(status: ClassStatus): Observable<GroupClass[]> {
    const classes = this.classesSubject.value;
    return of(classes.filter(c => c.status === status));
  }

  getClassesByInstructor(instructorId: string): Observable<GroupClass[]> {
    const classes = this.classesSubject.value;
    return of(classes.filter(c => c.instructor_id === instructorId));
  }

  getClassesByDateRange(startDate: Date, endDate: Date): Observable<GroupClass[]> {
    const classes = this.classesSubject.value;
    return of(
      classes.filter(c => {
        const classDate = new Date(c.start_datetime);
        return classDate >= startDate && classDate <= endDate;
      })
    );
  }

  searchClassesByName(query: string): Observable<GroupClass[]> {
    const classes = this.classesSubject.value;
    if (!query.trim()) {
      return of(classes);
    }
    const lowerQuery = query.toLowerCase();
    return of(classes.filter(c => c.class_name.toLowerCase().includes(lowerQuery)));
  }

  getClassEnrollments(classId: string): Observable<StudentEnrollment[]> {
    const enrollments = this.enrollmentsSubject.value[classId] || [];
    return of(enrollments);
  }

  calculateFinancialReport(classId: string): Observable<ClassFinancialReport> {
    const groupClass = this.classesSubject.value.find(c => c.id === classId);

    if (!groupClass) {
      return of({
        class_id: classId,
        price_per_student: 0,
        enrollment_count: 0,
        total_revenue: 0,
        platform_fee: 0,
        instructor_payout: 0,
        revenue_per_hour: 0
      });
    }

    const pricePerStudent = groupClass.price_per_student || 0;
    const platformFeePercentage = groupClass.platform_fee_percentage || 0;
    const durationInMinutes = groupClass.duration_in_minutes || 0;

    const totalRevenue = pricePerStudent * groupClass.enrollment_count;
    const platformFee = totalRevenue * (platformFeePercentage / 100);
    const instructorPayout = totalRevenue - platformFee;
    const durationInHours = durationInMinutes / 60;
    const revenuePerHour = durationInHours > 0 ? totalRevenue / durationInHours : 0;

    return of({
      class_id: classId,
      price_per_student: pricePerStudent,
      enrollment_count: groupClass.enrollment_count,
      total_revenue: totalRevenue,
      platform_fee: platformFee,
      instructor_payout: instructorPayout,
      revenue_per_hour: revenuePerHour
    });
  }


  /**
   * Get mock paginated response
   */
  private getMockPaginatedResponse(page: number, size: number, filters?: ClassFilters): PaginatedResponse<GroupClass> {
    let filtered = [...this.mockClasses];

    // Apply filters
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(c => c.status === filters.status);
      }
      if (filters.instructorId && filters.instructorId !== 'all') {
        filtered = filtered.filter(c => c.instructor_id === filters.instructorId);
      }
      if (filters.search && filters.search.trim()) {
        const lowerQuery = filters.search.toLowerCase();
        filtered = filtered.filter(c =>
          c.class_name.toLowerCase().includes(lowerQuery) ||
          (c.instructor_name && c.instructor_name.toLowerCase().includes(lowerQuery)) ||
          (c.course_name && c.course_name.toLowerCase().includes(lowerQuery))
        );
      }
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        filtered = filtered.filter(c => new Date(c.start_datetime) >= startDate);
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(c => new Date(c.start_datetime) <= endDate);
      }
    }

    // Paginate
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filtered.slice(startIndex, endIndex);

    return {
      content,
      pageable: {
        pageNumber: page,
        pageSize: size,
        offset: startIndex,
        paged: true
      },
      totalPages,
      totalElements,
      last: page >= totalPages - 1,
      first: page === 0,
      numberOfElements: content.length,
      size,
      number: page,
      empty: content.length === 0
    };
  }

  determineClassStatus(startDate: Date, endDate: Date): ClassStatus {
    const now = new Date();
    if (now < startDate) {
      return 'upcoming';
    } else if (now >= startDate && now <= endDate) {
      return 'ongoing';
    } else {
      return 'completed';
    }
  }

  searchClasses(query: string): Observable<GroupClass[]> {
    const classes = this.classesSubject.value;
    const lowerQuery = query.toLowerCase();
    const filtered = classes.filter(c =>
      c.class_name.toLowerCase().includes(lowerQuery) ||
      (c.course_name && c.course_name.toLowerCase().includes(lowerQuery)) ||
      (c.instructor_name && c.instructor_name.toLowerCase().includes(lowerQuery))
    );
    return of(filtered);
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} giờ`;
    }
    return `${hours}h ${mins}m`;
  }

  getStudentEnrollments(studentId: string): Observable<StudentEnrollment[]> {
    const enrollments = Object.entries(this.enrollmentsSubject.value)
      .filter(([classId, students]) => students.some(s => s.student_id === studentId))
      .map(([classId, students]) => students.find(s => s.student_id === studentId)!)
      .filter(enrollment => enrollment !== undefined);
    return of(enrollments);
  }

  formatCurrency(amount: number): string {
    // Assuming prices are stored in VND by default
    return this.currencyService.format(amount, 'VND');
  }

  updateClassStatus(classId: string, newStatus: ClassStatus): void {
    const classes = this.classesSubject.value;
    const classIndex = classes.findIndex(c => c.id === classId);
    if (classIndex !== -1) {
      classes[classIndex].status = newStatus;
      this.classesSubject.next([...classes]);
    }
  }

  formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }
}
