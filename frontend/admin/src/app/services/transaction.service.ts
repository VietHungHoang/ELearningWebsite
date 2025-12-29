import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ClassService } from './class.service';
import { UserService } from './user.service';
import { ApiService } from './api.service';
import { PaginatedResponse } from '../types/pagination';

// Payment statuses for learner payment
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'momo' | 'vnpay' | 'banking';
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

// Session/Class booking that generates payment
export interface TutoringSession {
    id: string;
    classId: string;
    className: string;
    instructorId: string;
    instructorName: string;
    learnerIds: string[];  // Can be 1 (1-1) or multiple (group)
    classType: ClassType;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    ratePerHour: number;   // VND/hour from instructor
    totalAmount: number;   // Calculated from duration + rate
    platformFeePercentage: number;  // Admin's cut (20%, 30%, etc)
}

// Payment record - Learner pays
export interface Payment {
    id: string;
    paymentNumber: string;
    learnerName: string;
    learnerEmail: string;
    learnerAvatar?: string;
    sessionId: string;
    session?: TutoringSession;
    totalAmount: number;  // Full amount learner pays
    currency: string;  // VND
    paymentMethod: PaymentMethod;
    status: PaymentStatus;  // 'pending', 'completed', 'failed'
    createdDate: string;
    completedDate?: string;
    transactionId?: string;  // Payment gateway transaction ID
    notes?: string;

    // After payment completes, these are set
    adminHoldAmount?: number;  // Amount held in admin account
    platformFeeAmount?: number;  // Platform fee (percentage-based)
    instructorEarnings?: number; // What instructor will get (totalAmount - platformFee)
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
    totalEarnings: number;  // Sum of all instructor earnings from payments that month
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
 * API Response for transactions with pagination and summary
 */
export interface TransactionsApiResponse {
    content: Payment[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    numberOfElements: number;
    size: number;
    number: number;
    empty: boolean;
    summary: TransactionsSummary; // Summary based on summaryFilter params
}

/**
 * Summary response (can be filtered by summaryFilter params)
 */
export interface TransactionsSummary {
    totalRevenue: number;
    completedPayments: number;
    failedPayments: number;
    pendingPayments: number;
}

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private paymentsSubject = new BehaviorSubject<Payment[]>([]);
    public payments$ = this.paymentsSubject.asObservable();

    private payoutsSubject = new BehaviorSubject<MonthlyPayout[]>([]);
    public payouts$ = this.payoutsSubject.asObservable();

    private walletLedgerSubject = new BehaviorSubject<TutorWalletLedger[]>([]);
    public walletLedger$ = this.walletLedgerSubject.asObservable();

    private currentFiltersSubject = new BehaviorSubject<TransactionFilters>({});

    constructor(
        private classService: ClassService,
        private userService: UserService,
        private apiService: ApiService
    ) {
        this.loadMockData();
    }

