import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService, Payment, PaymentStatus, PaymentMethod, TransactionFilters } from '../../../services/transaction.service';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-f-transactions',
    imports: [RouterLink, CommonModule, FormsModule],
    templateUrl: './f-transactions.component.html',
    styleUrl: './f-transactions.component.scss'
})
export class FTransactionsComponent implements OnInit {

    Math = Math;

    orders: Payment[] = [];
    filteredOrders: Payment[] = [];
    selectedOrder: Payment | null = null;
    topInstructors: any[] = [];

    searchTerm: string = '';
    statusFilter: PaymentStatus | '' = '';
    paymentMethodFilter: PaymentMethod | '' = '';
    typeFilter: '1 and 1' | '1 and n' | '' = '';
    dateRangeFilter: string = 'all';
    sortOrder: 'asc' | 'desc' = 'desc';

    // Date range filter
    startDate: string = '';
    endDate: string = '';

    currentPage: number = 1;
    pageSize: number = 10;
    totalPages: number = 1;

    isDetailModalOpen = false;
    isApproveConfirmOpen = false;
    isFilterMenuOpen = false;
    isPaymentMethodMenuOpen = false;
    isTypeMenuOpen = false;
    isDateMenuOpen = false;
    loadingApproval = false;
    approvalNotes: string = '';

    summary = {
        totalRevenue: 0,
        completedOrders: 0,
        failedOrders: 0
    };

    constructor(private transactionService: TransactionService, private router: Router) {}

    ngOnInit(): void {
        this.loadOrders();
        this.updateSummary();
    }

    loadOrders(): void {
        const filters: TransactionFilters = {
            searchTerm: this.searchTerm,
            status: this.statusFilter || undefined,
            paymentMethod: this.paymentMethodFilter || undefined
        };

        this.filteredOrders = this.transactionService.getPaymentsFiltered(filters);

        // Apply date range filter
        if (this.startDate || this.endDate) {
            this.filteredOrders = this.filteredOrders.filter(order => {
                const orderDate = new Date(order.createdDate);

                if (this.startDate) {
                    const startDate = new Date(this.startDate);
                    startDate.setHours(0, 0, 0, 0);
                    if (orderDate < startDate) return false;
                }

                if (this.endDate) {
                    const endDate = new Date(this.endDate);
                    endDate.setHours(23, 59, 59, 999);
                    if (orderDate > endDate) return false;
                }

                return true;
            });
        }

        this.calculatePagination();
    }

