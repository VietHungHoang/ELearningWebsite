import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService, Order, OrderStatus, PaymentMethod, TransactionFilters } from '../../../services/transaction.service';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-f-transactions',
    imports: [RouterLink, CommonModule, FormsModule],
    templateUrl: './f-transactions.component.html',
    styleUrl: './f-transactions.component.scss'
})
export class FTransactionsComponent implements OnInit {

    Math = Math;

    orders: Order[] = [];
    filteredOrders: Order[] = [];
    selectedOrder: Order | null = null;
    topInstructors: any[] = [];

    searchTerm: string = '';
    statusFilter: OrderStatus | '' = '';
    paymentMethodFilter: PaymentMethod | '' = '';
    dateRangeFilter: string = 'all'; 
    sortOrder: 'asc' | 'desc' = 'desc'; 

    currentPage: number = 1;
    pageSize: number = 10;
    totalPages: number = 1;

    isDetailModalOpen = false;
    isApproveConfirmOpen = false;
    isFilterMenuOpen = false;
    isPaymentMethodMenuOpen = false;
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

        this.filteredOrders = this.transactionService.getOrdersFiltered(filters);
        this.calculatePagination();
    }

    calculatePagination(): void {
        this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
        if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
        }
    }

    getPaginatedOrders(): Order[] {

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

    onStatusFilterChange(status: OrderStatus | ''): void {
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

    openApproveConfirm(order: Order): void {
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
            const success = this.transactionService.approveOrderManually(
                this.selectedOrder!.id,
                this.approvalNotes
            );

            if (success) {

                alert('✓ Đơn hàng đã được duyệt thủ công thành công!\nHệ thống tự động tính toán hoa hồng cho giảng viên.');

                this.loadOrders();
                this.updateSummary();
                this.isApproveConfirmOpen = false;
                this.isDetailModalOpen = false;
                this.selectedOrder = null;
            } else {
                alert('✗ Lỗi: Không thể duyệt đơn hàng này (có thể đã hoàn thành hoặc không tồn tại)');
            }

            this.loadingApproval = false;
        }, 500);
    }

    updateSummary(): void {
        const stats = this.transactionService.getSummary();
        this.summary = {
            totalRevenue: stats.totalRevenue,
            completedOrders: stats.completedOrders,
            failedOrders: stats.failedOrders
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

    getStatusClass(status: OrderStatus): string {
        switch (status) {
            case 'completed':
                return 'bg-success-50 text-success-600';
            case 'failed':
                return 'bg-danger-50 text-danger-600';
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
    getStatusText(status: OrderStatus): string {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'failed':
                return 'Failed';
            default:
                return status;
        }
    }

    getPaymentMethodDisplay(method: PaymentMethod): string {
        return method === 'momo' ? 'Momo' : 'VNPay';
    }

    getPaymentMethodIcon(method: PaymentMethod): string {
        return method === 'momo' ? 'momo-icon' : 'vnpay-icon';
    }

    formatCurrency(amount: number): string {
        return this.transactionService.formatCurrency(amount);
    }

    canApproveOrder(order: Order): boolean {
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
        const dataToExport = this.filteredOrders.map(order => ({
            'Order ID': order.id,
            'Order Number': order.orderNumber,
            'Learner Name': order.learnerName,
            'Learner Email': order.learnerEmail,
            'Type': order.type,
            'Course Name': order.courseName,
            'Total Amount': order.totalAmount,
            'Currency': order.currency,
            'Payment Method': this.getPaymentMethodDisplay(order.paymentMethod),
            'Status': order.status,
            'Created Date': order.createdDate,
            'Completed Date': order.completedDate || '',
            'Instructor Name': order.instructorName,
            'Commission Percentage': order.instructorCommissionPercentage
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

        const currentDate = new Date().toISOString().split('T')[0];
        const filename = `transactions_${currentDate}.xlsx`;

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
}