    private loadMockData(): void {
        const mockPayments: Payment[] = [
            {
                id: 'pay_001',
                paymentNumber: 'PAY-2025-NOV-001',
                learnerName: 'John Smith',
                learnerEmail: 'john.smith@example.com',
                learnerAvatar: 'images/users/user1.jpg',
                sessionId: 'session_2025_nov_05_001',
                session: {
                    id: 'session_2025_nov_05_001',
                    classId: 'class_001',
                    className: 'React Advanced - 1-1',
                    instructorId: 'tutor_001',
                    instructorName: 'Đặng Minh Tuấn',
                    learnerIds: ['learner_001'],
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
                instructorEarnings: 800000
            },
            {
                id: 'pay_002',
                paymentNumber: 'PAY-2025-NOV-002',
                learnerName: 'Sarah Johnson',
                learnerEmail: 'sarah.johnson@example.com',
                learnerAvatar: 'images/users/user2.jpg',
                sessionId: 'session_2025_nov_04_001',
                session: {
                    id: 'session_2025_nov_04_001',
                    classId: 'class_002',
                    className: 'TypeScript Pro - 1-1',
                    instructorId: 'tutor_001',
                    instructorName: 'Đặng Minh Tuấn',
                    learnerIds: ['learner_002'],
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
                instructorEarnings: 800000
            },
            {
                id: 'pay_003',
                paymentNumber: 'PAY-2025-NOV-003',
                learnerName: 'Michael Chen',
                learnerEmail: 'michael.chen@example.com',
                learnerAvatar: 'images/users/user3.jpg',
                sessionId: 'session_2025_nov_03_001',
                session: {
                    id: 'session_2025_nov_03_001',
                    classId: 'class_003',
                    className: 'Python Fundamentals - Group',
                    instructorId: 'tutor_002',
                    instructorName: 'Nguyễn Thị Hương',
                    learnerIds: ['learner_003', 'learner_004', 'learner_005'],
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
                instructorEarnings: 640000
            },
            {
                id: 'pay_004',
                paymentNumber: 'PAY-2025-NOV-004',
                learnerName: 'Emily Davis',
                learnerEmail: 'emily.davis@example.com',
                learnerAvatar: 'images/users/user4.jpg',
                sessionId: 'session_2025_nov_02_001',
                session: {
                    id: 'session_2025_nov_02_001',
                    classId: 'class_004',
                    className: 'Vue.js Mastery - 1-1',
                    instructorId: 'tutor_003',
                    instructorName: 'Trần Văn A',
                    learnerIds: ['learner_006'],
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
                instructorEarnings: 320000
            },
            {
                id: 'pay_005',
                paymentNumber: 'PAY-2025-NOV-005',
                learnerName: 'David Wilson',
                learnerEmail: 'david.wilson@example.com',
                learnerAvatar: 'images/users/user5.jpg',
                sessionId: 'session_2025_nov_01_001',
                session: {
                    id: 'session_2025_nov_01_001',
                    classId: 'class_001',
                    className: 'Angular Basics - 1-1',
                    instructorId: 'tutor_001',
                    instructorName: 'Đặng Minh Tuấn',
                    learnerIds: ['learner_007'],
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
                instructorEarnings: 560000
            },
            {
                id: 'pay_006',
                paymentNumber: 'PAY-2025-OCT-006',
                learnerName: 'Jessica Brown',
                learnerEmail: 'jessica.brown@example.com',
                learnerAvatar: 'images/users/user6.jpg',
                sessionId: 'session_2025_oct_31_001',
                session: {
                    id: 'session_2025_oct_31_001',
                    classId: 'class_002',
                    className: 'JavaScript Essentials - Group',
                    instructorId: 'tutor_004',
                    instructorName: 'Lê Thị B',
                    learnerIds: ['learner_008', 'learner_009'],
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
                instructorEarnings: 480000
            },
            {
                id: 'pay_007',
                paymentNumber: 'PAY-2025-OCT-007',
                learnerName: 'Robert Taylor',
                learnerEmail: 'robert.taylor@example.com',
                learnerAvatar: 'images/users/user7.jpg',
                sessionId: 'session_2025_oct_30_001',
                session: {
                    id: 'session_2025_oct_30_001',
                    classId: 'class_005',
                    className: 'React Advanced - 1-1',
                    instructorId: 'tutor_002',
                    instructorName: 'Nguyễn Thị Hương',
                    learnerIds: ['learner_010'],
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
                instructorEarnings: 600000
            },
            {
                id: 'pay_008',
                paymentNumber: 'PAY-2025-OCT-008',
                learnerName: 'Lisa Anderson',
                learnerEmail: 'lisa.anderson@example.com',
                learnerAvatar: 'images/users/user8.jpg',
                sessionId: 'session_2025_oct_29_001',
                session: {
                    id: 'session_2025_oct_29_001',
                    classId: 'class_006',
                    className: 'Node.js Backend - 1-1',
                    instructorId: 'tutor_003',
                    instructorName: 'Trần Văn A',
                    learnerIds: ['learner_011'],
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
                instructorEarnings: 720000
            },
            {
                id: 'pay_009',
                paymentNumber: 'PAY-2025-OCT-009',
                learnerName: 'James Martinez',
                learnerEmail: 'james.martinez@example.com',
                learnerAvatar: 'images/users/user9.jpg',
                sessionId: 'session_2025_oct_28_001',
                session: {
                    id: 'session_2025_oct_28_001',
                    classId: 'class_003',
                    className: 'CSS Styling - Group',
                    instructorId: 'tutor_001',
                    instructorName: 'Đặng Minh Tuấn',
                    learnerIds: ['learner_012', 'learner_013', 'learner_014', 'learner_015'],
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
                instructorEarnings: 400000
            },
            {
                id: 'pay_010',
                paymentNumber: 'PAY-2025-OCT-010',
                learnerName: 'Nicole Garcia',
                learnerEmail: 'nicole.garcia@example.com',
                learnerAvatar: 'images/users/user10.jpg',
                sessionId: 'session_2025_oct_27_001',
                session: {
                    id: 'session_2025_oct_27_001',
                    classId: 'class_004',
                    className: 'React Advanced - Group',
                    instructorId: 'tutor_004',
                    instructorName: 'Lê Thị B',
                    learnerIds: ['learner_016', 'learner_017'],
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
                instructorEarnings: 560000
            },
            {
                id: 'pay_011',
                paymentNumber: 'PAY-2025-OCT-011',
                learnerName: 'Thomas Anderson',
                learnerEmail: 'thomas.anderson@example.com',
                learnerAvatar: 'images/users/user11.jpg',
                sessionId: 'session_2025_oct_26_001',
                session: {
                    id: 'session_2025_oct_26_001',
                    classId: 'class_006',
                    className: 'Node.js Backend - 1-1',
                    instructorId: 'tutor_002',
                    instructorName: 'Nguyễn Thị Hương',
                    learnerIds: ['learner_018'],
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
                instructorEarnings: 400000
            },
            {
                id: 'pay_012',
                paymentNumber: 'PAY-2025-OCT-012',
                learnerName: 'Patricia White',
                learnerEmail: 'patricia.white@example.com',
                learnerAvatar: 'images/users/user12.jpg',
                sessionId: 'session_2025_oct_25_001',
                session: {
                    id: 'session_2025_oct_25_001',
                    classId: 'class_007',
                    className: 'Database Design - Group',
                    instructorId: 'tutor_003',
                    instructorName: 'Trần Văn A',
                    learnerIds: ['learner_019', 'learner_020'],
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
                instructorEarnings: 480000
            },
            {
                id: 'pay_013',
                paymentNumber: 'PAY-2025-OCT-013',
                learnerName: 'Daniel Lee',
                learnerEmail: 'daniel.lee@example.com',
                learnerAvatar: 'images/users/user13.jpg',
                sessionId: 'session_2025_oct_24_001',
                session: {
                    id: 'session_2025_oct_24_001',
                    classId: 'class_008',
                    className: 'Git & Version Control - 1-1',
                    instructorId: 'tutor_001',
                    instructorName: 'Đặng Minh Tuấn',
                    learnerIds: ['learner_021'],
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
                instructorEarnings: 240000
            },
            {
                id: 'pay_014',
                paymentNumber: 'PAY-2025-OCT-014',
                learnerName: 'Susan Harris',
                learnerEmail: 'susan.harris@example.com',
                learnerAvatar: 'images/users/user14.jpg',
                sessionId: 'session_2025_oct_23_001',
                session: {
                    id: 'session_2025_oct_23_001',
                    classId: 'class_005',
                    className: 'Database Design - 1-1',
                    instructorId: 'tutor_004',
                    instructorName: 'Lê Thị B',
                    learnerIds: ['learner_022'],
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
                instructorEarnings: 720000
            },
            {
                id: 'pay_015',
                paymentNumber: 'PAY-2025-OCT-015',
                learnerName: 'Christopher Martin',
                learnerEmail: 'christopher.martin@example.com',
                learnerAvatar: 'images/users/user15.jpg',
                sessionId: 'session_2025_oct_22_001',
                session: {
                    id: 'session_2025_oct_22_001',
                    classId: 'class_002',
                    className: 'Git & Version Control - Group',
                    instructorId: 'tutor_002',
                    instructorName: 'Nguyễn Thị Hương',
                    learnerIds: ['learner_023', 'learner_024', 'learner_025'],
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
                instructorEarnings: 360000
            },
            {
                id: 'pay_016',
                paymentNumber: 'PAY-2025-OCT-016',
                learnerName: 'Linda Thompson',
                learnerEmail: 'linda.thompson@example.com',
                learnerAvatar: 'images/users/user16.jpg',
                sessionId: 'session_2025_oct_21_001',
                session: {
                    id: 'session_2025_oct_21_001',
                    classId: 'class_001',
                    className: 'TypeScript Pro - Group',
                    instructorId: 'tutor_003',
                    instructorName: 'Trần Văn A',
                    learnerIds: ['learner_026', 'learner_027'],
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
                instructorEarnings: 420000
            },
            {
                id: 'pay_017',
                paymentNumber: 'PAY-2025-OCT-017',
                learnerName: 'Betty Jackson',
                learnerEmail: 'betty.jackson@example.com',
                learnerAvatar: 'images/users/user17.jpg',
                sessionId: 'session_2025_oct_20_001',
                session: {
                    id: 'session_2025_oct_20_001',
                    classId: 'class_009',
                    className: 'Python Fundamentals - 1-1',
                    instructorId: 'tutor_001',
                    instructorName: 'Đặng Minh Tuấn',
                    learnerIds: ['learner_028'],
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
                instructorEarnings: 800000
            },
            {
                id: 'pay_018',
                paymentNumber: 'PAY-2025-OCT-018',
                learnerName: 'Mark Davies',
                learnerEmail: 'mark.davies@example.com',
                learnerAvatar: 'images/users/user18.jpg',
                sessionId: 'session_2025_oct_19_001',
                session: {
                    id: 'session_2025_oct_19_001',
                    classId: 'class_004',
                    className: 'Vue.js Mastery - Group',
                    instructorId: 'tutor_004',
                    instructorName: 'Lê Thị B',
                    learnerIds: ['learner_029', 'learner_030', 'learner_031', 'learner_032'],
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
                instructorEarnings: 300000
            },
            {
                id: 'pay_019',
                paymentNumber: 'PAY-2025-OCT-019',
                learnerName: 'Donald Miller',
                learnerEmail: 'donald.miller@example.com',
                learnerAvatar: 'images/users/user19.jpg',
                sessionId: 'session_2025_oct_18_001',
                session: {
                    id: 'session_2025_oct_18_001',
                    classId: 'class_003',
                    className: 'JavaScript Essentials - 1-1',
                    instructorId: 'tutor_002',
                    instructorName: 'Nguyễn Thị Hương',
                    learnerIds: ['learner_033'],
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
                instructorEarnings: 800000
            },
            {
                id: 'pay_020',
                paymentNumber: 'PAY-2025-OCT-020',
                learnerName: 'Dorothy Moore',
                learnerEmail: 'dorothy.moore@example.com',
                learnerAvatar: 'images/users/user20.jpg',
                sessionId: 'session_2025_oct_17_001',
                session: {
                    id: 'session_2025_oct_17_001',
                    classId: 'class_008',
                    className: 'CSS Styling - 1-1',
                    instructorId: 'tutor_003',
                    instructorName: 'Trần Văn A',
                    learnerIds: ['learner_034'],
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
                completedDate: undefined,
                transactionId: 'TXN-VNPAY-12364',
                adminHoldAmount: 600000,
                platformFeeAmount: 120000,
                instructorEarnings: 480000
            }
        ];

        this.paymentsSubject.next(mockPayments);
    }

    /**
     * Get transactions from API with pagination, filters, and summary
     * API Endpoint: GET /api/v1/admin/transactions
     * Query Params: 
     *   - page, size, status, paymentMethod, search, startDate, endDate, sortOrder, typeFilter (for table)
     *   - summaryFilter (for KPI cards: 'all' | 'today' | '7days' | '30days' | 'thisMonth')
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
        summaryFilter?: string; // Filter for summary/KPI cards: 'all' | 'today' | '7days' | '30days' | 'thisMonth'
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
                    // Update local state
                    this.paymentsSubject.next(response.data.content);
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
     * Get mock transactions response for fallback
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
                if (params.typeFilter === '1 and 1') {
                    return payment.session?.classType === '1 and 1';
                } else {
                    return payment.session?.classType === '1 and n';
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
            filtered = filtered.filter(payment =>
                payment.id.toLowerCase().includes(searchLower) ||
                payment.paymentNumber.toLowerCase().includes(searchLower) ||
                payment.learnerName.toLowerCase().includes(searchLower) ||
                payment.learnerEmail.toLowerCase().includes(searchLower) ||
                payment.session?.className.toLowerCase().includes(searchLower) ||
                payment.session?.instructorName.toLowerCase().includes(searchLower)
            );
        }

        // Sort
        if (params?.sortOrder) {
            filtered.sort((a, b) => {
                const dateA = new Date(a.createdDate).getTime();
                const dateB = new Date(b.createdDate).getTime();
                return params.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            });
        }

        // Pagination
        const page = (params?.page ?? 1) - 1; // Convert to 0-based
        const size = params?.size ?? 10;
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedContent = filtered.slice(startIndex, endIndex);
        const totalElements = filtered.length;
        const totalPages = Math.ceil(totalElements / size);

        // Calculate summary based on summaryFilter
        let summaryPayments = allPayments;
        if (params?.summaryFilter && params.summaryFilter !== 'all') {
            const today = new Date();
            let summaryStartDate: Date | null = null;
            let summaryEndDate: Date | null = null;

            if (params.summaryFilter === 'today') {
                summaryStartDate = new Date(today);
                summaryStartDate.setHours(0, 0, 0, 0);
                summaryEndDate = new Date(today);
                summaryEndDate.setHours(23, 59, 59, 999);
            } else if (params.summaryFilter === '7days') {
                summaryStartDate = new Date(today);
                summaryStartDate.setDate(today.getDate() - 7);
                summaryStartDate.setHours(0, 0, 0, 0);
                summaryEndDate = new Date(today);
                summaryEndDate.setHours(23, 59, 59, 999);
            } else if (params.summaryFilter === '30days') {
                summaryStartDate = new Date(today);
                summaryStartDate.setDate(today.getDate() - 30);
                summaryStartDate.setHours(0, 0, 0, 0);
                summaryEndDate = new Date(today);
                summaryEndDate.setHours(23, 59, 59, 999);
            } else if (params.summaryFilter === 'thisMonth') {
                summaryStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
                summaryStartDate.setHours(0, 0, 0, 0);
                summaryEndDate = new Date(today);
                summaryEndDate.setHours(23, 59, 59, 999);
            }

            if (summaryStartDate && summaryEndDate) {
                summaryPayments = allPayments.filter(payment => {
                    const paymentDate = new Date(payment.createdDate);
                    return paymentDate >= summaryStartDate! && paymentDate <= summaryEndDate!;
                });
            }
        }

        const summary: TransactionsSummary = {
            totalRevenue: summaryPayments
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + p.totalAmount, 0),
            completedPayments: summaryPayments.filter(p => p.status === 'completed').length,
            failedPayments: summaryPayments.filter(p => p.status === 'failed').length,
            pendingPayments: summaryPayments.filter(p => p.status === 'pending').length
        };

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
            empty: paginatedContent.length === 0,
            summary: summary
        };
    }

    // Get all payments
    getPayments(): Observable<Payment[]> {
        return this.payments$;
    }

    // Get filtered payments (legacy method - kept for backward compatibility)
    getPaymentsFiltered(filters: TransactionFilters, page: number = 1, pageSize: number = 10): Payment[] {
        const allPayments = this.paymentsSubject.value;
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
                payment.learnerName.toLowerCase().includes(searchLower) ||
                payment.learnerEmail.toLowerCase().includes(searchLower)
            );
        }

        // Pagination
        const startIndex = (page - 1) * pageSize;
        return filtered.slice(startIndex, startIndex + pageSize);
    }

    // Get single payment by ID
    getPaymentById(id: string): Payment | undefined {
        return this.paymentsSubject.value.find(payment => payment.id === id);
    }

    // Manually approve a failed payment
    approvePaymentManually(paymentId: string, notes?: string): boolean {
        const payments = this.paymentsSubject.value;
        const payment = payments.find(p => p.id === paymentId);

        if (!payment || payment.status !== 'failed') {
            console.error('Cannot approve payment: Payment not found or not failed');
            return false;
        }

        payment.status = 'completed';
        payment.completedDate = this.getCurrentDate();
        if (notes) {
            payment.notes = notes;
        }

        if (!payment.transactionId) {
            payment.transactionId = `TXN-MANUAL-${paymentId}-${Date.now()}`;
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

        const totalEarnings = payments.reduce((sum, p) => sum + (p.instructorEarnings || 0), 0);
        const totalHours = payments.reduce((sum, p) => sum + (p.session?.durationMinutes || 0), 0) / 60;

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
            paymentMethod: 'banking',
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
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    }

    private getCurrentDate(): string {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Get top instructors by earnings
    getTopInstructorsByEarnings(limit: number = 5): any[] {
        const allPayments = this.paymentsSubject.value;
        const instructorMap = new Map<string, { instructorId: string; instructorName: string; sessionCount: number; totalEarnings: number }>();

        allPayments
            .filter(payment => payment.status === 'completed' && payment.session)
            .forEach(payment => {
                const session = payment.session!;
                const key = session.instructorId;
                const existing = instructorMap.get(key);

                if (existing) {
                    existing.sessionCount += 1;
                    existing.totalEarnings += payment.instructorEarnings || 0;
                } else {
                    instructorMap.set(key, {
                        instructorId: session.instructorId,
                        instructorName: session.instructorName,
                        sessionCount: 1,
                        totalEarnings: payment.instructorEarnings || 0
                    });
                }
            });

        return Array.from(instructorMap.values())
            .sort((a, b) => b.totalEarnings - a.totalEarnings)
            .slice(0, limit);
    }

    // Get top classes by revenue
    getTopClassesByRevenue(limit: number = 5): any[] {
        const allPayments = this.paymentsSubject.value;
        const classMap = new Map<string, { classId: string; className: string; sessionCount: number; totalRevenue: number }>();

        allPayments
            .filter(payment => payment.status === 'completed' && payment.session)
            .forEach(payment => {
                const session = payment.session!;
                const key = session.classId;
                const existing = classMap.get(key);

                if (existing) {
                    existing.sessionCount += 1;
                    existing.totalRevenue += payment.totalAmount;
                } else {
                    classMap.set(key, {
                        classId: session.classId,
                        className: session.className,
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
