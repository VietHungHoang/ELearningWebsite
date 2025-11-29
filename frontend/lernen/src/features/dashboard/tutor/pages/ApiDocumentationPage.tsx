import React, { useState } from 'react';
import { HiDocumentText, HiUserGroup, HiBookOpen, HiCalendar, HiCreditCard, HiAcademicCap, HiTrendingUp, HiUser, HiGlobe } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';

interface ApiEndpoint {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    description: string;
    parameters?: {
        name: string;
        type: string;
        required: boolean;
        description: string;
    }[];
    queryParams?: {
        name: string;
        type: string;
        required: boolean;
        description: string;
    }[];
    requestBody?: any;
    response: any;
    example?: string;
}

const ApiDocumentationPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('common');
    const navigate = useNavigate();

    const studentEndpoints: ApiEndpoint[] = [
        {
            method: 'GET',
            path: '/api/tutors/{tutorId}/students',
            description: 'Lấy danh sách học sinh của gia sư với phân trang',
            queryParams: [
                {
                    name: 'page',
                    type: 'number',
                    required: false,
                    description: 'Số trang (bắt đầu từ 0, mặc định: 0)'
                },
                {
                    name: 'limit',
                    type: 'number',
                    required: false,
                    description: 'Số lượng item mỗi trang (mặc định: 10)'
                },
                {
                    name: 'status',
                    type: 'string',
                    required: false,
                    description: 'Lọc theo trạng thái: "Ongoing" hoặc "Completed"'
                },
                {
                    name: 'enrollmentType',
                    type: 'string',
                    required: false,
                    description: 'Lọc theo loại đăng ký: "1-on-1", "Group", hoặc "Trial"'
                },
                {
                    name: 'search',
                    type: 'string',
                    required: false,
                    description: 'Tìm kiếm theo tên hoặc email học sinh'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Students retrieved successfully",
                data: {
                    content: [
                        {
                            id: "550e8400-e29b-41d4-a716-446655440000",
                            name: "Sarah Chapman",
                            avatarUrl: "https://example.com/avatar.jpg",
                            registeredDate: "2025-10-15",
                            email: "sarah.c@example.com",
                            enrollmentTypes: ["1-on-1", "Trial"],
                            status: "Ongoing"
                        }
                    ],
                    pageable: {
                        pageNumber: 0,
                        pageSize: 10,
                        offset: 0,
                        paged: true
                    },
                    totalPages: 5,
                    totalElements: 50,
                    last: false,
                    first: true,
                    numberOfElements: 10,
                    size: 10,
                    number: 0,
                    empty: false
                }
            },
            example: `GET /api/tutors/550e8400-e29b-41d4-a716-446655440000/students?page=0&limit=10&status=Ongoing&enrollmentType=1-on-1&search=john`
        },
        {
            method: 'GET',
            path: '/api/tutors/{tutorId}/students/{studentId}',
            description: 'Lấy thông tin chi tiết của một học sinh',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                },
                {
                    name: 'studentId',
                    type: 'string',
                    required: true,
                    description: 'ID của học sinh (UUID)'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Student retrieved successfully",
                data: {
                    id: "550e8400-e29b-41d4-a716-446655440000",
                    name: "Sarah Chapman",
                    avatarUrl: "https://example.com/avatar.jpg",
                    registeredDate: "2025-10-15",
                    email: "sarah.c@example.com",
                    enrollmentTypes: ["1-on-1", "Trial"],
                    status: "Ongoing"
                }
            }
        },
        {
            method: 'GET',
            path: '/api/tutors/{tutorId}/students/{studentId}/detail',
            description: 'Lấy thông tin chi tiết đầy đủ của một học sinh bao gồm thống kê, lịch học, học phí, v.v.',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                },
                {
                    name: 'studentId',
                    type: 'string',
                    required: true,
                    description: 'ID của học sinh (UUID)'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Student detail retrieved successfully",
                data: {
                    id: "550e8400-e29b-41d4-a716-446655440000",
                    name: "Sarah Chapman",
                    avatarUrl: "https://example.com/avatar.jpg",
                    registeredDate: "2025-10-15",
                    email: "sarah.c@example.com",
                    enrollmentTypes: ["1-on-1", "Trial"],
                    status: "Ongoing",
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
                        joinedDate: '2025-10-15',
                    },
                    class: {
                        name: 'Math Advanced A1',
                        instructor: 'You',
                        schedule: 'Mon, Wed, Fri - 3:00 PM',
                    },
                    payment: {
                        status: 'Paid',
                        nextDueDate: '2025-12-01',
                        totalPaid: '$240',
                    },
                    upcomingSessions: [
                        { id: "550e8400-e29b-41d4-a716-446655440020", date: '2025-11-22', time: '15:00', duration: '60 min', topic: 'Calculus Introduction' }
                    ],
                    sessionHistory: [
                        { id: "550e8400-e29b-41d4-a716-446655440030", date: '2025-11-18', duration: '60 min', attendance: 'Present', topic: 'Quadratic Equations' }
                    ],
                    courses: [
                        { title: 'Advanced Mathematics', progress: 75, type: '1-on-1' }
                    ],
                    performance: {
                        testScores: [85, 92, 88, 95, 90],
                        homeworkCompletion: 95,
                        averageScore: 90,
                    },
                    strengths: ['Problem Solving'],
                    weaknesses: ['Word Problems'],
                    communications: [
                        { id: "550e8400-e29b-41d4-a716-446655440040", date: '2025-11-19', type: 'Message', content: 'Discussed upcoming exam preparation' }
                    ],
                    tutorNotes: 'Great progress this month!'
                }
            }
        }
    ];

    const earningsEndpoints: ApiEndpoint[] = [
        {
            method: 'GET',
            path: '/api/tutors/{tutorId}/earnings/recent',
            description: 'Lấy danh sách thu nhập gần đây với phân trang và lọc theo loại',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                }
            ],
            queryParams: [
                {
                    name: 'page',
                    type: 'number',
                    required: false,
                    description: 'Số trang (bắt đầu từ 1, mặc định: 1)'
                },
                {
                    name: 'limit',
                    type: 'number',
                    required: false,
                    description: 'Số lượng item mỗi trang (mặc định: 10)'
                },
                {
                    name: 'type',
                    type: 'string',
                    required: false,
                    description: 'Lọc theo loại: "1-on-1" hoặc "Group"'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Recent earnings retrieved successfully",
                data: {
                    content: [
                        {
                            id: "ERN001",
                            course: "Web Development Bootcamp",
                            type: "1-on-1",
                            date: "22/11/2025 14:30",
                            amount: 50.00
                        },
                        {
                            id: "ERN002",
                            course: "Advanced React Course",
                            type: "Group",
                            date: "20/11/2025 09:15",
                            amount: 45.00
                        }
                    ],
                    pageable: {
                        pageNumber: 0,
                        pageSize: 10,
                        offset: 0,
                        paged: true
                    },
                    totalPages: 2,
                    totalElements: 20,
                    last: false,
                    first: true,
                    numberOfElements: 10,
                    size: 10,
                    number: 0,
                    empty: false
                }
            },
            example: `GET /api/tutors/550e8400-e29b-41d4-a716-446655440000/earnings/recent?page=1&limit=10&type=1-on-1`
        }
    ];

    const classEndpoints: ApiEndpoint[] = [
        {
            method: 'GET',
            path: '/api/tutors/{tutorId}/classes',
            description: 'Lấy danh sách lớp học của gia sư với phân trang',
            queryParams: [
                {
                    name: 'page',
                    type: 'number',
                    required: false,
                    description: 'Số trang (bắt đầu từ 0, mặc định: 0)'
                },
                {
                    name: 'limit',
                    type: 'number',
                    required: false,
                    description: 'Số lượng item mỗi trang (mặc định: 10)'
                },
                {
                    name: 'status',
                    type: 'string',
                    required: false,
                    description: 'Lọc theo trạng thái: "Ongoing" hoặc "Completed"'
                },
                {
                    name: 'type',
                    type: 'string',
                    required: false,
                    description: 'Lọc theo loại lớp: "1-on-1" hoặc "Group"'
                },
                {
                    name: 'search',
                    type: 'string',
                    required: false,
                    description: 'Tìm kiếm theo tên khóa học hoặc tên học sinh'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Classes retrieved successfully",
                data: {
                    content: [
                        {
                            id: "550e8400-e29b-41d4-a716-446655440100",
                            courseTitle: "Advanced Calculus II: A Deep Dive into Multivariable Functions and Vector Analysis",
                            students: [
                                { id: "550e8400-e29b-41d4-a716-446655440000", name: "Sarah Chapman", avatar: "https://picsum.photos/seed/sarah/48/48" }
                            ],
                            type: "1-on-1",
                            status: "Ongoing",
                            schedules: [
                                { day: "Monday", time: "10:00 AM" },
                                { day: "Wednesday", time: "2:00 PM" }
                            ],
                            startDate: "Oct 1, 2025",
                            completedSessions: 8,
                            totalSessions: 12,
                            quizzes: [
                                { id: "550e8400-e29b-41d4-a716-446655440200", title: "Mid-term Exam", status: "Completed" }
                            ],
                            materials: [
                                { id: "550e8400-e29b-41d4-a716-446655440300", name: "Chapter_3_Notes.pdf", type: "PDF", date: "2025-10-15" }
                            ]
                        }
                    ],
                    pageable: {
                        pageNumber: 0,
                        pageSize: 10,
                        offset: 0,
                        paged: true
                    },
                    totalPages: 2,
                    totalElements: 15,
                    last: false,
                    first: true,
                    numberOfElements: 10,
                    size: 10,
                    number: 0,
                    empty: false
                }
            },
            example: `GET /api/tutors/550e8400-e29b-41d4-a716-446655440000/classes?page=0&limit=10&status=Ongoing&type=1-on-1&search=calculus`
        },
        {
            method: 'GET',
            path: '/api/tutors/{tutorId}/classes/{classId}',
            description: 'Lấy thông tin chi tiết của một lớp học',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                },
                {
                    name: 'classId',
                    type: 'string',
                    required: true,
                    description: 'ID của lớp học (UUID)'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Class retrieved successfully",
                data: {
                    id: "550e8400-e29b-41d4-a716-446655440100",
                    courseTitle: "Advanced Calculus II",
                    students: [
                        { id: "550e8400-e29b-41d4-a716-446655440000", name: "Sarah Chapman", avatar: "https://picsum.photos/seed/sarah/48/48" }
                    ],
                    type: "1-on-1",
                    status: "Ongoing",
                    schedules: [
                        { day: "Monday", time: "10:00 AM" }
                    ],
                    startDate: "Oct 1, 2025",
                    completedSessions: 8,
                    totalSessions: 12,
                    quizzes: [
                        { id: "550e8400-e29b-41d4-a716-446655440200", title: "Mid-term Exam", status: "Completed" }
                    ],
                    materials: [
                        { id: "550e8400-e29b-41d4-a716-446655440300", name: "Chapter_3_Notes.pdf", type: "PDF", date: "2025-10-15" }
                    ]
                }
            }
        },
        {
            method: 'GET',
            path: '/api/tutors/{tutorId}/classes/{classId}/detail',
            description: 'Lấy thông tin chi tiết đầy đủ của một lớp học bao gồm thống kê, lịch sử buổi học, thông báo, bài tập',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                },
                {
                    name: 'classId',
                    type: 'string',
                    required: true,
                    description: 'ID của lớp học (UUID)'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Class detail retrieved successfully",
                data: {
                    id: "550e8400-e29b-41d4-a716-446655440100",
                    courseTitle: "Advanced Calculus II",
                    students: [
                        { id: "550e8400-e29b-41d4-a716-446655440000", name: "Sarah Chapman", avatar: "https://picsum.photos/seed/sarah/48/48" }
                    ],
                    type: "1-on-1",
                    status: "Ongoing",
                    schedules: [
                        { day: "Monday", time: "10:00 AM" }
                    ],
                    startDate: "Oct 1, 2025",
                    completedSessions: 8,
                    totalSessions: 12,
                    quizzes: [
                        { id: "550e8400-e29b-41d4-a716-446655440200", title: "Mid-term Exam", status: "Completed" }
                    ],
                    materials: [
                        { id: "550e8400-e29b-41d4-a716-446655440300", name: "Chapter_3_Notes.pdf", type: "PDF", date: "2025-10-15" }
                    ],
                    stats: {
                        totalStudents: 1,
                        activeStudents: 1,
                        completedSessions: 8,
                        totalSessions: 12,
                        averageAttendance: 95,
                        averageProgress: 75
                    },
                    sessions: [
                        {
                            id: "550e8400-e29b-41d4-a716-446655440400",
                            date: "2025-11-18",
                            time: "10:00 AM",
                            duration: "60 min",
                            topic: "Quadratic Equations",
                            attendance: [
                                { studentId: "550e8400-e29b-41d4-a716-446655440000", status: "Present" }
                            ],
                            materials: [
                                { id: "550e8400-e29b-41d4-a716-446655440300", name: "Chapter_3_Notes.pdf", type: "PDF", date: "2025-10-15" }
                            ]
                        }
                    ],
                    announcements: [
                        {
                            id: "550e8400-e29b-41d4-a716-446655440500",
                            title: "Upcoming Quiz",
                            content: "Please prepare for the upcoming quiz on multivariable functions.",
                            date: "2025-11-10",
                            author: "Tutor"
                        }
                    ],
                    assignments: [
                        {
                            id: "550e8400-e29b-41d4-a716-446655440600",
                            title: "Homework 3",
                            description: "Complete exercises 1-10 from chapter 3",
                            dueDate: "2025-11-25",
                            submissions: 1
                        }
                    ]
                }
            }
        }
    ];



    const courseEndpoints: ApiEndpoint[] = [
        {
            method: 'GET',
            path: '/api/tutors/{tutorId}/courses',
            description: 'Lấy danh sách khóa học của gia sư',
            queryParams: [
                {
                    name: 'page',
                    type: 'number',
                    required: false,
                    description: 'Số trang (bắt đầu từ 0, mặc định: 0)'
                },
                {
                    name: 'limit',
                    type: 'number',
                    required: false,
                    description: 'Số lượng item mỗi trang (mặc định: 10)'
                },
                {
                    name: 'status',
                    type: 'string',
                    required: false,
                    description: 'Lọc theo trạng thái: "draft", "published", "archived"'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Courses retrieved successfully",
                data: {
                    content: [
                        {
                            id: "550e8400-e29b-41d4-a716-446655440050",
                            title: "Advanced React Development",
                            description: "Master React with advanced concepts",
                            price: 99.99,
                            status: "published",
                            enrolledStudents: 45,
                            rating: 4.8,
                            createdAt: "2024-01-01T00:00:00Z"
                        }
                    ],
                    pageable: {
                        pageNumber: 0,
                        pageSize: 10,
                        offset: 0,
                        paged: true
                    },
                    totalPages: 2,
                    totalElements: 15,
                    last: false,
                    first: true,
                    numberOfElements: 10,
                    size: 10,
                    number: 0,
                    empty: false
                }
            },
            example: `GET /api/tutors/550e8400-e29b-41d4-a716-446655440000/courses?page=0&limit=10&status=published`
        },
        {
            method: 'POST',
            path: '/api/tutors/{tutorId}/courses',
            description: 'Tạo khóa học mới',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                }
            ],
            requestBody: {
                title: "New Course Title",
                description: "Course description",
                price: 79.99,
                category: "Programming",
                level: "Intermediate"
            },
            response: {
                status: 201,
                success: true,
                message: "Course created successfully",
                data: {
                    id: "550e8400-e29b-41d4-a716-446655440051",
                    title: "New Course Title",
                    status: "draft",
                    createdAt: "2024-01-20T10:00:00Z"
                }
            }
        }
    ];

    const scheduleEndpoints: ApiEndpoint[] = [
        {
            method: 'GET',
            path: '/api/v1/tutors/{tutorId}/availability',
            description: 'Lấy danh sách recurring availability patterns (dayOfWeek + time ranges)',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                }
            ],
            queryParams: [
                {
                    name: 'startDate',
                    type: 'string',
                    required: true,
                    description: 'Ngày bắt đầu (YYYY-MM-DD) - Frontend tự tính prefetch range'
                },
                {
                    name: 'endDate',
                    type: 'string',
                    required: true,
                    description: 'Ngày kết thúc (YYYY-MM-DD) - Frontend tự tính prefetch range'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Availability retrieved successfully",
                data: {
                    availabilities: [
                        {
                            id: "550e8400-e29b-41d4-a716-446655440001",
                            dayOfWeek: 1,
                            startTime: "09:00",
                            endTime: "12:00",
                            effectiveStartDate: "2025-01-01",
                            effectiveEndDate: null,
                            status: "AVAILABLE"
                        },
                        {
                            id: "550e8400-e29b-41d4-a716-446655440002",
                            dayOfWeek: 3,
                            startTime: "14:00",
                            endTime: "17:00",
                            effectiveStartDate: "2025-01-01",
                            effectiveEndDate: "2025-06-30",
                            status: "AVAILABLE"
                        }
                    ]
                }
            },
            example: `GET /api/v1/tutors/550e8400-e29b-41d4-a716-446655440000/availability?startDate=2025-01-01&endDate=2025-01-31

// TIME HANDLING: All datetime fields transmitted in UTC ISO 8601 format
// Frontend handles timezone conversion for display
// Example: "2025-11-24T09:00:00.000Z" (UTC) → displayed as local time

// Backend entity structure:
// - dayOfWeek: 0-6 (Sunday-Saturday)
// - startTime: "HH:mm" format (e.g., "09:00")
// - endTime: "HH:mm" format (e.g., "17:00")
// - effectiveStartDate: "YYYY-MM-DD" (when pattern starts)
// - effectiveEndDate: "YYYY-MM-DD" or null (when pattern ends, null = no end)
// - status: AVAILABLE | DELETED

// Frontend generates display slots from these patterns
// Prefetch strategy:
// - Daily view: ±3 days (7 days total)
// - Weekly view: ±1 week (3 weeks total)
// - Monthly view: Current month + next month`
        },
        {
            method: 'POST',
            path: '/api/v1/tutors/{tutorId}/availability/bulk',
            description: 'Bulk update availability - SINGLE API cho cả 2 modes (this_period hoặc recurring)',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                }
            ],
            requestBody: {
                mode: "this_period",
                startDate: "2025-01-13",
                endDate: "2025-01-19",
                oldAvailabilityIds: [
                    "550e8400-e29b-41d4-a716-446655440001",
                    "550e8400-e29b-41d4-a716-446655440002"
                ],
                newAvailabilities: [
                    {
                        dayOfWeek: 1,
                        startTime: "09:00",
                        endTime: "12:00",
                        effectiveStartDate: "2025-01-01",
                        effectiveEndDate: null,
                        status: "AVAILABLE"
                    },
                    {
                        dayOfWeek: 3,
                        startTime: "14:00",
                        endTime: "17:00",
                        effectiveStartDate: "2025-01-01",
                        effectiveEndDate: null,
                        status: "AVAILABLE"
                    }
                ]
            },
            response: {
                status: 200,
                success: true,
                message: "Availability updated successfully (this_period)",
                data: {
                    availabilities: [
                        {
                            id: "550e8400-e29b-41d4-a716-new-001",
                            dayOfWeek: 1,
                            startTime: "09:00",
                            endTime: "12:00",
                            effectiveStartDate: "2025-01-01",
                            effectiveEndDate: null,
                            status: "AVAILABLE"
                        }
                    ],
                    message: "Updated 2 availability patterns"
                }
            },
            example: `POST /api/v1/tutors/550e8400-e29b-41d4-a716-446655440000/availability/bulk

// MODE: 'this_period'
// - Creates temporary exceptions with limited effectiveEndDate
// - Won't affect other weeks/months
// - Useful for one-time adjustments (vacation, special events)

// MODE: 'recurring'  
// - Updates base recurring patterns (effectiveEndDate = null)
// - Affects all future weeks/months
// - Useful for permanent schedule changes

// FLOW:
// 1. User edit availability in UI
// 2. Frontend check: có thay đổi không? → disable Save nếu không
// 3. User click Save → chọn mode (this week / all future)
// 4. Frontend gửi:
//    - oldAvailabilityIds: IDs of patterns to delete
//    - newAvailabilities: New recurring patterns (without IDs)
//    - Backend will assign IDs when creating
// 5. Backend xử lý:
//    - DELETE patterns theo oldAvailabilityIds
//    - INSERT newAvailabilities
//    - Set effectiveEndDate based on mode`
        },
        {
            method: 'GET',
            path: '/api/v1/tutors/{tutorId}/sessions/booked',
            description: 'Lấy danh sách các session đã được students book (để hiển thị trên calendar)',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                }
            ],
            queryParams: [
                {
                    name: 'startDate',
                    type: 'string',
                    required: true,
                    description: 'Ngày bắt đầu (YYYY-MM-DD)'
                },
                {
                    name: 'endDate',
                    type: 'string',
                    required: true,
                    description: 'Ngày kết thúc (YYYY-MM-DD)'
                },
                {
                    name: 'statuses',
                    type: 'string',
                    required: false,
                    description: 'Filter by status (comma-separated): PENDING,BOOKED,CANCELLED'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Booked sessions retrieved successfully",
                data: {
                    sessions: [
                        {
                            id: "650e8400-e29b-41d4-a716-446655440001",
                            studentId: "student-uuid-001",
                            studentName: "Sarah Chapman",
                            studentAvatarUrl: "https://picsum.photos/seed/sarah/48/48",
                            sessionDatetime: "2025-11-24T09:00:00.000Z",
                            durationMinutes: 60,
                            className: "Mathematics Advanced",
                            sessionType: "1-on-1",
                            status: "BOOKED",
                            meetingUrl: "https://zoom.us/j/123456789",
                            notes: "Review calculus topics",
                            bookedAt: "2025-11-20T10:30:00.000Z",
                            updatedAt: "2025-11-20T10:30:00.000Z"
                        },
                        {
                            id: "650e8400-e29b-41d4-a716-446655440002",
                            studentId: "student-uuid-002",
                            studentName: "Ann Coleman",
                            studentAvatarUrl: "https://picsum.photos/seed/ann/48/48",
                            sessionDatetime: "2025-11-26T10:00:00.000Z",
                            durationMinutes: 60,
                            className: "English Conversation",
                            sessionType: "Trial",
                            status: "PENDING",
                            notes: "First trial session",
                            bookedAt: "2025-11-22T08:00:00.000Z"
                        }
                    ]
                }
            },
            example: `GET /api/v1/tutors/550e8400-e29b-41d4-a716-446655440000/sessions/booked?startDate=2025-11-24&endDate=2025-11-30&statuses=BOOKED,PENDING

// TIME HANDLING: All datetime fields transmitted in UTC ISO 8601 format
// Frontend handles timezone conversion for display
// Example: sessionDatetime: "2025-11-24T09:00:00.000Z" (UTC)

// Session fields:
// - className: Name of the class/course (e.g., "Mathematics Advanced", "English Conversation")
// - sessionType: "1-on-1" | "Group" | "Trial"
// - status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"

// Session Status:
// - PENDING: Student booked, waiting for tutor confirmation
// - BOOKED: Session confirmed and scheduled
// - CANCELLED: Session was cancelled

// Combined Flow:
// 1. GET /api/v1/tutors/availability → Get recurring patterns
// 2. Frontend generates available time slots from patterns
// 3. GET /api/v1/tutors/sessions/booked → Get booked sessions
// 4. Overlay booked sessions on calendar:
//    - Green slots = Available (from patterns)
//    - Colored slots with student info = Booked (from sessions)
//    - Gray slots = Not available`
        }
    ];

    const payoutEndpoints: ApiEndpoint[] = [
        {
            method: 'GET',
            path: '/api/tutors/{tutorId}/payouts/summary',
            description: 'Lấy tổng quan về payout (hiển thị cho 4 cards, bao gồm current payment method)',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Payout summary retrieved successfully",
                data: {
                    availableBalance: 1250.75,
                    pendingBalance: 750.00,
                    withdrawalCount: 3,
                    maxWithdrawals: 5,
                    minimumThreshold: 50,
                    commissionRate: 12,
                    nextPayoutDate: "Dec 01, 2025",
                    totalEarned: 24500.00,
                    currentPaymentMethod: {
                        id: "550e8400-e29b-41d4-a716-446655440001",
                        type: "PayPal",
                        identifier: "john.doe@example.com"
                    }
                }
            },
            example: `GET /api/tutors/550e8400-e29b-41d4-a716-446655440000/payouts/summary`
        },
        {
            method: 'GET',
            path: '/api/tutors/{tutorId}/payouts/earnings',
            description: 'Lấy danh sách recent earnings (tab Recent Earnings)',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                }
            ],
            queryParams: [
                {
                    name: 'page',
                    type: 'number',
                    required: false,
                    description: 'Số trang (bắt đầu từ 1, mặc định: 1)'
                },
                {
                    name: 'limit',
                    type: 'number',
                    required: false,
                    description: 'Số lượng item mỗi trang (mặc định: 5)'
                },
                {
                    name: 'type',
                    type: 'string',
                    required: false,
                    description: 'Lọc theo loại: "1-on-1" hoặc "Group"'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Recent earnings retrieved successfully",
                data: {
                    content: [
                        {
                            id: "ERN001",
                            course: "Web Development Bootcamp",
                            type: "1-on-1",
                            date: "22/11/2025",
                            amount: 50.00
                        },
                        {
                            id: "ERN002",
                            course: "Advanced React Course",
                            type: "Group",
                            date: "20/11/2025",
                            amount: 45.00
                        }
                    ],
                    pageable: {
                        pageNumber: 0,
                        pageSize: 5,
                        offset: 0,
                        paged: true
                    },
                    totalPages: 4,
                    totalElements: 20,
                    last: false,
                    first: true,
                    numberOfElements: 5,
                    size: 5,
                    number: 0,
                    empty: false
                }
            },
            example: `GET /api/tutors/550e8400-e29b-41d4-a716-446655440000/payouts/earnings?page=1&limit=5&type=1-on-1`
        },
        {
            method: 'GET',
            path: '/api/tutors/{tutorId}/payouts/history',
            description: 'Lấy lịch sử giao dịch withdrawal (tab Transaction History)',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                }
            ],
            queryParams: [
                {
                    name: 'page',
                    type: 'number',
                    required: false,
                    description: 'Số trang (bắt đầu từ 1, mặc định: 1)'
                },
                {
                    name: 'limit',
                    type: 'number',
                    required: false,
                    description: 'Số lượng item mỗi trang (mặc định: 5)'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Payout history retrieved successfully",
                data: {
                    content: [
                        {
                            id: "TXN20251122",
                            date: "Nov 22, 2025",
                            amount: 1250.75,
                            method: {
                                id: "550e8400-e29b-41d4-a716-446655440001",
                                type: "PayPal",
                                identifier: "john.doe@example.com"
                            },
                            status: "Completed"
                        },
                        {
                            id: "TXN20251115",
                            date: "Nov 15, 2025",
                            amount: 980.50,
                            method: {
                                id: "550e8400-e29b-41d4-a716-446655440002",
                                type: "Bank",
                                identifier: "**** 4567"
                            },
                            status: "Processing"
                        }
                    ],
                    pageable: {
                        pageNumber: 0,
                        pageSize: 5,
                        offset: 0,
                        paged: true
                    },
                    totalPages: 3,
                    totalElements: 15,
                    last: false,
                    first: true,
                    numberOfElements: 5,
                    size: 5,
                    number: 0,
                    empty: false
                }
            },
            example: `GET /api/tutors/550e8400-e29b-41d4-a716-446655440000/payouts/history?page=1&limit=5`
        },
        {
            method: 'GET',
            path: '/api/tutors/{tutorId}/payouts/methods',
            description: 'Lấy danh sách tất cả payment methods (khi click "View All Methods")',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                }
            ],
            response: {
                status: 200,
                success: true,
                message: "Payment methods retrieved successfully",
                data: [
                    {
                        id: "550e8400-e29b-41d4-a716-446655440001",
                        type: "PayPal",
                        identifier: "john.doe@example.com"
                    },
                    {
                        id: "550e8400-e29b-41d4-a716-446655440002",
                        type: "Bank",
                        identifier: "**** 4567"
                    }
                ]
            },
            example: `GET /api/tutors/550e8400-e29b-41d4-a716-446655440000/payouts/methods`
        },
        {
            method: 'POST',
            path: '/api/tutors/{tutorId}/payouts/methods',
            description: 'Thêm payment method mới',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                }
            ],
            requestBody: {
                type: "PayPal",
                identifier: "sarah.smith@gmail.com"
            },
            response: {
                status: 201,
                success: true,
                message: "Payment method added successfully",
                data: {
                    id: "550e8400-e29b-41d4-a716-446655440003",
                    type: "PayPal",
                    identifier: "sarah.smith@gmail.com"
                }
            },
            example: `POST /api/tutors/550e8400-e29b-41d4-a716-446655440000/payouts/methods`
        },
        {
            method: 'POST',
            path: '/api/tutors/{tutorId}/payouts/withdraw',
            description: 'Rút tiền (withdraw funds)',
            parameters: [
                {
                    name: 'tutorId',
                    type: 'string',
                    required: true,
                    description: 'ID của gia sư (UUID)'
                }
            ],
            requestBody: {
                amount: 500.00,
                methodId: "550e8400-e29b-41d4-a716-446655440001"
            },
            response: {
                status: 201,
                success: true,
                message: "Withdrawal initiated successfully",
                data: {
                    transactionId: "TXN20251122001",
                    status: "Processing"
                }
            },
            example: `POST /api/tutors/550e8400-e29b-41d4-a716-446655440000/payouts/withdraw`
        }
    ];


    const commonEndpoints: ApiEndpoint[] = [
        {
            method: 'GET',
            path: '/v1/common/countries',
            description: 'Lấy danh sách các quốc gia',
            response: {
                status: 200,
                success: true,
                message: "Countries retrieved successfully",
                data: [
                    {
                        id: "c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
                        name: "Afghanistan"
                    },
                    {
                        id: "c2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7",
                        name: "Albania"
                    },
                    {
                        id: "c3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8",
                        name: "Algeria"
                    }
                ]
            },
            example: `GET /v1/common/countries`
        },
        {
            method: 'GET',
            path: '/v1/common/languages',
            description: 'Lấy danh sách các ngôn ngữ',
            response: {
                status: 200,
                success: true,
                message: "Languages retrieved successfully",
                data: [
                    {
                        id: "l1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
                        name: "Afrikaans"
                    },
                    {
                        id: "l2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7",
                        name: "Albanian"
                    },
                    {
                        id: "l3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8",
                        name: "Arabic"
                    }
                ]
            },
            example: `GET /v1/common/languages`
        },
        {
            method: 'GET',
            path: '/v1/common/subjects',
            description: 'Lấy danh sách các môn học',
            response: {
                status: 200,
                success: true,
                message: "Subjects retrieved successfully",
                data: [
                    {
                        id: "s1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
                        name: "Mathematics"
                    },
                    {
                        id: "s2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7",
                        name: "Physics"
                    },
                    {
                        id: "s3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8",
                        name: "Chemistry"
                    }
                ]
            },
            example: `GET /v1/common/subjects`
        }
    ];

    const profileEndpoints: ApiEndpoint[] = [
        {
            method: 'GET',
            path: '/api/v1/tutors/profile',
            description: 'Lấy thông tin profile của gia sư',
            response: {
                status: 200,
                success: true,
                message: "Tutor profile retrieved successfully",
                data: {
                    fullName: "Sarah Chapman",
                    email: "student@amentotech.com",
                    phone: "07123456789",
                    gender: "Female",
                    country: "Afghanistan",
                    city: "Kabul",
                    nativeLanguage: {
                        id: "lang-001",
                        name: "Georgian",
                        code: "ka"
                    },
                    languages: [
                        { id: "lang-002", name: "Dutch", code: "nl" },
                        { id: "lang-003", name: "English", code: "en" }
                    ],
                    headline: "Certified Math Tutor with 5 years of experience",
                    subjects: [
                        { id: "s1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6", name: "Mathematics" },
                        { id: "s2a3b4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7", name: "Physics" }
                    ],
                    introduction: "Hi! I am Sarah Chapman, a dedicated and experienced tutor...",
                    avatarUrl: "https://example.com/photo.jpg",
                    introductionVideoUrl: "https://example.com/video.mp4",
                    socialLinks: [
                        {
                            id: "1",
                            platform: "Facebook",
                            url: "https://facebook.com/sarah.chapman"
                        },
                        {
                            id: "2",
                            platform: "LinkedIn",
                            url: "https://linkedin.com/in/sarah-chapman"
                        }
                    ],
                    education: [
                        {
                            id: "1",
                            title: "Bachelor of Computer Science",
                            institution: "ABC University",
                            startDate: "2015-09-01",
                            endDate: "2019-06-30",
                            location: "Cacuaco, Angola",
                            description: "Focused on software development..."
                        }
                    ],
                    experience: [
                        {
                            id: "3",
                            title: "Lead Math Tutor",
                            institution: "Lernen Platform",
                            startDate: "2022-01-01",
                            endDate: null,
                            location: "Remote",
                            description: "Provide expert tutoring..."
                        }
                    ],
                    certifications: [
                        {
                            id: "4",
                            name: "Certified Educator",
                            issuingOrganization: "National Tutoring Association",
                            issueDate: "2021-06-15",
                            expirationDate: null,
                            credentialId: "NTA-CE-2021-12345",
                            credentialUrl: "https://nta.org/verify/NTA-CE-2021-12345"
                        }
                    ]
                }
            },
            example: `GET /api/v1/tutors/profile`
        },
        {
            method: 'PUT',
            path: '/api/v1/tutors/profile',
            description: 'Cập nhật thông tin profile của gia sư',
            requestBody: {
                fullName: "Sarah Chapman",
                phone: "07123456789",
                gender: "Female",
                country: "c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
                city: "Kabul",
                nativeLanguage: {
                    id: "lang-001",
                    name: "Georgian",
                    code: "ka"
                },
                languages: [
                    { id: "lang-002", name: "Dutch", code: "nl" },
                    { id: "lang-003", name: "English", code: "en" }
                ],
                headline: "Certified Math Tutor with 5 years of experience",
                subjects: [
                    { id: "s1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6", name: "Mathematics" },
                    { id: "s2a3b4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7", name: "Physics" }
                ],
                introduction: "Hi! I am Sarah Chapman...",
                socialLinks: [
                    {
                        id: "1",
                        platform: "Facebook",
                        url: "https://facebook.com/sarah.chapman"
                    },
                    {
                        id: "2",
                        platform: "LinkedIn",
                        url: "https://linkedin.com/in/sarah-chapman"
                    }
                ],
                education: [
                    {
                        id: "1",
                        title: "Bachelor of Computer Science",
                        institution: "ABC University",
                        startDate: "2015-09-01",
                        endDate: "2019-06-30",
                        location: "Cacuaco, Angola",
                        description: "Focused on software development..."
                    }
                ],
                experience: [
                    {
                        id: "3",
                        title: "Lead Math Tutor",
                        institution: "Lernen Platform",
                        startDate: "2022-01-01",
                        endDate: null,
                        location: "Remote",
                        description: "Provide expert tutoring..."
                    }
                ],
                certifications: [
                    {
                        id: "4",
                        name: "Certified Educator",
                        issuingOrganization: "National Tutoring Association",
                        issueDate: "2021-06-15",
                        expirationDate: null,
                        credentialId: "NTA-CE-2021-12345",
                        credentialUrl: "https://nta.org/verify/NTA-CE-2021-12345"
                    }
                ]
            },
            response: {
                status: 200,
                success: true,
                message: 'Tutor profile updated successfully',
                data: {
                    fullName: "Sarah Chapman",
                    email: "student@amentotech.com",
                    phone: "07123456789",
                    gender: "Female",
                    country: "Afghanistan",
                    city: "Kabul",
                    nativeLanguage: {
                        id: "lang-001",
                        name: "Georgian",
                        code: "ka"
                    },
                    languages: [
                        { id: "lang-002", name: "Dutch", code: "nl" },
                        { id: "lang-003", name: "English", code: "en" }
                    ],
                    headline: "Certified Math Tutor with 5 years of experience",
                    subjects: [
                        { id: "s1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6", name: "Mathematics" },
                        { id: "s2a3b4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7", name: "Physics" }
                    ],
                    introduction: "Hi! I am Sarah Chapman...",
                    avatarUrl: "https://example.com/photo.jpg",
                    introductionVideoUrl: "https://example.com/video.mp4",
                    socialLinks: [
                        {
                            id: "1",
                            platform: "Facebook",
                            url: "https://facebook.com/sarah.chapman"
                        },
                        {
                            id: "2",
                            platform: "LinkedIn",
                            url: "https://linkedin.com/in/sarah-chapman"
                        }
                    ]
                }
            },
            example: `PUT /api/v1/tutors/profile`
        },
        {
            method: 'POST',
            path: '/api/v1/tutors/profile/upload-photo',
            description: 'Upload ảnh đại diện của gia sư',
            requestBody: {
                file: 'File (multipart/form-data)'
            },
            response: {
                status: 200,
                success: true,
                message: 'Profile photo uploaded successfully',
                data: {
                    fileUrl: "https://example.com/uploads/photo.jpg",
                    fileName: "photo.jpg",
                    fileSize: 245678
                }
            },
            example: `POST /api/v1/tutors/profile/upload-photo
Content-Type: multipart/form-data

file: [binary data]`
        },
        {
            method: 'POST',
            path: '/api/v1/tutors/profile/upload-video',
            description: 'Upload video giới thiệu của gia sư',
            requestBody: {
                file: 'File (multipart/form-data)'
            },
            response: {
                status: 200,
                success: true,
                message: 'Introduction video uploaded successfully',
                data: {
                    fileUrl: "https://example.com/uploads/intro-video.mp4",
                    fileName: "intro-video.mp4",
                    fileSize: 12345678
                }
            },
            example: `POST /api/v1/tutors/profile/upload-video
Content-Type: multipart/form-data

file: [binary data]`
        },
        {
            method: 'PUT',
            path: '/api/v1/tutors/profile/resume',
            description: 'Cập nhật resume highlights (education, experience, certifications)',
            requestBody: {
                education: [
                    {
                        id: "1",
                        title: "Bachelor of Computer Science",
                        institution: "ABC University",
                        startDate: "2015-09-01",
                        endDate: "2019-06-30",
                        location: "Cacuaco, Angola",
                        description: "Focused on software development..."
                    }
                ],
                experience: [
                    {
                        id: "3",
                        title: "Lead Math Tutor",
                        institution: "Lernen Platform",
                        startDate: "2022-01-01",
                        endDate: null,
                        location: "Remote",
                        description: "Provide expert tutoring..."
                    }
                ],
                certifications: [
                    {
                        id: "4",
                        name: "Certified Educator",
                        issuingOrganization: "National Tutoring Association",
                        issueDate: "2021-06-15",
                        expirationDate: null,
                        credentialId: "NTA-CE-2021-12345",
                        credentialUrl: "https://nta.org/verify/NTA-CE-2021-12345"
                    }
                ]
            },
            response: {
                status: 200,
                success: true,
                message: 'Resume highlights updated successfully',
                data: {
                    education: [
                        {
                            id: "1",
                            title: "Bachelor of Computer Science",
                            institution: "ABC University",
                            startDate: "2015-09-01",
                            endDate: "2019-06-30",
                            location: "Cacuaco, Angola",
                            description: "Focused on software development..."
                        }
                    ],
                    experience: [
                        {
                            id: "3",
                            title: "Lead Math Tutor",
                            institution: "Lernen Platform",
                            startDate: "2022-01-01",
                            endDate: null,
                            location: "Remote",
                            description: "Provide expert tutoring..."
                        }
                    ],
                    certifications: [
                        {
                            id: "4",
                            name: "Certified Educator",
                            issuingOrganization: "National Tutoring Association",
                            issueDate: "2021-06-15",
                            expirationDate: null,
                            credentialId: "NTA-CE-2021-12345",
                            credentialUrl: "https://nta.org/verify/NTA-CE-2021-12345"
                        }
                    ]
                }
            },
            example: `PUT /api/v1/tutors/profile/resume`
        }
    ];

    const MethodBadge: React.FC<{ method: string }> = ({ method }) => {
        const colors = {
            GET: 'bg-green-100 text-green-800',
            POST: 'bg-blue-100 text-blue-800',
            PUT: 'bg-yellow-100 text-yellow-800',
            DELETE: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`} >
                {method}
            </span >
        );
    };

    const EndpointCard: React.FC<{ endpoint: ApiEndpoint }> = ({ endpoint }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MethodBadge method={endpoint.method} />
                            <code className="text-sm font-mono text-gray-800">{endpoint.path}</code>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{endpoint.description}</span>
                            <svg
                                className={`w-4 h-4 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                        {endpoint.parameters && endpoint.parameters.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-800 mb-2">Path Parameters</h4>
                                <div className="space-y-2">
                                    {endpoint.parameters.map((param, index) => (
                                        <div key={index} className="flex items-start gap-3 text-sm">
                                            <code className="bg-white px-2 py-1 rounded text-xs font-mono">{param.name}</code>
                                            <span className="text-gray-600">{param.type}</span>
                                            {param.required && <span className="text-red-500">*</span>}
                                            <span className="text-gray-700 flex-1">{param.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {endpoint.queryParams && endpoint.queryParams.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-800 mb-2">Query Parameters</h4>
                                <div className="space-y-2">
                                    {endpoint.queryParams.map((param, index) => (
                                        <div key={index} className="flex items-start gap-3 text-sm">
                                            <code className="bg-white px-2 py-1 rounded text-xs font-mono">{param.name}</code>
                                            <span className="text-gray-600">{param.type}</span>
                                            {param.required && <span className="text-red-500">*</span>}
                                            <span className="text-gray-700 flex-1">{param.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {endpoint.requestBody && (
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-800 mb-2">Request Body</h4>
                                <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
                                    {JSON.stringify(endpoint.requestBody, null, 2)}
                                </pre>
                            </div>
                        )}

                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Response</h4>
                            <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
                                {JSON.stringify(endpoint.response, null, 2)}
                            </pre>
                        </div>

                        {endpoint.example && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-800 mb-2">Example</h4>
                                <code className="block bg-white p-3 rounded text-sm font-mono">
                                    {endpoint.example}
                                </code>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const sections = [
        { id: 'common', label: 'Common APIs', icon: <HiGlobe className="w-5 h-5" />, endpoints: commonEndpoints },
        { id: 'profile', label: 'Profile API', icon: <HiUser className="w-5 h-5" />, endpoints: profileEndpoints },
        { id: 'students', label: 'Students API', icon: <HiUserGroup className="w-5 h-5" />, endpoints: studentEndpoints },
        { id: 'classes', label: 'Classes API', icon: <HiAcademicCap className="w-5 h-5" />, endpoints: classEndpoints },
        { id: 'courses', label: 'Courses API', icon: <HiBookOpen className="w-5 h-5" />, endpoints: courseEndpoints },
        { id: 'schedule', label: 'Schedule API', icon: <HiCalendar className="w-5 h-5" />, endpoints: scheduleEndpoints },
        { id: 'payouts', label: 'Payouts API', icon: <HiCreditCard className="w-5 h-5" />, endpoints: payoutEndpoints },
        { id: 'earnings', label: 'Earnings API', icon: <HiTrendingUp className="w-5 h-5" />, endpoints: earningsEndpoints },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6">
            <Breadcrumb
                items={[
                    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
                    { label: 'API Documentation', isActive: true }
                ]}
                className="mb-6"
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">API Sections</h3>
                        <div className="space-y-2">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeSection === section.id
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {section.icon}
                                    <span className="text-sm font-medium">{section.label}</span>
                                    <span className="ml-auto text-xs text-gray-500">
                                        {section.endpoints.length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="bg-blue-50 rounded-lg p-4 mt-4">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">Base URL</h4>
                        <code className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                            https://api.elearning-platform.com
                        </code>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        {sections.find(s => s.id === activeSection)?.endpoints.length ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-6">
                                    {sections.find(s => s.id === activeSection)?.icon}
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {sections.find(s => s.id === activeSection)?.label}
                                    </h2>
                                </div>

                                {sections.find(s => s.id === activeSection)?.endpoints.map((endpoint, index) => (
                                    <EndpointCard key={index} endpoint={endpoint} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <HiDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                    Documentation Coming Soon
                                </h3>
                                <p className="text-gray-500">
                                    API documentation for {sections.find(s => s.id === activeSection)?.label.toLowerCase()} is being prepared.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiDocumentationPage;