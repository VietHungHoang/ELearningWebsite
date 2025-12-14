import type { Category, Language, Timezone, Subject } from "./common";
import type { TutorResponse, EducationItem, ExperienceItem, CertificationItem, SocialLink, ClassScheduleItem } from "./tutor";

export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
}

export interface FilterData {
    timezones: Timezone[];
    languages: Language[];
    categories: Category[];
}

export type ClassType = '1-on-1' | 'Group';

export interface TutorSearchFilter {
    category?: string;
    subject?: string;
    languageCodes?: string[];
    minFee?: number;
    maxFee?: number;
    sortBy?: string;
    timezone?: string;
    keyword?: string;
    sessionType?: ClassType;
    page?: number;
    size?: number;
}

export type UserRole = 'student' | 'tutor' | 'admin';

export interface CreateAccountRequest {
    email: string;
    password: string;
    role: UserRole;
}

export interface AccountCreatedResponse {
    id: string;
    email: string;
    fullName: string;
}

export interface Student {
    id: string;
    fullName: string;
    avatarUrl: string;
}

export type StudentEnrollmentType = '1-on-1' | 'Group' | 'Trial';
export type StudentStatus = 'Ongoing' | 'Completed';

export interface StudentListItem extends Student {
    email: string;
    enrollmentTypes: StudentEnrollmentType[];
    status: StudentStatus;
    registeredDate: string;
}



export interface PaginatedResponse<T> {
    content: T[]; // Array of items (Java standard naming)
    pageable: {
        pageNumber: number; // Current page number (0-based)
        pageSize: number; // Page size
        offset: number; // Offset from start
        paged: boolean; // Whether pagination is enabled
    };
    totalPages: number; // Total number of pages
    totalElements: number; // Total number of elements
    last: boolean; // Whether this is the last page
    first: boolean; // Whether this is the first page
    numberOfElements: number; // Number of elements in current page
    size: number; // Page size
    number: number; // Current page number (0-based)
    empty: boolean; // Whether the page is empty
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
}

export interface SignUpRequest {
    email: string;
    password: string;
    fullName: string;
}

export interface StartSignUpRequest {
    email: string;
    fullname: string;
    role: UserRole;
}

export interface SignUpResponse {
    message: string;
}




// Group Class Types
export interface PaymentRequest {
    paymentMethod: 'momo' | 'zalopay' | 'credit-card' | 'paypal';
    amount: number;
    currency: string;
}

export interface PaymentResponse {
    paymentId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    paymentUrl?: string; // For QR code payments like Momo, ZaloPay
    transactionId?: string;
    message: string;
}

export interface StudentStats {
    sessionsCompleted: number;
    totalSessions: number;
    sessionsRemaining: number;
    completionRate: number;
    attendanceRate: number;
    lastSessionDate: string;
}

export interface StudentContact {
    phone: string;
    joinedDate: string;
}

export interface StudentClassInfo {
    name: string;
    instructor: string;
    schedule: string;
}

export interface StudentPayment {
    status: string;
    nextDueDate: string;
    totalPaid: string;
}

export interface StudentSession {
    id: string;
    date: string;
    time?: string;
    duration: string;
    topic: string;
    attendance?: string;
}

export interface StudentCourseProgress {
    title: string;
    progress: number;
    type: '1-on-1' | 'Group' | 'Trial';
}

export interface StudentPerformance {
    testScores: number[];
    homeworkCompletion: number;
    averageScore: number;
}

export interface StudentCommunication {
    id: string;
    date: string;
    type: string;
    content: string;
}

export interface StudentDetail extends Student {
    stats: StudentStats;
    contact: StudentContact;
    class: StudentClassInfo;
    payment: StudentPayment;
    upcomingSessions: StudentSession[];
    sessionHistory: StudentSession[];
    courses: StudentCourseProgress[];
    performance: StudentPerformance;
    strengths: string[];
    weaknesses: string[];
    communications: StudentCommunication[];
    tutorNotes?: string;
}

export interface ClassStudent {
    id: string;
    name: string;
    avatar: string;
}

export interface ClassQuiz {
    id: string;
    title: string;
    status: 'Completed' | 'Pending';
}

export interface ClassMaterial {
    id: string;
    name: string;
    type: 'PDF' | 'Video' | 'ZIP';
    date: string;
}

export interface Class {
    id: string;
    courseTitle: string;
    students: ClassStudent[];
    type: '1-on-1' | 'Group';
    status: 'Ongoing' | 'Completed';
    schedules: ClassScheduleItem[];
    startDate: string;
    completedSessions: number;
    totalSessions: number;
    quizzes: ClassQuiz[];
    materials: ClassMaterial[];
}

export interface ClassStats {
    totalStudents: number;
    activeStudents: number;
    completedSessions: number;
    totalSessions: number;
    averageAttendance: number;
    averageProgress: number;
}

export interface ClassSession {
    id: string;
    date: string;
    time: string;
    duration: string;
    topic: string;
    attendance: { studentId: string; status: 'Present' | 'Absent' | 'Late' }[];
    materials: ClassMaterial[];
}

export interface ClassDetail extends Class {
    stats: ClassStats;
    sessions: ClassSession[];
    announcements: { id: string; title: string; content: string; date: string; author: string }[];
    assignments: { id: string; title: string; description: string; dueDate: string; submissions: number }[];
}

export type PayoutStatus = 'Completed' | 'Processing' | 'Failed';
export type PayoutMethodType = 'PayPal' | 'Bank';

export interface PayoutMethod {
    id: string; // UUID
    type: PayoutMethodType;
    identifier: string;
}

export interface PayoutHistoryItem {
    id: string;
    date: string;
    amount: number;
    method: PayoutMethod;
    status: PayoutStatus;
}

export interface PayoutSummary {
    availableBalance: number;
    pendingBalance: number;
    withdrawalCount: number;
    maxWithdrawals: number;
    minimumThreshold: number;
    commissionRate: number;
    nextPayoutDate: string;
    totalEarned: number;
    currentPaymentMethod?: PayoutMethod;
}

export interface PayoutFilters {
    status?: PayoutStatus;
    page?: number;
    limit?: number;
}

export interface RecentEarning {
    id: string;
    course: string;
    type: 'one-on-one' | 'Group';
    date: string;
    amount: number;
}

export interface RecentEarningsFilters {
    type?: '1-on-1' | 'Group' | 'All';
    page?: number;
    size?: number;
}

export interface UpdateTutorProfileRequest {
    // Basic Information
    fullName?: string;
    phone?: string;
    gender?: 'Male' | 'Female' | 'Not specified';
    country?: string;
    city?: string;
    nativeLanguage?: Language;
    languages?: Language[];

    // Professional Profile
    headline?: string;
    subjects?: Subject[];
    introduction?: string;

    // Social Links
    socialLinks?: SocialLink[];

    // Resume Highlights
    education?: EducationItem[];
    experience?: ExperienceItem[];
    certifications?: CertificationItem[];
}

export interface UploadFileResponse {
    fileUrl: string;
    fileName: string;
    fileSize: number;
}

// ===== TRIAL SESSION API =====
export interface TrialSessionRequest {
    tutorId: string; // UUID of the tutor
    studentId: string; // UUID of the student
    sessionDateTime: string; // ISO 8601 datetime (e.g., "2025-01-20T09:00:00.000Z") - UTC
    message?: string; // Optional message from student
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'DECLINED';

export interface TrialSessionRequestResponse {
    id: string;
    tutor?: TutorResponse;
    student?: Student;
    sessionDateTime: string;
    message?: string;
    status: RequestStatus;
    sessionId: string;
    createdAt: string;
}

