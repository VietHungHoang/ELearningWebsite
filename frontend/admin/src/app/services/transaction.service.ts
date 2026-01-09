import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ClassService } from './class.service';
import { UserService } from './user.service';
import { ApiService } from './api.service';
import { PaginatedResponse } from '../types/pagination';
import { CurrencyService } from './currency.service';

// Payment statuses for student payment
// Pending: Waiting for payment gateway callback (VNPay/Momo webhook will auto-update to completed/failed)
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentMethod = 'momo' | 'vnpay' | 'sepay';
export type ClassType = '1 and 1' | '1 and n';

// Payout status - monthly release to tutor
export type PayoutStatus = 'pending' | 'approved' | 'processing' | 'paid' | 'cancelled';

// Tutor wallet ledger - Auto-update when payout is paid to tutor's bank
// This is just a record/ledger, not an actual wallet (money goes to tutor's bank account)
export interface TutorWalletLedger {
    id: string;
    ledgerId: string;  // e.g., LEDGER-2025-NOV-001
    tutorId: string;
    tutorName: string;
    type: 'credit' | 'debit';  // 'credit' = payout received, 'debit' = tutor withdrawal
    amount: number;  // VND
    relatedPayoutId: string;  // Reference to MonthlyPayout that triggered this
    description: string;  // e.g., "November 2025 Payout"
    bankTransferInfo?: {
        bankName: string;
        accountNumber: string;
        transferDate: string;  // When transferred to tutor bank
        transferId: string;    // Bank transaction ID
    };
    createdDate: string;  // When ledger entry is created (after payout.status = 'paid')
    status: 'recorded';   // Always 'recorded' once payout is paid
}

// Session/Class booking that generates payment (simplified for display)
export interface TutoringSession {
    className: string;
    tutorName: string;
}

// Internal session data (for mock data only)
interface InternalSession {
    id: string;
    classId: string;
    className: string;
    tutorId: string;
    tutorName: string;
    studentIds: string[];
    classType: ClassType;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    ratePerHour: number;
    totalAmount: number;
    platformFeePercentage: number;
}

// Payment record - Student pays (simplified for display)
export interface Payment {
    id: string;
    paymentNumber: string;
    studentName: string;
    studentEmail: string;
    session?: TutoringSession;  // Only className and tutorName
    totalAmount: number;  // Full amount student pays
    currency: string;  // VND
    paymentMethod: PaymentMethod;
    status: PaymentStatus;  // 'pending', 'completed', 'failed'
    createdDate: string;
    transactionId?: string;  // Payment gateway transaction ID
}

// Internal payment data (for mock data only)
interface InternalPayment {
    id: string;
    paymentNumber: string;
    studentName: string;
    studentEmail: string;
    sessionId: string;
    session?: InternalSession;
    totalAmount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    createdDate: string;
    completedDate?: string;
    transactionId?: string;
    notes?: string;
    adminHoldAmount?: number;
    platformFeeAmount?: number;
    tutorEarnings?: number;
}

// Monthly payout - Admin pays tutor from held funds
// Flow: pending → approved → processing → paid
// When status changes to 'paid': money transfers to tutor's bank → tutor wallet ledger auto-updates
export interface MonthlyPayout {
    id: string;
    payoutNumber: string;
    tutorId: string;
    tutorName: string;
    payoutMonth: string;  // YYYY-MM format
    totalEarnings: number;  // Sum of all tutor earnings from payments that month
    totalSessions: number;  // Count of completed sessions
    totalHours: number;  // Total hours delivered
    status: PayoutStatus;  // 'pending' → 'approved' → 'processing' → 'paid'

    // Bank transfer info (filled when admin initiates transfer)
    bankAccountInfo: {
        accountNumber: string;
        bankName: string;
        accountHolder: string;
    };
    paymentMethod: PaymentMethod;  // How transfer happens (banking, momo, vnpay)
    relatedPaymentIds: string[];  // List of payment IDs included in this payout

    // Timestamps
    createdDate: string;  // When payout record created (end of month)
    approvedDate?: string;  // When admin approved
    paidDate?: string;  // When transferred to tutor's bank account

    // Transfer confirmation
    bankTransferInfo?: {
        transferId: string;  // Bank transaction ID
        transferDate: string;  // When money arrived at tutor's bank
        confirmationCode: string;  // Bank confirmation
    };

    notes?: string;
}

export interface TransactionFilters {
    status?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
}

export interface PaginationMeta {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface TransactionListResponse {
    data: Payment[];
    pagination: PaginationMeta;
    summary?: {
        totalRevenue: number;
        completedPayments: number;
        failedPayments: number;
    };
}

/**
 * Simplified Payment for API response (display only)
 */
export interface PaymentResponse {
    id: string;
    paymentNumber: string;
    studentName: string;
    studentEmail: string;
    session?: {
        className: string;
        tutorName: string;
    };
    totalAmount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    createdDate: string;
    transactionId?: string;
}

/**
 * Backend BookingHistoryResponse from booking-service
 * /api/v1/admin/transactions endpoint
 */
export interface BookingTransactionResponse {
    id: string;
    studentId: string;
    tutorId: string;
    tutorName: string;
    classId?: string;
    sessionsPurchased?: number;
    discount?: number;
    pricePerSession?: number;
    amount: number;
    paymentProvider: 'MOMO' | 'VNPAY' | 'SEPAY' | null;
    transactionId?: string;
    providerTransactionId?: string;
    schedule?: string;
    status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED';
    notes?: string;
    createdAt: string;
    updatedAt: string;
    className?: string;
    classType?: string;
}

/**
 * Backend TransactionDetailResponse from booking-service
 * /api/v1/admin/transactions/{id} endpoint
 */
export interface TransactionDetailResponse {
    id: string;
    transactionId?: string;
    providerTransactionId?: string;
    amount: number;
    discount?: number;
    pricePerSession?: number;
    sessionsPurchased?: number;
    paymentProvider: 'MOMO' | 'VNPAY' | 'SEPAY' | null;
    status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED';
    schedule?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    studentId: string;
    tutorId: string;
    tutorName: string;
    classId?: string;
    className?: string;
    classType?: string;
}

/**
 * API Response for transactions with pagination (Spring Page format)
 */
export interface TransactionsApiResponse {
    content: BookingTransactionResponse[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        sort?: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    numberOfElements: number;
    size: number;
    number: number;
    empty: boolean;
    sort?: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
}

/**
 * Summary response (can be filtered by summaryFilter params)
 */
export interface TransactionsSummary {
    totalRevenue: number;
    completedPayments: number;
    failedPayments: number;
    pendingPayments: number;
    averageOrderValue: number;
    successRate: number;  // Percentage 0-100

