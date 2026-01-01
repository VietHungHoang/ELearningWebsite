import apiService from './apiService';
import type {Student, ApiResponse, PaginatedResponse, StudentListItem} from '../types/api';
import type { Booking } from '../features/dashboard/student/types';

const mockStudents: StudentListItem[] = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        fullName: 'Nguyễn Thị Lan',
        avatarUrl: 'https://picsum.photos/seed/sarah/48/48',
        registeredDate: '15 Thg 10, 2025',
        email: 'nguyen.lan@example.com',
        enrollmentTypes: ['1-on-1', 'Trial'],
        status: 'Ongoing'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        fullName: 'Trần Thị Mai',
        avatarUrl: 'https://picsum.photos/seed/ann/48/48',
        registeredDate: '12 Thg 10, 2025',
        email: 'tran.mai@example.com',
        enrollmentTypes: ['Group'],
        status: 'Ongoing'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        fullName: 'Lê Văn Đức',
        avatarUrl: 'https://picsum.photos/seed/judy/48/48',
        registeredDate: '10 Thg 10, 2025',
        email: 'le.duc@example.com',
        enrollmentTypes: ['Trial'],
        status: 'Completed'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        fullName: 'Phạm Minh Quang',
        avatarUrl: 'https://picsum.photos/seed/michael/48/48',
        registeredDate: '08 Thg 10, 2025',
        email: 'pham.quang@example.com',
        enrollmentTypes: ['Group', '1-on-1'],
        status: 'Ongoing'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        fullName: 'Hoàng Thị Hương',
        avatarUrl: 'https://picsum.photos/seed/jessica/48/48',
        registeredDate: '05 Thg 10, 2025',
        email: 'hoang.huong@example.com',
        enrollmentTypes: ['Trial'],
        status: 'Completed'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440005',
        fullName: 'Vũ Văn Sơn',
        avatarUrl: 'https://picsum.photos/seed/david/48/48',
        registeredDate: '01 Thg 10, 2025',
        email: 'vu.son@example.com',
        enrollmentTypes: ['1-on-1'],
        status: 'Ongoing'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440006',
        fullName: 'Đỗ Thị Linh',
        avatarUrl: 'https://picsum.photos/seed/emma/48/48',
        registeredDate: '28 Thg 9, 2025',
        email: 'do.linh@example.com',
        enrollmentTypes: ['Group', 'Trial'],
        status: 'Ongoing'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440007',
        fullName: 'Bùi Văn Khánh',
        avatarUrl: 'https://picsum.photos/seed/james/48/48',
        registeredDate: '25 Thg 9, 2025',
        email: 'bui.khanh@example.com',
        enrollmentTypes: ['1-on-1'],
        status: 'Completed'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440008',
        fullName: 'Cao Thị Thảo',
        avatarUrl: 'https://picsum.photos/seed/olivia/48/48',
        registeredDate: '22 Thg 9, 2025',
        email: 'cao.thao@example.com',
        enrollmentTypes: ['Trial'],
        status: 'Ongoing'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440009',
        fullName: 'Trịnh Văn Tuấn',
        avatarUrl: 'https://picsum.photos/seed/william/48/48',
        registeredDate: '20 Thg 9, 2025',
        email: 'trinh.tuan@example.com',
        enrollmentTypes: ['Group'],
        status: 'Ongoing'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440010',
        fullName: 'Tạ Thị Ngọc',
        avatarUrl: 'https://picsum.photos/seed/sophia/48/48',
        registeredDate: '18 Thg 9, 2025',
        email: 'ta.ngoc@example.com',
        enrollmentTypes: ['1-on-1', 'Group'],
        status: 'Ongoing'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440011',
        fullName: 'Đinh Văn Minh',
        avatarUrl: 'https://picsum.photos/seed/benjamin/48/48',
        registeredDate: '15 Thg 9, 2025',
        email: 'dinh.minh@example.com',
        enrollmentTypes: ['Trial'],
        status: 'Completed'
    },
];

