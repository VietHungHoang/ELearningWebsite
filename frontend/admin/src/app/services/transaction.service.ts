import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CourseService } from './course.service';
import { UserService } from './user.service';

export type OrderStatus = 'completed' | 'failed';
export type PaymentMethod = 'momo' | 'vnpay';
export type OrderType = 'course' | '1 and 1' | '1 and n';

export interface OrderCourseItem {
    courseId: string;
    courseName: string;
    instructorId: string;
    instructorName: string;
    price: number;
    commission: number;
}

export interface Order {
    id: string; 
    orderNumber: string; 
    learnerName: string; 
    learnerEmail: string; 
    learnerAvatar?: string; 
    type: OrderType; 
    coursesIds?: string[]; 
    courses?: OrderCourseItem[]; 
    courseName?: string; 
    instructorId?: string; 
    instructorName?: string; 
    totalAmount: number; 
    currency: string; 
    paymentMethod: PaymentMethod; 
    status: OrderStatus; 
    createdDate: string; 
    completedDate?: string; 
    transactionId?: string; 
    notes?: string; 
    instructorCommissionPercentage?: number; 
}

export interface InstructorPayout {
    id: string;
    instructorId: string;
    instructorName: string;
    orderId: string;
    orderNumber: string;
    payableAmount: number;
    payoutPercentage: number;
    status: 'pending' | 'paid' | 'cancelled';
    createdDate: string;
    paidDate?: string;
}