    // Trend indicators (compared to previous period)
    revenueTrend: number;  // Percentage change
    aovTrend: number;
    successRateTrend: number;
}

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private paymentsSubject = new BehaviorSubject<InternalPayment[]>([]);
    public payments$ = this.paymentsSubject.asObservable();

    private payoutsSubject = new BehaviorSubject<MonthlyPayout[]>([]);
    public payouts$ = this.payoutsSubject.asObservable();

    private walletLedgerSubject = new BehaviorSubject<TutorWalletLedger[]>([]);
    public walletLedger$ = this.walletLedgerSubject.asObservable();

    private currentFiltersSubject = new BehaviorSubject<TransactionFilters>({});

    constructor(
        private classService: ClassService,
        private userService: UserService,
        private apiService: ApiService,
        private currencyService: CurrencyService
    ) {
        this.loadMockData();
    }

    private loadMockData(): void {
        const mockPayments: InternalPayment[] = [
            {
                id: 'pay_001',
                paymentNumber: 'PAY-2025-NOV-001',
                studentName: 'John Smith',
                studentEmail: 'john.smith@example.com',
                sessionId: 'session_2025_nov_05_001',
                session: {
                    id: 'session_2025_nov_05_001',
                    classId: 'class_001',
                    className: 'React Advanced - 1-1',
                    tutorId: 'tutor_001',
                    tutorName: 'Đặng Minh Tuấn',
                    studentIds: ['student_001'],
                    classType: '1 and 1',
                    startTime: '2025-11-05T09:00:00',
                    endTime: '2025-11-05T11:00:00',
                    durationMinutes: 120,
                    ratePerHour: 500000,
                    totalAmount: 1000000,
                    platformFeePercentage: 20
                },
                totalAmount: 1000000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '2025-11-05',
                completedDate: '2025-11-05',
                transactionId: 'TXN-MOMO-12345',
                adminHoldAmount: 1000000,
                platformFeeAmount: 200000,
                tutorEarnings: 800000
            },
            {
                id: 'pay_002',
                paymentNumber: 'PAY-2025-NOV-002',
                studentName: 'Sarah Johnson',
                studentEmail: 'sarah.johnson@example.com',
                sessionId: 'session_2025_nov_04_001',
                session: {
                    id: 'session_2025_nov_04_001',
                    classId: 'class_002',
                    className: 'TypeScript Pro - 1-1',
                    tutorId: 'tutor_001',
                    tutorName: 'Đặng Minh Tuấn',
                    studentIds: ['learner_002'],
                    classType: '1 and 1',
                    startTime: '2025-11-04T14:00:00',
                    endTime: '2025-11-04T16:00:00',
                    durationMinutes: 120,
                    ratePerHour: 500000,
                    totalAmount: 1000000,
                    platformFeePercentage: 20
                },
                totalAmount: 1000000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '2025-11-04',
                completedDate: '2025-11-04',
                transactionId: 'TXN-VNPAY-12346',
                adminHoldAmount: 1000000,
                platformFeeAmount: 200000,
                tutorEarnings: 800000
            },
            {
                id: 'pay_003',
                paymentNumber: 'PAY-2025-NOV-003',
                studentName: 'Michael Chen',
                studentEmail: 'michael.chen@example.com',
                sessionId: 'session_2025_nov_03_001',
                session: {
                    id: 'session_2025_nov_03_001',
                    classId: 'class_003',
                    className: 'Python Fundamentals - Group',
                    tutorId: 'tutor_002',
                    tutorName: 'Nguyễn Thị Hương',
                    studentIds: ['learner_003', 'learner_004', 'learner_005'],
                    classType: '1 and n',
                    startTime: '2025-11-03T10:00:00',
                    endTime: '2025-11-03T12:00:00',
                    durationMinutes: 120,
                    ratePerHour: 400000,
                    totalAmount: 800000,
                    platformFeePercentage: 20
                },
                totalAmount: 800000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '2025-11-03',
                completedDate: '2025-11-03',
                transactionId: 'TXN-MOMO-12347',
                adminHoldAmount: 800000,
                platformFeeAmount: 160000,
                tutorEarnings: 640000
            },
            {
                id: 'pay_004',
                paymentNumber: 'PAY-2025-NOV-004',
                studentName: 'Emily Davis',
                studentEmail: 'emily.davis@example.com',
                sessionId: 'session_2025_nov_02_001',
                session: {
                    id: 'session_2025_nov_02_001',
                    classId: 'class_004',
                    className: 'Vue.js Mastery - 1-1',
                    tutorId: 'tutor_003',
                    tutorName: 'Trần Văn A',
                    studentIds: ['learner_006'],
                    classType: '1 and 1',
                    startTime: '2025-11-02T09:00:00',
                    endTime: '2025-11-02T10:00:00',
                    durationMinutes: 60,
                    ratePerHour: 400000,
                    totalAmount: 400000,
                    platformFeePercentage: 20
                },
                totalAmount: 400000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '2025-11-02',
                completedDate: '2025-11-02',
                transactionId: 'TXN-VNPAY-12348',
                adminHoldAmount: 400000,
                platformFeeAmount: 80000,
                tutorEarnings: 320000
            },
            {
                id: 'pay_005',
                paymentNumber: 'PAY-2025-NOV-005',
                studentName: 'David Wilson',
                studentEmail: 'david.wilson@example.com',
                sessionId: 'session_2025_nov_01_001',
                session: {
                    id: 'session_2025_nov_01_001',
                    classId: 'class_001',
                    className: 'Angular Basics - 1-1',
                    tutorId: 'tutor_001',
                    tutorName: 'Đặng Minh Tuấn',
                    studentIds: ['learner_007'],
                    classType: '1 and 1',
                    startTime: '2025-11-01T15:00:00',
                    endTime: '2025-11-01T17:00:00',
                    durationMinutes: 120,
                    ratePerHour: 350000,
                    totalAmount: 700000,
                    platformFeePercentage: 20
                },
                totalAmount: 700000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '2025-11-01',
                completedDate: '2025-11-01',
                transactionId: 'TXN-MOMO-12349',
                adminHoldAmount: 700000,
                platformFeeAmount: 140000,
                tutorEarnings: 560000
            },
            {
                id: 'pay_006',
                paymentNumber: 'PAY-2025-OCT-006',
                studentName: 'Jessica Brown',
                studentEmail: 'jessica.brown@example.com',
                sessionId: 'session_2025_oct_31_001',
                session: {
                    id: 'session_2025_oct_31_001',
                    classId: 'class_002',
                    className: 'JavaScript Essentials - Group',
                    tutorId: 'tutor_004',
                    tutorName: 'Lê Thị B',
                    studentIds: ['learner_008', 'learner_009'],
                    classType: '1 and n',
                    startTime: '2025-10-31T18:00:00',
                    endTime: '2025-10-31T20:00:00',
                    durationMinutes: 120,
                    ratePerHour: 300000,
                    totalAmount: 600000,
                    platformFeePercentage: 20
                },
                totalAmount: 600000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '2025-10-31',
                completedDate: '2025-10-31',
                transactionId: 'TXN-VNPAY-12350',
                adminHoldAmount: 600000,
                platformFeeAmount: 120000,
                tutorEarnings: 480000
            },
            {
                id: 'pay_007',
                paymentNumber: 'PAY-2025-OCT-007',
                studentName: 'Robert Taylor',
                studentEmail: 'robert.taylor@example.com',
                sessionId: 'session_2025_oct_30_001',
                session: {
                    id: 'session_2025_oct_30_001',
                    classId: 'class_005',
                    className: 'React Advanced - 1-1',
                    tutorId: 'tutor_002',
                    tutorName: 'Nguyễn Thị Hương',
                    studentIds: ['learner_010'],
                    classType: '1 and 1',
                    startTime: '2025-10-30T13:00:00',
                    endTime: '2025-10-30T14:30:00',
                    durationMinutes: 90,
                    ratePerHour: 500000,
                    totalAmount: 750000,
                    platformFeePercentage: 20
                },
                totalAmount: 750000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '2025-10-30',
                completedDate: '2025-10-30',
                transactionId: 'TXN-MOMO-12351',
                adminHoldAmount: 750000,
                platformFeeAmount: 150000,
                tutorEarnings: 600000
            },
            {
                id: 'pay_008',
                paymentNumber: 'PAY-2025-OCT-008',
                studentName: 'Lisa Anderson',
                studentEmail: 'lisa.anderson@example.com',
                sessionId: 'session_2025_oct_29_001',
                session: {
                    id: 'session_2025_oct_29_001',
                    classId: 'class_006',
                    className: 'Node.js Backend - 1-1',
                    tutorId: 'tutor_003',
                    tutorName: 'Trần Văn A',
                    studentIds: ['learner_011'],
                    classType: '1 and 1',
                    startTime: '2025-10-29T11:00:00',
                    endTime: '2025-10-29T13:00:00',
                    durationMinutes: 120,
                    ratePerHour: 450000,
                    totalAmount: 900000,
                    platformFeePercentage: 20
                },
                totalAmount: 900000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '2025-10-29',
                completedDate: '2025-10-29',
                transactionId: 'TXN-VNPAY-12352',
                adminHoldAmount: 900000,
                platformFeeAmount: 180000,
                tutorEarnings: 720000
            },
            {
                id: 'pay_009',
                paymentNumber: 'PAY-2025-OCT-009',
                studentName: 'James Martinez',
                studentEmail: 'james.martinez@example.com',
                sessionId: 'session_2025_oct_28_001',
                session: {
                    id: 'session_2025_oct_28_001',
                    classId: 'class_003',
                    className: 'CSS Styling - Group',
                    tutorId: 'tutor_001',
                    tutorName: 'Đặng Minh Tuấn',
                    studentIds: ['learner_012', 'learner_013', 'learner_014', 'learner_015'],
                    classType: '1 and n',
                    startTime: '2025-10-28T19:00:00',
                    endTime: '2025-10-28T21:00:00',
                    durationMinutes: 120,
                    ratePerHour: 250000,
                    totalAmount: 500000,
                    platformFeePercentage: 20
                },
                totalAmount: 500000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '2025-10-28',
                completedDate: '2025-10-28',
                transactionId: 'TXN-MOMO-12353',
                adminHoldAmount: 500000,
                platformFeeAmount: 100000,
                tutorEarnings: 400000
            },
            {
                id: 'pay_010',
                paymentNumber: 'PAY-2025-OCT-010',
                studentName: 'Nicole Garcia',
                studentEmail: 'nicole.garcia@example.com',
                sessionId: 'session_2025_oct_27_001',
                session: {
                    id: 'session_2025_oct_27_001',
                    classId: 'class_004',
                    className: 'React Advanced - Group',
                    tutorId: 'tutor_004',
                    tutorName: 'Lê Thị B',
                    studentIds: ['learner_016', 'learner_017'],
                    classType: '1 and n',
                    startTime: '2025-10-27T10:00:00',
                    endTime: '2025-10-27T12:00:00',
                    durationMinutes: 120,
                    ratePerHour: 350000,
                    totalAmount: 700000,
                    platformFeePercentage: 20
                },
                totalAmount: 700000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '2025-10-27',
                completedDate: '2025-10-27',
                transactionId: 'TXN-VNPAY-12354',
                adminHoldAmount: 700000,
                platformFeeAmount: 140000,
                tutorEarnings: 560000
            },
            {
                id: 'pay_011',
                paymentNumber: 'PAY-2025-OCT-011',
                studentName: 'Thomas Anderson',
                studentEmail: 'thomas.anderson@example.com',
                sessionId: 'session_2025_oct_26_001',
                session: {
                    id: 'session_2025_oct_26_001',
                    classId: 'class_006',
                    className: 'Node.js Backend - 1-1',
                    tutorId: 'tutor_002',
                    tutorName: 'Nguyễn Thị Hương',
                    studentIds: ['learner_018'],
                    classType: '1 and 1',
                    startTime: '2025-10-26T16:00:00',
                    endTime: '2025-10-26T17:00:00',
                    durationMinutes: 60,
                    ratePerHour: 500000,
                    totalAmount: 500000,
                    platformFeePercentage: 20
                },
                totalAmount: 500000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '2025-10-26',
                completedDate: '2025-10-26',
                transactionId: 'TXN-MOMO-12355',
                adminHoldAmount: 500000,
                platformFeeAmount: 100000,
                tutorEarnings: 400000
            },
            {
                id: 'pay_012',
                paymentNumber: 'PAY-2025-OCT-012',
                studentName: 'Patricia White',
                studentEmail: 'patricia.white@example.com',
                sessionId: 'session_2025_oct_25_001',
                session: {
                    id: 'session_2025_oct_25_001',
                    classId: 'class_007',
                    className: 'Database Design - Group',
                    tutorId: 'tutor_003',
                    tutorName: 'Trần Văn A',
                    studentIds: ['learner_019', 'learner_020'],
                    classType: '1 and n',
                    startTime: '2025-10-25T14:00:00',
                    endTime: '2025-10-25T15:30:00',
                    durationMinutes: 90,
                    ratePerHour: 400000,
                    totalAmount: 600000,
                    platformFeePercentage: 20
                },
                totalAmount: 600000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '2025-10-25',
                completedDate: '2025-10-25',
                transactionId: 'TXN-VNPAY-12356',
                adminHoldAmount: 600000,
                platformFeeAmount: 120000,
                tutorEarnings: 480000
            },
            {
                id: 'pay_013',
                paymentNumber: 'PAY-2025-OCT-013',
                studentName: 'Daniel Lee',
                studentEmail: 'daniel.lee@example.com',
                sessionId: 'session_2025_oct_24_001',
                session: {
                    id: 'session_2025_oct_24_001',
                    classId: 'class_008',
                    className: 'Git & Version Control - 1-1',
                    tutorId: 'tutor_001',
                    tutorName: 'Đặng Minh Tuấn',
                    studentIds: ['learner_021'],
                    classType: '1 and 1',
                    startTime: '2025-10-24T12:00:00',
                    endTime: '2025-10-24T13:00:00',
                    durationMinutes: 60,
                    ratePerHour: 300000,
                    totalAmount: 300000,
                    platformFeePercentage: 20
                },
                totalAmount: 300000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '2025-10-24',
                completedDate: '2025-10-24',
                transactionId: 'TXN-MOMO-12357',
                adminHoldAmount: 300000,
                platformFeeAmount: 60000,
                tutorEarnings: 240000
            },
            {
                id: 'pay_014',
                paymentNumber: 'PAY-2025-OCT-014',
                studentName: 'Susan Harris',
                studentEmail: 'susan.harris@example.com',
                sessionId: 'session_2025_oct_23_001',
                session: {
                    id: 'session_2025_oct_23_001',
                    classId: 'class_005',
                    className: 'Database Design - 1-1',
                    tutorId: 'tutor_004',
                    tutorName: 'Lê Thị B',
                    studentIds: ['learner_022'],
                    classType: '1 and 1',
                    startTime: '2025-10-23T09:00:00',
                    endTime: '2025-10-23T11:00:00',
                    durationMinutes: 120,
                    ratePerHour: 450000,
                    totalAmount: 900000,
                    platformFeePercentage: 20
                },
                totalAmount: 900000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '2025-10-23',
                completedDate: '2025-10-23',
                transactionId: 'TXN-VNPAY-12358',
                adminHoldAmount: 900000,
                platformFeeAmount: 180000,
                tutorEarnings: 720000
            },
            {
                id: 'pay_015',
                paymentNumber: 'PAY-2025-OCT-015',
                studentName: 'Christopher Martin',
                studentEmail: 'christopher.martin@example.com',
                sessionId: 'session_2025_oct_22_001',
                session: {
                    id: 'session_2025_oct_22_001',
                    classId: 'class_002',
                    className: 'Git & Version Control - Group',
                    tutorId: 'tutor_002',
                    tutorName: 'Nguyễn Thị Hương',
                    studentIds: ['learner_023', 'learner_024', 'learner_025'],
                    classType: '1 and n',
                    startTime: '2025-10-22T17:00:00',
                    endTime: '2025-10-22T18:30:00',
                    durationMinutes: 90,
                    ratePerHour: 300000,
                    totalAmount: 450000,
                    platformFeePercentage: 20
                },
                totalAmount: 450000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '2025-10-22',
                completedDate: '2025-10-22',
                transactionId: 'TXN-MOMO-12359',
                adminHoldAmount: 450000,
                platformFeeAmount: 90000,
                tutorEarnings: 360000
            },
            {
                id: 'pay_016',
                paymentNumber: 'PAY-2025-OCT-016',
                studentName: 'Linda Thompson',
                studentEmail: 'linda.thompson@example.com',
                sessionId: 'session_2025_oct_21_001',
                session: {
                    id: 'session_2025_oct_21_001',
                    classId: 'class_001',
                    className: 'TypeScript Pro - Group',
                    tutorId: 'tutor_003',
                    tutorName: 'Trần Văn A',
                    studentIds: ['learner_026', 'learner_027'],
                    classType: '1 and n',
                    startTime: '2025-10-21T15:00:00',
                    endTime: '2025-10-21T16:30:00',
                    durationMinutes: 90,
                    ratePerHour: 350000,
                    totalAmount: 525000,
                    platformFeePercentage: 20
                },
                totalAmount: 525000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '2025-10-21',
                completedDate: '2025-10-21',
                transactionId: 'TXN-VNPAY-12360',
                adminHoldAmount: 525000,
                platformFeeAmount: 105000,
                tutorEarnings: 420000
            },
            {
                id: 'pay_017',
                paymentNumber: 'PAY-2025-OCT-017',
                studentName: 'Betty Jackson',
                studentEmail: 'betty.jackson@example.com',
                sessionId: 'session_2025_oct_20_001',
                session: {
                    id: 'session_2025_oct_20_001',
                    classId: 'class_009',
                    className: 'Python Fundamentals - 1-1',
                    tutorId: 'tutor_001',
                    tutorName: 'Đặng Minh Tuấn',
                    studentIds: ['learner_028'],
                    classType: '1 and 1',
                    startTime: '2025-10-20T10:00:00',
                    endTime: '2025-10-20T12:00:00',
                    durationMinutes: 120,
                    ratePerHour: 500000,
                    totalAmount: 1000000,
                    platformFeePercentage: 20
                },
                totalAmount: 1000000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '2025-10-20',
                completedDate: '2025-10-20',
                transactionId: 'TXN-MOMO-12361',
                adminHoldAmount: 1000000,
                platformFeeAmount: 200000,
                tutorEarnings: 800000
            },
            {
                id: 'pay_018',
                paymentNumber: 'PAY-2025-OCT-018',
                studentName: 'Mark Davies',
                studentEmail: 'mark.davies@example.com',
                sessionId: 'session_2025_oct_19_001',
                session: {
                    id: 'session_2025_oct_19_001',
                    classId: 'class_004',
                    className: 'Vue.js Mastery - Group',
                    tutorId: 'tutor_004',
                    tutorName: 'Lê Thị B',
                    studentIds: ['learner_029', 'learner_030', 'learner_031', 'learner_032'],
                    classType: '1 and n',
                    startTime: '2025-10-19T18:00:00',
                    endTime: '2025-10-19T19:30:00',
                    durationMinutes: 90,
                    ratePerHour: 250000,
                    totalAmount: 375000,
                    platformFeePercentage: 20
                },
                totalAmount: 375000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '2025-10-19',
                completedDate: '2025-10-19',
                transactionId: 'TXN-VNPAY-12362',
                adminHoldAmount: 375000,
                platformFeeAmount: 75000,
                tutorEarnings: 300000
            },
            {
                id: 'pay_019',
                paymentNumber: 'PAY-2025-OCT-019',
                studentName: 'Donald Miller',
                studentEmail: 'donald.miller@example.com',
                sessionId: 'session_2025_oct_18_001',
                session: {
                    id: 'session_2025_oct_18_001',
                    classId: 'class_003',
                    className: 'JavaScript Essentials - 1-1',
                    tutorId: 'tutor_002',
                    tutorName: 'Nguyễn Thị Hương',
                    studentIds: ['learner_033'],
                    classType: '1 and 1',
                    startTime: '2025-10-18T13:00:00',
                    endTime: '2025-10-18T15:00:00',
                    durationMinutes: 120,
                    ratePerHour: 500000,
                    totalAmount: 1000000,
                    platformFeePercentage: 20
                },
                totalAmount: 1000000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'pending',
                createdDate: '2025-10-18',
                completedDate: undefined,
                transactionId: 'TXN-MOMO-12363',
                adminHoldAmount: 1000000,
                platformFeeAmount: 200000,
                tutorEarnings: 800000
            },
            {
                id: 'pay_020',
                paymentNumber: 'PAY-2025-OCT-020',
                studentName: 'Dorothy Moore',
                studentEmail: 'dorothy.moore@example.com',
                sessionId: 'session_2025_oct_17_001',
                session: {
                    id: 'session_2025_oct_17_001',
                    classId: 'class_008',
                    className: 'CSS Styling - 1-1',
                    tutorId: 'tutor_003',
                    tutorName: 'Trần Văn A',
                    studentIds: ['learner_034'],
                    classType: '1 and 1',
                    startTime: '2025-10-17T11:00:00',
                    endTime: '2025-10-17T12:30:00',
                    durationMinutes: 90,
                    ratePerHour: 400000,
                    totalAmount: 600000,
                    platformFeePercentage: 20
                },
                totalAmount: 600000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'pending',
                createdDate: '2025-10-17',
                notes: 'Waiting for payment gateway callback',
                transactionId: 'TXN-VNPAY-12364'
            },
            // Failed transactions for realistic success rate
            {
                id: 'pay_021',
                paymentNumber: 'PAY-2025-NOV-021',
                studentName: 'Mike Wilson',
                studentEmail: 'mike.wilson@example.com',
                sessionId: 'session_2025_nov_03_002',
                session: {
                    id: 'session_2025_nov_03_002',
                    classId: 'class_005',
                    className: 'Node.js Backend - 1-1',
                    tutorId: 'tutor_002',
                    tutorName: 'Nguyễn Thị C',
                    studentIds: ['learner_033'],
                    classType: '1 and 1',
                    startTime: '2025-11-03T14:00:00',
                    endTime: '2025-11-03T16:00:00',
                    durationMinutes: 120,
                    ratePerHour: 450000,
                    totalAmount: 900000,
                    platformFeePercentage: 20
                },
                totalAmount: 900000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'failed',
                createdDate: '2025-11-03',
                notes: 'Payment timeout - VNPay gateway error'
            },
            {
                id: 'pay_022',
                paymentNumber: 'PAY-2025-NOV-022',
                studentName: 'Anna Lee',
                studentEmail: 'anna.lee@example.com',
                sessionId: 'session_2025_nov_02_003',
                session: {
                    id: 'session_2025_nov_02_003',
                    classId: 'class_003',
                    className: 'Python AI - Group',
                    tutorId: 'tutor_003',
                    tutorName: 'Trần Văn A',
                    studentIds: ['learner_034', 'learner_035'],
                    classType: '1 and n',
                    startTime: '2025-11-02T10:00:00',
                    endTime: '2025-11-02T11:30:00',
                    durationMinutes: 90,
                    ratePerHour: 350000,
                    totalAmount: 525000,
                    platformFeePercentage: 20
                },
                totalAmount: 525000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'failed',
                createdDate: '2025-11-02',
                notes: 'Insufficient balance'
            },
            {
                id: 'pay_023',
                paymentNumber: 'PAY-2025-OCT-023',
                studentName: 'David Chen',
                studentEmail: 'david.chen@example.com',
                sessionId: 'session_2025_oct_25_004',
                session: {
                    id: 'session_2025_oct_25_004',
                    classId: 'class_007',
                    className: 'Java Spring Boot - 1-1',
                    tutorId: 'tutor_004',
                    tutorName: 'Lê Thị B',
                    studentIds: ['learner_036'],
                    classType: '1 and 1',
                    startTime: '2025-10-25T13:00:00',
                    endTime: '2025-10-25T15:00:00',
                    durationMinutes: 120,
                    ratePerHour: 500000,
                    totalAmount: 1000000,
                    platformFeePercentage: 20
                },
                totalAmount: 1000000,
                currency: 'VND',
                paymentMethod: 'sepay',
                status: 'failed',
                createdDate: '2025-10-25',
                notes: 'Card declined'
            }
        ];

        this.paymentsSubject.next(mockPayments);
    }