export interface StudentFilters {
    status?: 'Ongoing' | 'Completed';
    enrollmentType?: '1-on-1' | 'Group' | 'Trial';
    search?: string;
    page?: number;
    size?: number;
}

export const studentService = {
    getStudentsByTutorId: async (tutorId: string, filters?: StudentFilters): Promise<ApiResponse<PaginatedResponse<StudentListItem>>> => {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.status) queryParams.append('status', filters.status);
            if (filters?.enrollmentType) queryParams.append('enrollmentType', filters.enrollmentType);
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.size) queryParams.append('size', filters.size.toString());

            const url = `/v1/public/tutors/${tutorId}/students${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await apiService.get<PaginatedResponse<StudentListItem>>(url);

            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data
            };
        } catch (error) {
            console.warn('Failed to fetch students from API, using mock data:', error);

            // Apply filters to mock data
            let filtered = [...mockStudents];

            if (filters?.status) {
                filtered = filtered.filter(student => student.status === filters.status);
            }

            if (filters?.enrollmentType) {
                filtered = filtered.filter(student =>
                    student.enrollmentTypes.includes(filters.enrollmentType!)
                );
            }

            if (filters?.search) {
                const searchTerm = filters.search.toLowerCase();
                filtered = filtered.filter(student =>
                    student.fullName.toLowerCase().includes(searchTerm) ||
                    student.email.toLowerCase().includes(searchTerm)
                );
            }

            // Pagination logic
            const pageNumber = (filters?.page || 1) - 1;
            const pageSize = filters?.size || 10;
            const totalElements = filtered.length;
            const totalPages = Math.ceil(totalElements / pageSize);
            const offset = pageNumber * pageSize;
            const startIndex = offset;
            const endIndex = startIndex + pageSize;
            const content = filtered.slice(startIndex, endIndex);

            return {
                status: 200,
                success: true,
                message: 'Students retrieved successfully (mock data)',
                data: {
                    content,
                    pageable: {
                        pageNumber,
                        pageSize,
                        offset,
                        paged: true
                    },
                    totalPages,
                    totalElements,
                    last: pageNumber === totalPages - 1,
                    first: pageNumber === 0,
                    numberOfElements: content.length,
                    size: pageSize,
                    number: pageNumber,
                    empty: content.length === 0
                }
            };
        }
    },

    getStudentById: async (tutorId: string, studentId: string): Promise<ApiResponse<Student>> => {
        try {
            const response = await apiService.get<Student>(`/tutors/${tutorId}/students/${studentId}`);
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data
            };
        } catch (error) {
            console.warn('Failed to fetch student from API, using mock data:', error);
            const student = mockStudents.find(s => s.id === studentId);

            if (!student) {
                return {
                    status: 404,
                    success: false,
                    message: 'Student not found',
                    data: null as any
                };
            }

            return {
                status: 200,
                success: true,
                message: 'Student retrieved successfully (mock data)',
                data: student
            };
        }
    },

    getStudentDetail: async (tutorId: string, studentId: string): Promise<ApiResponse<import('../types/api').StudentDetail>> => {
        try {
            const response = await apiService.get<import('../types/api').StudentDetail>(`/tutors/${tutorId}/students/${studentId}/detail`);
            return {
                status: response.status,
                success: response.success,
                message: response.message,
                data: response.data
            };
        } catch (error) {
            console.warn('Failed to fetch student detail from API, using mock data:', error);
            const student = mockStudents.find(s => s.id === studentId);

            if (!student) {
                return {
                    status: 404,
                    success: false,
                    message: 'Student not found',
                    data: null as any
                };
            }

            // Mock detailed data extending the basic student info
            const mockDetail: import('../types/api').StudentDetail = {
                ...student,
                stats: {
                    sessionsCompleted: 8,
                    totalSessions: 10,
                    sessionsRemaining: 2,
                    completionRate: 80,
                    attendanceRate: 95,
                    lastSessionDate: '2025-11-18',
                },
                contact: {
                    phone: '+84 912 345 678',
                    joinedDate: student.registeredDate,
                },
                class: {
                    name: 'Toán Nâng cao A1',
                    instructor: 'Bạn',
                    schedule: 'Thứ Hai, Thứ Tư, Thứ Sáu - 15:00',
                },
                payment: {
                    status: 'Đã thanh toán',
                    nextDueDate: '2025-12-01',
                    totalPaid: '5.760.000 VND',
                },
                upcomingSessions: [
                    {
                        id: '550e8400-e29b-41d4-a716-446655440020',
                        date: '2025-11-22',
                        time: '15:00',
                        duration: '60 phút',
                        topic: 'Giới thiệu Giải tích'
                    },
                    {
                        id: '550e8400-e29b-41d4-a716-446655440021',
                        date: '2025-11-24',
                        time: '15:00',
                        duration: '60 phút',
                        topic: 'Luyện tập Đạo hàm'
                    },
                    {
                        id: '550e8400-e29b-41d4-a716-446655440022',
                        date: '2025-11-26',
                        time: '15:00',
                        duration: '60 phút',
                        topic: 'Cơ bản về Tích phân'
                    },
                ],
                sessionHistory: [
                    {
                        id: '550e8400-e29b-41d4-a716-446655440030',
                        date: '2025-11-18',
                        duration: '60 phút',
                        attendance: 'Có mặt',
                        topic: 'Phương trình bậc hai'
                    },
                    {
                        id: '550e8400-e29b-41d4-a716-446655440031',
                        date: '2025-11-15',
                        duration: '60 phút',
                        attendance: 'Có mặt',
                        topic: 'Hàm số tuyến tính'
                    },
                    {
                        id: '550e8400-e29b-41d4-a716-446655440032',
                        date: '2025-11-13',
                        duration: '60 phút',
                        attendance: 'Muộn (10 phút)',
                        topic: 'Đa thức'
                    },
                    {
                        id: '550e8400-e29b-41d4-a716-446655440033',
                        date: '2025-11-11',
                        duration: '60 phút',
                        attendance: 'Có mặt',
                        topic: 'Ôn tập Phân tích nhân tử'
                    },
                ],
                courses: [
                    {title: 'Toán học Nâng cao', progress: 75, type: '1-on-1'},
                    {title: 'Hội thảo Vật lý', progress: 60, type: 'Group'},
                    {title: 'Hóa học Cơ bản', progress: 90, type: 'Trial'},
                ],
                performance: {
                    testScores: [85, 92, 88, 95, 90],
                    homeworkCompletion: 95,
                    averageScore: 90,
                },
                strengths: ['Giải quyết vấn đề', 'Học nhanh', 'Tham gia đều đặn'],
                weaknesses: ['Cần luyện tập thêm với bài toán có lời văn'],
                communications: [
                    {
                        id: '550e8400-e29b-41d4-a716-446655440040',
                        date: '2025-11-19',
                        type: 'Tin nhắn',
                        content: 'Thảo luận về chuẩn bị kỳ thi sắp tới'
                    },
                    {
                        id: '550e8400-e29b-41d4-a716-446655440041',
                        date: '2025-11-10',
                        type: 'Email',
                        content: 'Gửi hướng dẫn bài tập về nhà'
                    },
                    {
                        id: '550e8400-e29b-41d4-a716-446655440042',
                        date: '2025-11-05',
                        type: 'Tin nhắn',
                        content: 'Lên lịch buổi học thêm'
                    },
                ],
                tutorNotes: 'Tiến bộ rất tốt trong tháng này! Rất tích cực trong các cuộc thảo luận trên lớp.'
            };

            return {
                status: 200,
                success: true,
                message: 'Student detail retrieved successfully (mock data)',
                data: mockDetail
            };
        }
    },

    getStudentBookings: async (studentId: string): Promise<ApiResponse<Booking[]>> => {
        const url = `/api/v1/students/${studentId}/sessions`;
        const response = await apiService.get<Booking[]>(url);

        return {
            status: response.status,
            success: response.success,
            message: response.message,
            data: response.data
        };
    }
};