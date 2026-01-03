import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService, Payment, PaymentStatus, PaymentMethod, TransactionFilters } from '../../../services/transaction.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { LoadingComponent } from '../../../components/loading/loading.component';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-f-transactions',
    imports: [RouterLink, CommonModule, FormsModule, TranslatePipe, CurrencyFormatPipe, LoadingComponent],
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

    // Date range filter for table
    startDate: string = '';
    endDate: string = '';

    // Summary filter for KPI cards
    summaryFilter: string = '30days'; // 'all' | 'today' | '7days' | '30days'
    isSummaryFilterMenuOpen: boolean = false;

    currentPage: number = 1;
    pageSize: number = 10;
    totalPages: number = 1;
    totalElements: number = 0;
    loading: boolean = false;

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
        failedOrders: 0,
        averageOrderValue: 0,
        successRate: 0,
        revenueTrend: 0,
        aovTrend: 0,
        successRateTrend: 0
    };

    constructor(private transactionService: TransactionService, private router: Router) {}

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.loading = true;

        this.transactionService.getTransactions({
            page: this.currentPage,
            size: this.pageSize,
            status: this.statusFilter || undefined,
            paymentMethod: this.paymentMethodFilter || undefined,
            search: this.searchTerm || undefined,
            startDate: this.startDate || undefined,
            endDate: this.endDate || undefined,
            sortOrder: this.sortOrder,
            typeFilter: this.typeFilter || undefined,
            summaryFilter: this.summaryFilter || 'all' // Filter for KPI cards
        }).subscribe({
            next: (response) => {
                this.filteredOrders = response.content;
                this.orders = response.content;
                this.totalPages = response.totalPages;
                this.totalElements = response.totalElements;
                this.currentPage = response.number + 1; // Convert from 0-based to 1-based

                // Update summary from API response
                if (response.summary) {
                    this.summary = {
                        totalRevenue: response.summary.totalRevenue,
                        completedOrders: response.summary.completedPayments,
                        failedOrders: response.summary.failedPayments,
                        averageOrderValue: response.summary.averageOrderValue,
                        successRate: response.summary.successRate,
                        revenueTrend: response.summary.revenueTrend,
                        aovTrend: response.summary.aovTrend,
                        successRateTrend: response.summary.successRateTrend
                    };
                }

                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading transactions:', error);
                this.loading = false;
            }
        });
    }

    calculatePagination(): void {
        // No longer needed - pagination handled by backend
    }

    getPaginatedOrders(): Payment[] {
        // Return current page data (already paginated by backend)
        return this.filteredOrders;
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
        // Set date range based on selection
        const today = new Date();
        if (range === 'today') {
            this.startDate = today.toISOString().split('T')[0];
            this.endDate = today.toISOString().split('T')[0];
        } else if (range === '7days') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            this.startDate = sevenDaysAgo.toISOString().split('T')[0];
            this.endDate = today.toISOString().split('T')[0];
        } else if (range === '30days') {
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            this.startDate = thirtyDaysAgo.toISOString().split('T')[0];
            this.endDate = today.toISOString().split('T')[0];
        } else {
            this.startDate = '';
            this.endDate = '';
        }
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

    onSummaryFilterChange(filter: string): void {
        this.summaryFilter = filter;
        this.isSummaryFilterMenuOpen = false;
        this.loadOrders(); // Reload to update summary with new filter
    }

    toggleSummaryFilterMenu(): void {
        this.isSummaryFilterMenuOpen = !this.isSummaryFilterMenuOpen;
    }

    getSummaryFilterText(): string {
        const filterMap: { [key: string]: string } = {
            'all': 'transactions.summaryFilter.all',
            'today': 'transactions.summaryFilter.today',
            '7days': 'transactions.summaryFilter.last7Days',
            '30days': 'transactions.summaryFilter.last30Days'
        };
        return filterMap[this.summaryFilter] || 'transactions.summaryFilter.all';
    }

    approveOrderManually(): void {
        if (!this.selectedOrder) return;

        this.loadingApproval = true;

        // Manually approve pending payment (fallback if webhook fails)
        // Normally payment gateway webhook auto-updates status
        const success = this.transactionService.approvePaymentManually(
            this.selectedOrder!.id,
            this.approvalNotes
        );

        if (success) {
            alert('✓ Giao dịch đã được duyệt thành công!\nThông thường webhook từ payment gateway sẽ tự động cập nhật.\nDùng chức năng này khi webhook bị lỗi.');
            this.loadOrders();
            this.isApproveConfirmOpen = false;
            this.isDetailModalOpen = false;
            this.selectedOrder = null;
        } else {
            alert('✗ Lỗi: Không thể duyệt giao dịch này.\nChỉ có thể duyệt giao dịch đang chờ (Pending).');
        }

        this.loadingApproval = false;
    }

    updateSummary(): void {
        // Summary is now updated from API response in loadOrders()
        // This method kept for backward compatibility if needed
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
                return 'transactions.status.completed';
            case 'failed':
                return 'transactions.status.failed';
            case 'pending':
                return 'transactions.status.pending';
            default:
                return status;
        }
    }

    getPaymentMethodDisplay(method: PaymentMethod): string {
        return method === 'momo' ? 'transactions.paymentMethod.momo' : method === 'vnpay' ? 'transactions.paymentMethod.vnpay' : 'transactions.paymentMethod.banking';
    }

    getPaymentMethodIcon(method: PaymentMethod): string {
        return method === 'momo' ? 'momo-icon' : method === 'vnpay' ? 'vnpay-icon' : 'banking-icon';
    }

    formatCurrency(amount: number): string {
        return this.transactionService.formatCurrency(amount);
    }

    canApproveOrder(order: Payment): boolean {
        // Allow manual approval for pending payments (in case webhook fails)
        // Normally payment gateway webhook auto-updates pending → completed/failed
        return order.status === 'pending';
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
        if (!target.closest('.trezo-card-dropdown')) {
            this.isSummaryFilterMenuOpen = false;
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

    // Helper methods for trend indicators
    getTrendIcon(trend: number): string {
        if (trend > 0) return 'trending_up';
        if (trend < 0) return 'trending_down';
        return 'trending_flat';
    }

    getTrendColor(trend: number): string {
        if (trend > 0) return 'text-success';
        if (trend < 0) return 'text-danger';
        return 'text-gray-500';
    }

    formatTrend(trend: number): string {
        const prefix = trend > 0 ? '+' : '';
        return `${prefix}${trend.toFixed(1)}%`;
    }

    getSuccessRateColor(rate: number): string {
        if (rate >= 95) return '#10b981'; // Green
        if (rate >= 85) return '#f59e0b'; // Yellow/Orange
        return '#ef4444'; // Red
    }

    getSuccessRateIcon(rate: number): string {
        if (rate >= 95) return 'check_circle';
        if (rate >= 85) return 'warning';
        return 'error';
    }
}