    /**
     * Get transactions from API with pagination, filters, and summary
     * API Endpoint: GET /api/v1/admin/transactions
     * Query Params:
     *   - page, size, status, paymentMethod, search, startDate, endDate, sortOrder, typeFilter (for table)
     *   - summaryFilter (for KPI cards: 'today' | 'thisWeek' | 'thisMonth')
     * @returns Observable of TransactionsApiResponse with summary
     */
    getTransactions(params?: {
        page?: number;
        size?: number;
        status?: PaymentStatus;
        paymentMethod?: PaymentMethod;
        search?: string;
        startDate?: string;
        endDate?: string;
        sortOrder?: 'asc' | 'desc';
        typeFilter?: '1 and 1' | '1 and n';
        summaryFilter?: string; // Filter for summary/KPI cards: 'today' | 'thisWeek' | 'thisMonth'
    }): Observable<TransactionsApiResponse> {
        const queryParams: any = {};
        if (params?.page !== undefined) queryParams.page = params.page - 1; // Convert to 0-based
        if (params?.size !== undefined) queryParams.size = params.size;
        if (params?.status) queryParams.status = params.status;
        if (params?.paymentMethod) queryParams.paymentMethod = params.paymentMethod;
        if (params?.search) queryParams.search = params.search;
        if (params?.startDate) queryParams.startDate = params.startDate;
        if (params?.endDate) queryParams.endDate = params.endDate;
        if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
        if (params?.typeFilter) queryParams.typeFilter = params.typeFilter;
        if (params?.summaryFilter) queryParams.summaryFilter = params.summaryFilter; // Filter for summary/KPI cards

        return this.apiService.get<TransactionsApiResponse>('/transactions', queryParams).pipe(
            map(response => {
                if (response.success && response.data) {
                    // Return raw API response - transformation to PaymentResponse 
                    // should be done in component using transformBookingToPayment
                    return response.data;
                }
                // If API returns error response, use mock data
                console.warn('[TransactionService] API failed:', response.message);
                return this.getMockTransactionsResponse(params);
            }),
            catchError(error => {
                // If API throws error, use mock data
                console.warn('[TransactionService] API error:', error);
                return of(this.getMockTransactionsResponse(params));
            })
        );
    }