export interface TransactionFilters {
    status?: OrderStatus;
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
    data: Order[];
    pagination: PaginationMeta;
    summary?: {
        totalRevenue: number;
        completedOrders: number;
        failedOrders: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private ordersSubject = new BehaviorSubject<Order[]>([]);
    public orders$ = this.ordersSubject.asObservable();

    private payoutsSubject = new BehaviorSubject<InstructorPayout[]>([]);
    public payouts$ = this.payoutsSubject.asObservable();

    private currentFiltersSubject = new BehaviorSubject<TransactionFilters>({});

    constructor(
        private courseService: CourseService,
        private userService: UserService
    ) {
        this.loadMockData();
    }

    private loadMockData(): void {
        const mockOrders: Order[] = [

            {
                id: '12345',
                orderNumber: 'ORD-2025-00001',
                learnerName: 'John Smith',
                learnerEmail: 'john.smith@example.com',
                learnerAvatar: 'images/users/user1.jpg',
                type: 'course',
                coursesIds: ['c1'],
                courseName: 'JavaScript Essentials',
                courses: [
                    { courseId: 'c1', courseName: 'JavaScript Essentials', instructorId: '1', instructorName: 'Đặng Minh Tuấn', price: 1000000, commission: 250000 }
                ],
                totalAmount: 1000000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '05 Nov 2025',
                completedDate: '05 Nov 2025',
                transactionId: 'TXN-MOMO-12345',
                instructorId: '1',
                instructorName: 'Đặng Minh Tuấn',
                instructorCommissionPercentage: 25
            },
            {
                id: '12346',
                orderNumber: 'ORD-2025-00002',
                learnerName: 'Sarah Johnson',
                learnerEmail: 'sarah.johnson@example.com',
                learnerAvatar: 'images/users/user2.jpg',
                type: '1 and 1',
                coursesIds: ['c2'],
                courseName: 'TypeScript Pro',
                courses: [
                    { courseId: 'c2', courseName: 'TypeScript Pro', instructorId: '1', instructorName: 'Đặng Minh Tuấn', price: 1000000, commission: 250000 }
                ],
                totalAmount: 1000000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '04 Nov 2025',
                completedDate: '04 Nov 2025',
                transactionId: 'TXN-VNPAY-12346',
                instructorId: '1',
                instructorName: 'Đặng Minh Tuấn',
                instructorCommissionPercentage: 25
            },
            {
                id: '12347',
                orderNumber: 'ORD-2025-00003',
                learnerName: 'Michael Chen',
                learnerEmail: 'michael.chen@example.com',
                learnerAvatar: 'images/users/user3.jpg',
                type: '1 and n',
                coursesIds: ['c3'],
                courseName: 'Python Fundamentals',
                courses: [
                    { courseId: 'c3', courseName: 'Python Fundamentals', instructorId: '1', instructorName: 'Đặng Minh Tuấn', price: 1100000, commission: 275000 }
                ],
                totalAmount: 1100000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '03 Nov 2025',
                completedDate: '03 Nov 2025',
                transactionId: 'TXN-MOMO-12347',
                instructorId: '1',
                instructorName: 'Đặng Minh Tuấn',
                instructorCommissionPercentage: 25
            },
            {
                id: '12348',
                orderNumber: 'ORD-2025-00004',
                learnerName: 'Emily Davis',
                learnerEmail: 'emily.davis@example.com',
                learnerAvatar: 'images/users/user4.jpg',
                type: 'course',
                coursesIds: ['c7'],
                courseName: 'Vue.js Mastery',
                courses: [
                    { courseId: 'c7', courseName: 'Vue.js Mastery', instructorId: '1', instructorName: 'Đặng Minh Tuấn', price: 950000, commission: 237500 }
                ],
                totalAmount: 950000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '02 Nov 2025',
                completedDate: '02 Nov 2025',
                transactionId: 'TXN-VNPAY-12348',
                instructorId: '1',
                instructorName: 'Đặng Minh Tuấn',
                instructorCommissionPercentage: 25
            },
            {
                id: '12349',
                orderNumber: 'ORD-2025-00005',
                learnerName: 'David Wilson',
                learnerEmail: 'david.wilson@example.com',
                learnerAvatar: 'images/users/user5.jpg',
                type: '1 and 1',
                coursesIds: ['c8'],
                courseName: 'Angular Basics',
                courses: [
                    { courseId: 'c8', courseName: 'Angular Basics', instructorId: '1', instructorName: 'Đặng Minh Tuấn', price: 700000, commission: 175000 }
                ],
                totalAmount: 700000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '01 Nov 2025',
                completedDate: '01 Nov 2025',
                transactionId: 'TXN-MOMO-12349',
                instructorId: '1',
                instructorName: 'Đặng Minh Tuấn',
                instructorCommissionPercentage: 25
            },
            {
                id: '12350',
                orderNumber: 'ORD-2025-00006',
                learnerName: 'Jessica Brown',
                learnerEmail: 'jessica.brown@example.com',
                learnerAvatar: 'images/users/user6.jpg',
                type: '1 and n',
                coursesIds: ['c1'],
                courseName: 'JavaScript Essentials',
                courses: [
                    { courseId: 'c1', courseName: 'JavaScript Essentials', instructorId: '1', instructorName: 'Đặng Minh Tuấn', price: 1000000, commission: 250000 }
                ],
                totalAmount: 1000000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '31 Oct 2025',
                completedDate: '31 Oct 2025',
                transactionId: 'TXN-VNPAY-12350',
                instructorId: '1',
                instructorName: 'Đặng Minh Tuấn',
                instructorCommissionPercentage: 25
            },

            {
                id: '12351',
                orderNumber: 'ORD-2025-00007',
                learnerName: 'Robert Taylor',
                learnerEmail: 'robert.taylor@example.com',
                learnerAvatar: 'images/users/user7.jpg',
                type: 'course',
                coursesIds: ['c9'],
                courseName: 'React Advanced',
                courses: [
                    { courseId: 'c9', courseName: 'React Advanced', instructorId: '2', instructorName: 'Nguyễn Thị Hương', price: 650000, commission: 195000 }
                ],
                totalAmount: 650000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '30 Oct 2025',
                completedDate: '30 Oct 2025',
                transactionId: 'TXN-MOMO-12351',
                instructorId: '2',
                instructorName: 'Nguyễn Thị Hương',
                instructorCommissionPercentage: 30
            },
            {
                id: '12352',
                orderNumber: 'ORD-2025-00008',
                learnerName: 'Lisa Anderson',
                learnerEmail: 'lisa.anderson@example.com',
                learnerAvatar: 'images/users/user8.jpg',
                type: '1 and 1',
                coursesIds: ['c10'],
                courseName: 'Node.js Backend',
                courses: [
                    { courseId: 'c10', courseName: 'Node.js Backend', instructorId: '2', instructorName: 'Nguyễn Thị Hương', price: 750000, commission: 225000 }
                ],
                totalAmount: 750000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '29 Oct 2025',
                completedDate: '29 Oct 2025',
                transactionId: 'TXN-VNPAY-12352',
                instructorId: '2',
                instructorName: 'Nguyễn Thị Hương',
                instructorCommissionPercentage: 30
            },
            {
                id: '12353',
                orderNumber: 'ORD-2025-00009',
                learnerName: 'James Martinez',
                learnerEmail: 'james.martinez@example.com',
                learnerAvatar: 'images/users/user9.jpg',
                type: '1 and n',
                coursesIds: ['c6'],
                courseName: 'CSS Styling',
                courses: [
                    { courseId: 'c6', courseName: 'CSS Styling', instructorId: '2', instructorName: 'Nguyễn Thị Hương', price: 850000, commission: 255000 }
                ],
                totalAmount: 850000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '28 Oct 2025',
                completedDate: '28 Oct 2025',
                transactionId: 'TXN-MOMO-12353',
                instructorId: '2',
                instructorName: 'Nguyễn Thị Hương',
                instructorCommissionPercentage: 30
            },
            {
                id: '12354',
                orderNumber: 'ORD-2025-00010',
                learnerName: 'Nicole Garcia',
                learnerEmail: 'nicole.garcia@example.com',
                learnerAvatar: 'images/users/user10.jpg',
                type: 'course',
                coursesIds: ['c9'],
                courseName: 'React Advanced',
                courses: [
                    { courseId: 'c9', courseName: 'React Advanced', instructorId: '2', instructorName: 'Nguyễn Thị Hương', price: 650000, commission: 195000 }
                ],
                totalAmount: 650000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '27 Oct 2025',
                completedDate: '27 Oct 2025',
                transactionId: 'TXN-VNPAY-12354',
                instructorId: '2',
                instructorName: 'Nguyễn Thị Hương',
                instructorCommissionPercentage: 30
            },
            {
                id: '12355',
                orderNumber: 'ORD-2025-00011',
                learnerName: 'Thomas Anderson',
                learnerEmail: 'thomas.anderson@example.com',
                learnerAvatar: 'images/users/user11.jpg',
                type: '1 and 1',
                coursesIds: ['c10'],
                courseName: 'Node.js Backend',
                courses: [
                    { courseId: 'c10', courseName: 'Node.js Backend', instructorId: '2', instructorName: 'Nguyễn Thị Hương', price: 750000, commission: 225000 }
                ],
                totalAmount: 750000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '26 Oct 2025',
                completedDate: '26 Oct 2025',
                transactionId: 'TXN-MOMO-12355',
                instructorId: '2',
                instructorName: 'Nguyễn Thị Hương',
                instructorCommissionPercentage: 30
            },

            {
                id: '12356',
                orderNumber: 'ORD-2025-00012',
                learnerName: 'Patricia White',
                learnerEmail: 'patricia.white@example.com',
                learnerAvatar: 'images/users/user12.jpg',
                type: '1 and n',
                coursesIds: ['c4'],
                courseName: 'Database Design',
                courses: [
                    { courseId: 'c4', courseName: 'Database Design', instructorId: '3', instructorName: 'Trần Văn A', price: 800000, commission: 200000 }
                ],
                totalAmount: 800000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '25 Oct 2025',
                completedDate: '25 Oct 2025',
                transactionId: 'TXN-VNPAY-12356',
                instructorId: '3',
                instructorName: 'Trần Văn A',
                instructorCommissionPercentage: 25
            },
            {
                id: '12357',
                orderNumber: 'ORD-2025-00013',
                learnerName: 'Daniel Lee',
                learnerEmail: 'daniel.lee@example.com',
                learnerAvatar: 'images/users/user13.jpg',
                type: 'course',
                coursesIds: ['c5'],
                courseName: 'Git & Version Control',
                courses: [
                    { courseId: 'c5', courseName: 'Git & Version Control', instructorId: '3', instructorName: 'Trần Văn A', price: 600000, commission: 150000 }
                ],
                totalAmount: 600000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '24 Oct 2025',
                completedDate: '24 Oct 2025',
                transactionId: 'TXN-MOMO-12357',
                instructorId: '3',
                instructorName: 'Trần Văn A',
                instructorCommissionPercentage: 25
            },
            {
                id: '12358',
                orderNumber: 'ORD-2025-00014',
                learnerName: 'Susan Harris',
                learnerEmail: 'susan.harris@example.com',
                learnerAvatar: 'images/users/user14.jpg',
                type: '1 and 1',
                coursesIds: ['c4'],
                courseName: 'Database Design',
                courses: [
                    { courseId: 'c4', courseName: 'Database Design', instructorId: '3', instructorName: 'Trần Văn A', price: 800000, commission: 200000 }
                ],
                totalAmount: 800000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '23 Oct 2025',
                completedDate: '23 Oct 2025',
                transactionId: 'TXN-VNPAY-12358',
                instructorId: '3',
                instructorName: 'Trần Văn A',
                instructorCommissionPercentage: 25
            },
            {
                id: '12359',
                orderNumber: 'ORD-2025-00015',
                learnerName: 'Christopher Martin',
                learnerEmail: 'christopher.martin@example.com',
                learnerAvatar: 'images/users/user15.jpg',
                type: '1 and n',
                coursesIds: ['c5'],
                courseName: 'Git & Version Control',
                courses: [
                    { courseId: 'c5', courseName: 'Git & Version Control', instructorId: '3', instructorName: 'Trần Văn A', price: 600000, commission: 150000 }
                ],
                totalAmount: 600000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '22 Oct 2025',
                completedDate: '22 Oct 2025',
                transactionId: 'TXN-MOMO-12359',
                instructorId: '3',
                instructorName: 'Trần Văn A',
                instructorCommissionPercentage: 25
            },

            {
                id: '12360',
                orderNumber: 'ORD-2025-00016',
                learnerName: 'Linda Thompson',
                learnerEmail: 'linda.thompson@example.com',
                learnerAvatar: 'images/users/user16.jpg',
                type: 'course',
                coursesIds: ['c2'],
                courseName: 'TypeScript Pro',
                courses: [
                    { courseId: 'c2', courseName: 'TypeScript Pro', instructorId: '4', instructorName: 'Lê Thị B', price: 1000000, commission: 300000 }
                ],
                totalAmount: 1000000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '21 Oct 2025',
                completedDate: '21 Oct 2025',
                transactionId: 'TXN-VNPAY-12360',
                instructorId: '4',
                instructorName: 'Lê Thị B',
                instructorCommissionPercentage: 30
            },
            {
                id: '12361',
                orderNumber: 'ORD-2025-00017',
                learnerName: 'Betty Jackson',
                learnerEmail: 'betty.jackson@example.com',
                learnerAvatar: 'images/users/user17.jpg',
                type: '1 and 1',
                coursesIds: ['c3'],
                courseName: 'Python Fundamentals',
                courses: [
                    { courseId: 'c3', courseName: 'Python Fundamentals', instructorId: '4', instructorName: 'Lê Thị B', price: 1100000, commission: 330000 }
                ],
                totalAmount: 1100000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '20 Oct 2025',
                completedDate: '20 Oct 2025',
                transactionId: 'TXN-MOMO-12361',
                instructorId: '4',
                instructorName: 'Lê Thị B',
                instructorCommissionPercentage: 30
            },
            {
                id: '12362',
                orderNumber: 'ORD-2025-00018',
                learnerName: 'Mark Davies',
                learnerEmail: 'mark.davies@example.com',
                learnerAvatar: 'images/users/user18.jpg',
                type: '1 and n',
                coursesIds: ['c7'],
                courseName: 'Vue.js Mastery',
                courses: [
                    { courseId: 'c7', courseName: 'Vue.js Mastery', instructorId: '4', instructorName: 'Lê Thị B', price: 950000, commission: 285000 }
                ],
                totalAmount: 950000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '19 Oct 2025',
                completedDate: '19 Oct 2025',
                transactionId: 'TXN-VNPAY-12362',
                instructorId: '4',
                instructorName: 'Lê Thị B',
                instructorCommissionPercentage: 30
            },

            {
                id: '12363',
                orderNumber: 'ORD-2025-00019',
                learnerName: 'Donald Miller',
                learnerEmail: 'donald.miller@example.com',
                learnerAvatar: 'images/users/user19.jpg',
                type: 'course',
                coursesIds: ['c1'],
                courseName: 'JavaScript Essentials',
                courses: [
                    { courseId: 'c1', courseName: 'JavaScript Essentials', instructorId: '5', instructorName: 'Phạm Minh C', price: 1000000, commission: 200000 }
                ],
                totalAmount: 1000000,
                currency: 'VND',
                paymentMethod: 'momo',
                status: 'completed',
                createdDate: '18 Oct 2025',
                completedDate: '18 Oct 2025',
                transactionId: 'TXN-MOMO-12363',
                instructorId: '5',
                instructorName: 'Phạm Minh C',
                instructorCommissionPercentage: 20
            },
            {
                id: '12364',
                orderNumber: 'ORD-2025-00020',
                learnerName: 'Dorothy Moore',
                learnerEmail: 'dorothy.moore@example.com',
                learnerAvatar: 'images/users/user20.jpg',
                type: '1 and 1',
                coursesIds: ['c6'],
                courseName: 'CSS Styling',
                courses: [
                    { courseId: 'c6', courseName: 'CSS Styling', instructorId: '5', instructorName: 'Phạm Minh C', price: 850000, commission: 170000 }
                ],
                totalAmount: 850000,
                currency: 'VND',
                paymentMethod: 'vnpay',
                status: 'completed',
                createdDate: '17 Oct 2025',
                completedDate: '17 Oct 2025',
                transactionId: 'TXN-VNPAY-12364',
                instructorId: '5',
                instructorName: 'Phạm Minh C',
                instructorCommissionPercentage: 20
            }
        ];

        this.ordersSubject.next(mockOrders);
    }

    getOrders(): Observable<Order[]> {
        return this.orders$;
    }

    getOrdersFiltered(filters: TransactionFilters, page: number = 1, pageSize: number = 10): Order[] {
        const allOrders = this.ordersSubject.value;
        let filtered = [...allOrders];

        if (filters.status) {
            filtered = filtered.filter(order => order.status === filters.status);
        }

        if (filters.paymentMethod) {
            filtered = filtered.filter(order => order.paymentMethod === filters.paymentMethod);
        }

        if (filters.startDate || filters.endDate) {
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.createdDate);
                const startDate = filters.startDate ? new Date(filters.startDate) : new Date('1900-01-01');
                const endDate = filters.endDate ? new Date(filters.endDate) : new Date('2100-12-31');
                return orderDate >= startDate && orderDate <= endDate;
            });
        }

        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(searchLower) ||
                order.orderNumber.toLowerCase().includes(searchLower) ||
                order.learnerName.toLowerCase().includes(searchLower) ||
                order.learnerEmail.toLowerCase().includes(searchLower)
            );
        }

        return filtered;
    }

    getOrderById(id: string): Order | undefined {
        return this.ordersSubject.value.find(order => order.id === id);
    }

    approveOrderManually(orderId: string, notes?: string): boolean {
        const orders = this.ordersSubject.value;
        const order = orders.find(o => o.id === orderId);

        if (!order || order.status !== 'failed') {
            console.error('Cannot approve order: Order not found or not failed');
            return false;
        }

        order.status = 'completed';
        order.completedDate = this.getCurrentDate();
        if (notes) {
            order.notes = notes;
        }

        if (!order.transactionId) {
            order.transactionId = `TXN-MANUAL-${orderId}-${Date.now()}`;
        }

        this.ordersSubject.next([...orders]);

        this.createInstructorPayout(order);

        return true;
    }

    private createInstructorPayout(order: Order): void {
        if (!order.instructorId || order.status !== 'completed') {
            return;
        }

        const payoutAmount = (order.totalAmount * (order.instructorCommissionPercentage || 30)) / 100;

        const newPayout: InstructorPayout = {
            id: `PAYOUT-${order.id}`,
            instructorId: order.instructorId,
            instructorName: 'Instructor Name', 
            orderId: order.id,
            orderNumber: order.orderNumber,
            payableAmount: payoutAmount,
            payoutPercentage: order.instructorCommissionPercentage || 30,
            status: 'paid',
            createdDate: this.getCurrentDate()
        };

        const currentPayouts = this.payoutsSubject.value;
        const existingPayout = currentPayouts.find(p => p.orderId === order.id);

        if (!existingPayout) {
            this.payoutsSubject.next([...currentPayouts, newPayout]);
        }
    }

    getPayouts(): Observable<InstructorPayout[]> {
        return this.payouts$;
    }

    getPayoutsByInstructor(instructorId: string): InstructorPayout[] {
        return this.payoutsSubject.value.filter(p => p.instructorId === instructorId && p.status === 'pending');
    }

    getSummary(): {
        totalRevenue: number;
        completedOrders: number;
        failedOrders: number;
        pendingPayouts: number;
    } {
        const allOrders = this.ordersSubject.value;
        const allPayouts = this.payoutsSubject.value;

        return {
            totalRevenue: allOrders
                .filter(o => o.status === 'completed')
                .reduce((sum, o) => sum + o.totalAmount, 0),
            completedOrders: allOrders.filter(o => o.status === 'completed').length,
            failedOrders: allOrders.filter(o => o.status === 'failed').length,
            pendingPayouts: allPayouts.filter(p => p.status === 'pending').length
        };
    }

    setFilters(filters: TransactionFilters): void {
        this.currentFiltersSubject.next(filters);
    }

    getFilters(): Observable<TransactionFilters> {
        return this.currentFiltersSubject.asObservable();
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
        return `${day} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()]} ${year}`;
    }

    getTopInstructorsByOrders(limit: number = 5): any[] {
        const allOrders = this.ordersSubject.value;
        const instructorMap = new Map<string, { instructorId: string; instructorName: string; orderCount: number; totalRevenue: number }>();

        allOrders
            .filter(order => order.status === 'completed')
            .forEach(order => {
                if (order.instructorId && order.instructorName) {
                    const key = order.instructorId;
                    const existing = instructorMap.get(key);

                    if (existing) {
                        existing.orderCount += 1;
                        existing.totalRevenue += order.totalAmount;
                    } else {
                        instructorMap.set(key, {
                            instructorId: order.instructorId,
                            instructorName: order.instructorName,
                            orderCount: 1,
                            totalRevenue: order.totalAmount
                        });
                    }
                }
            });

        return Array.from(instructorMap.values())
            .sort((a, b) => {
                if (b.orderCount !== a.orderCount) {
                    return b.orderCount - a.orderCount;
                }
                return b.totalRevenue - a.totalRevenue;
            })
            .slice(0, limit);
    }

    getTopCoursesBySales(limit: number = 5): any[] {
        const allOrders = this.ordersSubject.value;
        const courseMap = new Map<string, { courseId: string; courseName: string; orderCount: number; totalRevenue: number }>();

        allOrders
            .filter(order => order.status === 'completed')
            .forEach(order => {
                if (order.courses && order.courses.length > 0) {
                    order.courses.forEach(course => {
                        const key = course.courseId;
                        const existing = courseMap.get(key);

                        if (existing) {
                            existing.orderCount += 1;
                            existing.totalRevenue += course.price;
                        } else {
                            courseMap.set(key, {
                                courseId: course.courseId,
                                courseName: course.courseName,
                                orderCount: 1,
                                totalRevenue: course.price
                            });
                        }
                    });
                }
            });

        return Array.from(courseMap.values())
            .sort((a, b) => {
                if (b.orderCount !== a.orderCount) {
                    return b.orderCount - a.orderCount;
                }
                return b.totalRevenue - a.totalRevenue;
            })
            .slice(0, limit);
    }
}