    calculatePagination(): void {
        this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
        if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
        }
    }

    getPaginatedOrders(): Payment[] {

        const sortedOrders = [...this.filteredOrders].sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();
            return this.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return sortedOrders.slice(start, end);
    }

    onSearchChange(value: string): void {
        this.searchTerm = value;
        this.currentPage = 1;
        this.loadOrders();
    }

    onSearchSubmit(): void {
        this.currentPage = 1;
        this.loadOrders();
    }

    onStatusFilterChange(status: PaymentStatus | ''): void {
        this.statusFilter = status;
        this.currentPage = 1;
        this.loadOrders();
    }

    onPaymentMethodChange(method: PaymentMethod | ''): void {
        this.paymentMethodFilter = method;
        this.currentPage = 1;
        this.loadOrders();
    }

    onDateRangeChange(range: string): void {
        this.dateRangeFilter = range;
        this.currentPage = 1;
        this.loadOrders();
        this.isDateMenuOpen = false;
    }

    openApproveConfirm(order: Payment): void {
        this.selectedOrder = order;
        this.isApproveConfirmOpen = true;
        this.approvalNotes = '';
    }

    cancelApproval(): void {
        this.isApproveConfirmOpen = false;
        this.approvalNotes = '';
    }

    approveOrderManually(): void {
        if (!this.selectedOrder) return;

        this.loadingApproval = true;

        setTimeout(() => {
            const success = this.transactionService.approvePaymentManually(
                this.selectedOrder!.id,
                this.approvalNotes
            );

            if (success) {

                alert('✓ Thanh toán đã được duyệt thủ công thành công!\nHệ thống sẽ bao gồm trong bảng thanh toán hàng tháng cho giảng viên.');

                this.loadOrders();
                this.updateSummary();
                this.isApproveConfirmOpen = false;
                this.isDetailModalOpen = false;
                this.selectedOrder = null;
            } else {
                alert('✗ Lỗi: Không thể duyệt thanh toán này (có thể đã hoàn thành hoặc không tồn tại)');
            }

            this.loadingApproval = false;
        }, 500);
    }

    updateSummary(): void {
        const stats = this.transactionService.getSummary();
        this.summary = {
            totalRevenue: stats.totalRevenue,
            completedOrders: stats.completedPayments,
            failedOrders: stats.failedPayments
        };
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    getPageNumbers(): number[] {
        const pages: number[] = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }

    getStatusClass(status: PaymentStatus): string {
        switch (status) {
            case 'completed':
                return 'bg-success-50 text-success-600';
            case 'failed':
                return 'bg-danger-50 text-danger-600';
            case 'pending':
                return 'bg-warning-50 text-warning-600';
            default:
                return 'bg-gray-50 text-gray-600';
        }
    }

    getStatusFilterText(): string {
        if (!this.statusFilter) return 'All';
        return this.getStatusText(this.statusFilter);
    }

    getPaymentMethodFilterText(): string {
        if (!this.paymentMethodFilter) return 'All';
        return this.getPaymentMethodDisplay(this.paymentMethodFilter);
    }

    getTypeFilterText(): string {
        if (!this.typeFilter) return 'All';
        return this.typeFilter === '1 and 1' ? '1-on-1' : 'Group';
    }

    onTypeFilterChange(type: '1 and 1' | '1 and n' | ''): void {
        this.typeFilter = type;
        this.currentPage = 1;
        this.loadOrders();
        this.isTypeMenuOpen = false;
    }

    toggleTypeMenu(): void {
        this.isTypeMenuOpen = !this.isTypeMenuOpen;
        if (this.isTypeMenuOpen) {
            this.isFilterMenuOpen = false;
            this.isPaymentMethodMenuOpen = false;
            this.isDateMenuOpen = false;
        }
    }

    getStatusText(status: PaymentStatus): string {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'failed':
                return 'Failed';
            case 'pending':
                return 'Pending';
            default:
                return status;
        }
    }

    getPaymentMethodDisplay(method: PaymentMethod): string {
        return method === 'momo' ? 'Momo' : method === 'vnpay' ? 'VNPay' : 'Banking';
    }

    getPaymentMethodIcon(method: PaymentMethod): string {
        return method === 'momo' ? 'momo-icon' : method === 'vnpay' ? 'vnpay-icon' : 'banking-icon';
    }

    formatCurrency(amount: number): string {
        return this.transactionService.formatCurrency(amount);
    }

    canApproveOrder(order: Payment): boolean {
        return order.status === 'failed';
    }

    toggleFilterMenu(): void {
        this.isFilterMenuOpen = !this.isFilterMenuOpen;
    }

    togglePaymentMethodMenu(): void {
        this.isPaymentMethodMenuOpen = !this.isPaymentMethodMenuOpen;
    }

    toggleDateMenu(): void {
        this.isDateMenuOpen = !this.isDateMenuOpen;
    }

    toggleSortOrder(): void {
        this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
        this.currentPage = 1;
        this.loadOrders();
    }

    exportToExcel(): void {
        const dataToExport = this.filteredOrders.map(payment => ({
            'Payment ID': payment.id,
            'Payment Number': payment.paymentNumber,
            'Learner Name': payment.learnerName,
            'Learner Email': payment.learnerEmail,
            'Session ID': payment.sessionId,
            'Class Name': payment.session?.className || '',
            'Instructor Name': payment.session?.instructorName || '',
            'Duration (Minutes)': payment.session?.durationMinutes || 0,
            'Rate per Hour': payment.session?.ratePerHour || 0,
            'Total Amount': payment.totalAmount,
            'Currency': payment.currency,
            'Platform Fee': payment.platformFeeAmount || 0,
            'Instructor Earnings': payment.instructorEarnings || 0,
            'Payment Method': this.getPaymentMethodDisplay(payment.paymentMethod),
            'Status': payment.status,
            'Created Date': payment.createdDate,
            'Completed Date': payment.completedDate || '',
            'Transaction ID': payment.transactionId || ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');

        const currentDate = new Date().toISOString().split('T')[0];
        const filename = `payments_${currentDate}.xlsx`;

        XLSX.writeFile(workbook, filename);
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.filter-dropdown')) {
            this.isFilterMenuOpen = false;
        }
        if (!target.closest('.payment-method-dropdown')) {
            this.isPaymentMethodMenuOpen = false;
        }
        if (!target.closest('.date-dropdown')) {
            this.isDateMenuOpen = false;
        }
    }

    // New filter methods
    applyFilters(): void {
        this.currentPage = 1;
        this.loadOrders();
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.statusFilter = '';
        this.paymentMethodFilter = '';
        this.typeFilter = '';
        this.startDate = '';
        this.endDate = '';
        this.dateRangeFilter = 'all';
        this.sortOrder = 'desc';
        this.currentPage = 1;
        this.loadOrders();
    }

    hasActiveFilters(): boolean {
        return !!(this.searchTerm || this.statusFilter || this.paymentMethodFilter || this.typeFilter || this.startDate || this.endDate);
    }
}