    /**
     * Get transaction detail by ID from API
     * API Endpoint: GET /api/v1/admin/transactions/{id}
     * @param id Transaction/Booking ID
     * @returns Observable of TransactionDetailResponse
     */
    getTransactionById(id: string): Observable<TransactionDetailResponse> {
        return this.apiService.get<TransactionDetailResponse>(`/transactions/${id}`).pipe(
            map(response => {
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to fetch transaction detail');
            }),
            catchError(error => {
                console.error('[TransactionService] Error fetching transaction detail:', error);
                throw error;
            })
        );
    }

    /**
     * Get mock transactions response for fallback
     * Converts internal mock data to BookingTransactionResponse format
     */
    private getMockTransactionsResponse(params?: {
        page?: number;
        size?: number;
        status?: PaymentStatus;
        paymentMethod?: PaymentMethod;
        search?: string;
        startDate?: string;
        endDate?: string;
        sortOrder?: 'asc' | 'desc';
        typeFilter?: '1 and 1' | '1 and n';
        summaryFilter?: string;
    }): TransactionsApiResponse {
        const allPayments = this.paymentsSubject.value;
        let filtered = [...allPayments];

        // Apply filters
        if (params?.status) {
            filtered = filtered.filter(payment => payment.status === params.status);
        }

        if (params?.paymentMethod) {
            filtered = filtered.filter(payment => payment.paymentMethod === params.paymentMethod);
        }

        if (params?.typeFilter) {
            filtered = filtered.filter(payment => {
                const internalSession = (payment as any).session as InternalSession | undefined;
                if (params.typeFilter === '1 and 1') {
                    return internalSession?.classType === '1 and 1';
                } else {
                    return internalSession?.classType === '1 and n';
                }
            });
        }

        if (params?.startDate || params?.endDate) {
            filtered = filtered.filter(payment => {
                const paymentDate = new Date(payment.createdDate);
                if (params.startDate) {
                    const startDate = new Date(params.startDate);
                    startDate.setHours(0, 0, 0, 0);
                    if (paymentDate < startDate) return false;
                }
                if (params.endDate) {
                    const endDate = new Date(params.endDate);
                    endDate.setHours(23, 59, 59, 999);
                    if (paymentDate > endDate) return false;
                }
                return true;
            });
        }

        if (params?.search) {
            const searchLower = params.search.toLowerCase();
            filtered = filtered.filter(payment => {
                const internalSession = payment.session as InternalSession | undefined;
                return payment.id.toLowerCase().includes(searchLower) ||
                    payment.paymentNumber.toLowerCase().includes(searchLower) ||
                    payment.studentName.toLowerCase().includes(searchLower) ||
                    payment.studentEmail.toLowerCase().includes(searchLower) ||
                    internalSession?.className.toLowerCase().includes(searchLower) ||
                    internalSession?.tutorName.toLowerCase().includes(searchLower);
            });
        }

        // Sort
        if (params?.sortOrder) {
            filtered.sort((a, b) => {
                const dateA = new Date(a.createdDate).getTime();
                const dateB = new Date(b.createdDate).getTime();
                return params.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            });
        }

        // Transform InternalPayment to BookingTransactionResponse format
        const transformedPayments: BookingTransactionResponse[] = filtered.map(payment => {
            const internalSession = payment.session as InternalSession | undefined;

            // Map FE paymentMethod to BE paymentProvider
            const providerMap: { [key: string]: 'MOMO' | 'VNPAY' | 'SEPAY' } = {
                'momo': 'MOMO',
                'vnpay': 'VNPAY',
                'banking': 'SEPAY'
            };

            // Map FE status to BE status
            const statusMap: { [key: string]: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED' } = {
                'pending': 'PENDING',
                'completed': 'CONFIRMED',
                'failed': 'FAILED'
            };

            return {
                id: payment.id,
                studentId: payment.sessionId || payment.id, // Use sessionId or fallback
                tutorId: internalSession?.tutorId || '',
                tutorName: internalSession?.tutorName || '',
                classId: internalSession?.classId || undefined,
                sessionsPurchased: 1,
                discount: 0,
                pricePerSession: payment.totalAmount,
                amount: payment.totalAmount,
                paymentProvider: providerMap[payment.paymentMethod] || null,
                transactionId: payment.transactionId || undefined,
                providerTransactionId: payment.transactionId || undefined,
                schedule: undefined,
                status: statusMap[payment.status] || 'PENDING',
                notes: payment.notes || undefined,
                createdAt: payment.createdDate,
                updatedAt: payment.completedDate || payment.createdDate,
                className: internalSession?.className || '',
                classType: internalSession?.classType || ''
            };
        });

        // Pagination
        const page = (params?.page ?? 1) - 1; // Convert to 0-based
        const size = params?.size ?? 10;
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedContent = transformedPayments.slice(startIndex, endIndex);
        const totalElements = transformedPayments.length;
        const totalPages = Math.ceil(totalElements / size);

        return {
            content: paginatedContent,
            pageable: {
                pageNumber: page,
                pageSize: size,
                offset: startIndex,
                paged: true
            },
            totalPages: totalPages,
            totalElements: totalElements,
            last: page >= totalPages - 1,
            first: page === 0,
            numberOfElements: paginatedContent.length,
            size: size,
            number: page,
            empty: paginatedContent.length === 0
        };
    }

    /**
     * Transform payment to simplified format for API response
     */
    private transformPayment(payment: InternalPayment | PaymentResponse): PaymentResponse {
        // If already transformed (PaymentResponse), return as is
        if ('tutorName' in (payment.session || {}) || !payment.session) {
            return payment as PaymentResponse;
        }

        // Transform from InternalPayment
        const internalPayment = payment as InternalPayment;
        const internalSession = internalPayment.session as InternalSession | undefined;

        const session = internalSession ? {
            className: internalSession.className || '',
            tutorName: internalSession.tutorName || ''
        } : undefined;

        return {
            id: internalPayment.id,
            paymentNumber: internalPayment.paymentNumber,
            studentName: internalPayment.studentName,
            studentEmail: internalPayment.studentEmail,
            session: session,
            totalAmount: internalPayment.totalAmount,
            currency: internalPayment.currency || 'VND',
            paymentMethod: internalPayment.paymentMethod,
            status: internalPayment.status,
            createdDate: internalPayment.createdDate,
            transactionId: internalPayment.transactionId
        };
    }

    /**
     * Transform BookingTransactionResponse from BE to PaymentResponse for display
     */
    transformBookingToPayment(booking: BookingTransactionResponse): PaymentResponse {
        // Map BE paymentProvider to FE paymentMethod
        const paymentMethodMap: { [key: string]: PaymentMethod } = {
            'MOMO': 'momo',
            'VNPAY': 'vnpay',
            'SEPAY': 'sepay'
        };

        // Map BE status to FE status
        const statusMap: { [key: string]: PaymentStatus } = {
            'PENDING': 'pending',
            'CONFIRMED': 'completed',
            'FAILED': 'failed',
            'CANCELLED': 'failed'
        };

        return {
            id: booking.id,
            paymentNumber: `PAY-${booking.id.substring(0, 8).toUpperCase()}`,
            studentName: `Student ${booking.studentId?.substring(0, 8) || 'Unknown'}`, // TODO: Fetch student name from API
            studentEmail: '', // Not available in booking response
            session: {
                className: booking.className || (booking.classId ? `class ${booking.classId.substring(0, 8)}` : 'Unknown Class'),
                tutorName: booking.tutorName || 'Unknown Tutor'
            },
            totalAmount: booking.amount || 0,
            currency: 'VND',
            paymentMethod: paymentMethodMap[booking.paymentProvider || ''] || 'vnpay',
            status: statusMap[booking.status] || 'pending',
            createdDate: booking.createdAt || '',
            transactionId: booking.providerTransactionId || booking.transactionId
        };
    }

    // Get all payments (transformed to simplified format)
    getPayments(): Observable<Payment[]> {
        return this.payments$.pipe(
            map(payments => payments.map(p => this.transformPayment(p)))
        );
    }

    // Get filtered payments (legacy method - kept for backward compatibility)
    getPaymentsFiltered(filters: TransactionFilters, page: number = 1, pageSize: number = 10): Payment[] {
        const allInternalPayments = this.paymentsSubject.value;
        const allPayments = allInternalPayments.map(p => this.transformPayment(p));
        let filtered = [...allPayments];

        if (filters.status) {
            filtered = filtered.filter(payment => payment.status === filters.status);
        }

        if (filters.paymentMethod) {
            filtered = filtered.filter(payment => payment.paymentMethod === filters.paymentMethod);
        }

        if (filters.startDate || filters.endDate) {
            filtered = filtered.filter(payment => {
                const paymentDate = new Date(payment.createdDate);
                const startDate = filters.startDate ? new Date(filters.startDate) : new Date('1900-01-01');
                const endDate = filters.endDate ? new Date(filters.endDate) : new Date('2100-12-31');
                return paymentDate >= startDate && paymentDate <= endDate;
            });
        }

        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(payment =>
                payment.id.toLowerCase().includes(searchLower) ||
                payment.paymentNumber.toLowerCase().includes(searchLower) ||
                payment.studentName.toLowerCase().includes(searchLower) ||
                payment.studentEmail.toLowerCase().includes(searchLower)
            );
        }

        // Pagination
        const startIndex = (page - 1) * pageSize;
        return filtered.slice(startIndex, startIndex + pageSize);
    }

    // Get single payment by ID
    getPaymentById(id: string): Payment | undefined {
        const internalPayment = this.paymentsSubject.value.find(payment => payment.id === id);
        return internalPayment ? this.transformPayment(internalPayment) : undefined;
    }

    // Manually approve a pending payment (fallback if webhook fails)
    // Normally payment gateway webhook auto-updates pending → completed/failed
    approvePaymentManually(paymentId: string, notes?: string): boolean {
        const payments = this.paymentsSubject.value;
        const payment = payments.find(p => p.id === paymentId);

        if (!payment || payment.status !== 'pending') {
            console.error('Cannot approve: Payment not found or not in pending status');
            return false;
        }

        payment.status = 'completed';
        payment.completedDate = this.getCurrentDate();
        if (notes) {
            payment.notes = notes;
        }

        // Calculate earnings if not set
        if (!payment.adminHoldAmount) {
            payment.adminHoldAmount = payment.totalAmount;
        }
        if (!payment.platformFeeAmount && payment.session) {
            payment.platformFeeAmount = payment.totalAmount * (payment.session.platformFeePercentage / 100);
        }
        if (!payment.tutorEarnings) {
            payment.tutorEarnings = payment.totalAmount - (payment.platformFeeAmount || 0);
        }

        this.paymentsSubject.next([...payments]);
        return true;
    }

    // Get all monthly payouts
    getPayouts(): Observable<MonthlyPayout[]> {
        return this.payouts$;
    }

    // Get payouts by tutor
    getPayoutsByTutor(tutorId: string): MonthlyPayout[] {
        return this.payoutsSubject.value.filter(p => p.tutorId === tutorId);
    }

    // Get pending payouts
    getPendingPayouts(): MonthlyPayout[] {
        return this.payoutsSubject.value.filter(p => p.status === 'pending' || p.status === 'approved');
    }

    // Create monthly payout from completed payments
    createMonthlyPayout(tutorId: string, tutorName: string, month: string, paymentIds: string[]): MonthlyPayout {
        const payments = this.paymentsSubject.value.filter(p => paymentIds.includes(p.id) && p.status === 'completed');

        const totalEarnings = payments.reduce((sum, p) => sum + (p.tutorEarnings || 0), 0);
        const totalHours = payments.reduce((sum, p) => {
            const internalSession = p.session as InternalSession | undefined;
            return sum + (internalSession?.durationMinutes || 0);
        }, 0) / 60;

        const payout: MonthlyPayout = {
            id: `payout_${Date.now()}`,
            payoutNumber: `PAYOUT-${month}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            tutorId,
            tutorName,
            payoutMonth: month,
            totalEarnings,
            totalSessions: payments.length,
            totalHours,
            status: 'pending',
            bankAccountInfo: {
                accountNumber: '',
                bankName: '',
                accountHolder: tutorName
            },
            paymentMethod: 'sepay',
            relatedPaymentIds: paymentIds,
            createdDate: this.getCurrentDate()
        };

        const currentPayouts = this.payoutsSubject.value;
        this.payoutsSubject.next([...currentPayouts, payout]);

        return payout;
    }

    // Update payout status
    updatePayoutStatus(payoutId: string, status: PayoutStatus, notes?: string): boolean {
        const payouts = this.payoutsSubject.value;
        const payout = payouts.find(p => p.id === payoutId);

        if (!payout) {
            console.error('Payout not found');
            return false;
        }

        const previousStatus = payout.status;
        payout.status = status;

        if (notes) {
            payout.notes = notes;
        }

        // Add timestamp when status changes
        if (status === 'approved' && !payout.approvedDate) {
            payout.approvedDate = this.getCurrentDate();
        }

        if (status === 'paid' && !payout.paidDate) {
            payout.paidDate = this.getCurrentDate();

            // Auto-create tutor wallet ledger entry when payout is paid
            this.updateTutorWalletLedger(payout);
        }

        this.payoutsSubject.next([...payouts]);
        return true;
    }

    // Auto-update tutor wallet ledger when payout is confirmed paid
    private updateTutorWalletLedger(payout: MonthlyPayout): void {
        if (payout.status !== 'paid') {
            return;
        }

        const ledgerEntry: TutorWalletLedger = {
            id: `ledger_${Date.now()}`,
            ledgerId: `LEDGER-${payout.payoutMonth}-${payout.tutorId}`,
            tutorId: payout.tutorId,
            tutorName: payout.tutorName,
            type: 'credit',
            amount: payout.totalEarnings,
            relatedPayoutId: payout.id,
            description: `${payout.payoutMonth} Payout - ${payout.totalSessions} sessions`,
            bankTransferInfo: payout.bankTransferInfo ? {
                bankName: payout.bankTransferInfo.transferId || '',
                accountNumber: payout.bankAccountInfo.accountNumber,
                transferDate: payout.paidDate || this.getCurrentDate(),
                transferId: payout.bankTransferInfo.transferId
            } : undefined,
            createdDate: payout.paidDate || this.getCurrentDate(),
            status: 'recorded'
        };

        const currentLedger = this.walletLedgerSubject.value;
        this.walletLedgerSubject.next([...currentLedger, ledgerEntry]);
    }

    // Get tutor wallet ledger
    getTutorWalletLedger(): Observable<TutorWalletLedger[]> {
        return this.walletLedger$;
    }

    // Get wallet ledger for specific tutor
    getTutorWalletLedgerByTutor(tutorId: string): TutorWalletLedger[] {
        return this.walletLedgerSubject.value.filter(entry => entry.tutorId === tutorId);
    }

    // Get dashboard summary
    getSummary(): {
        totalRevenue: number;
        completedPayments: number;
        failedPayments: number;
        pendingPayments: number;
        pendingPayoutAmount: number;
        totalTutorPayouts: number;
    } {
        const allPayments = this.paymentsSubject.value;
        const allPayouts = this.payoutsSubject.value;

        return {
            totalRevenue: allPayments
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + p.totalAmount, 0),
            completedPayments: allPayments.filter(p => p.status === 'completed').length,
            failedPayments: allPayments.filter(p => p.status === 'failed').length,
            pendingPayments: allPayments.filter(p => p.status === 'pending').length,
            pendingPayoutAmount: allPayouts
                .filter(p => p.status === 'pending' || p.status === 'approved')
                .reduce((sum, p) => sum + p.totalEarnings, 0),
            totalTutorPayouts: allPayouts
                .filter(p => p.status === 'paid')
                .reduce((sum, p) => sum + p.totalEarnings, 0)
        };
    }

    setFilters(filters: TransactionFilters): void {
        // Could be stored in localStorage or state management if needed
        console.log('Filters set:', filters);
    }

    formatCurrency(amount: number): string {
        // Assuming amounts are stored in VND by default
        return this.currencyService.format(amount, 'VND');
    }

    private getCurrentDate(): string {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Get top tutors by earnings
    getTopTutorsByEarnings(limit: number = 5): any[] {
        const allPayments = this.paymentsSubject.value;
        const tutorMap = new Map<string, { tutorId: string; tutorName: string; sessionCount: number; totalEarnings: number }>();

        allPayments
            .filter(payment => payment.status === 'completed' && payment.session)
            .forEach(payment => {
                const internalSession = payment.session as InternalSession;
                const key = internalSession.tutorId;
                const existing = tutorMap.get(key);

                if (existing) {
                    existing.sessionCount += 1;
                    existing.totalEarnings += payment.tutorEarnings || 0;
                } else {
                    tutorMap.set(key, {
                        tutorId: internalSession.tutorId,
                        tutorName: internalSession.tutorName,
                        sessionCount: 1,
                        totalEarnings: payment.tutorEarnings || 0
                    });
                }
            });

        return Array.from(tutorMap.values())
            .sort((a, b) => b.totalEarnings - a.totalEarnings)
            .slice(0, limit);
    }

    /**
     * Calculate mock trend for different time periods
     */
    private calculateMockTrend(period: string, metric: 'revenue' | 'aov' | 'successRate'): number {
        // Mock trend data - in real app, this would compare to previous period from API
        const trendData: { [key: string]: { revenue: number; aov: number; successRate: number } } = {
            'all': { revenue: 0, aov: 0, successRate: 0 }, // No trend for all-time
            'today': { revenue: 12.5, aov: 8.3, successRate: -2.1 },
            '7days': { revenue: 18.2, aov: 5.6, successRate: 1.5 },
            '30days': { revenue: 24.7, aov: 12.1, successRate: 3.2 }
        };

        return trendData[period]?.[metric] || 0;
    }

    // Get top classes by revenue
    getTopClassesByRevenue(limit: number = 5): any[] {
        const allPayments = this.paymentsSubject.value;
        const classMap = new Map<string, { classId: string; className: string; sessionCount: number; totalRevenue: number }>();

        allPayments
            .filter(payment => payment.status === 'completed' && payment.session)
            .forEach(payment => {
                const internalSession = payment.session as InternalSession;
                const key = internalSession.classId;
                const existing = classMap.get(key);

                if (existing) {
                    existing.sessionCount += 1;
                    existing.totalRevenue += payment.totalAmount;
                } else {
                    classMap.set(key, {
                        classId: internalSession.classId,
                        className: internalSession.className,
                        sessionCount: 1,
                        totalRevenue: payment.totalAmount
                    });
                }
            });

        return Array.from(classMap.values())
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, limit);
    }
}
