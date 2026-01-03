import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { PayoutService } from './payout.service';
import * as XLSX from 'xlsx';

declare const QRCode: any;

export interface InstructorPayout {
    id: string;
    instructorId: string;
    instructorName: string;
    bankAccount: string;
    bankName: string;
    accountHolderName: string;
    paymentMethod: 'vnpay' | 'momo' | 'sepay';  // Phương thức thanh toán
    totalOwed: number;
    baseAmount: number;        // Tiền gốc
    platformFee: number;       // Phí nền tảng
    tax: number;               // Thuế
    totalAmount: number;       // Tổng tiền sau cùng
    orderCount: number;
    orders: PayoutOrder[];
    createdDate: string;
    status: 'pending' | 'paid';
}

export interface PayoutOrder {
    orderId: string;
    orderNumber: string;
    learnerName: string;
    sessionName: string;
    sessionType: '1 and 1' | '1 and n';
    hourlyRate: number;
    hours: number;
    amount: number;
    date: string;
}

export interface PayoutHistory {
    id: string;  // Cùng ID với pending payout (payout-1, payout-2...)
    batchNumber: string;
    instructorId: string;
    instructorName: string;
    paymentMethod: 'vnpay' | 'momo' | 'sepay';  // Phương thức thanh toán
    paidAmount: number;
    paidDate: string;
    approvedBy: string;
    notes: string;
    orderCount: number;
    status: 'complete' | 'failed';
}

@Component({
    selector: 'app-f-payout',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TranslatePipe, CurrencyFormatPipe, LoadingComponent],
    templateUrl: './f-payout.component.html',
    styleUrl: './f-payout.component.scss'
})
export class FPayoutComponent implements OnInit {

    activeTab: 'pending' | 'history' = 'pending';

    pendingPayouts: InstructorPayout[] = [];
    groupedPendingPayouts: InstructorPayout[] = [];

    payoutHistory: PayoutHistory[] = [];
    filteredPayoutHistory: PayoutHistory[] = [];

    // Multi-select for bulk confirmation
    selectedPayouts: Set<string> = new Set();

    // Filter and Search
    filterStatus: 'all' | 'complete' | 'failed' = 'all';
    searchQuery: string = '';
    fromDate: string = '';
    toDate: string = '';

    // Pending Tab Filters
    cycleFilter: 'current' | 'next' | 'overdue' | 'all' = 'current';
    groupByPayoutDate: boolean = false;
    isCycleFilterOpen: boolean = false;

    // Current cycle info
    currentCycleStart: Date = new Date();
    currentCycleEnd: Date = new Date();
    cutoffDate: Date = new Date();
    payoutDate: Date = new Date();

    // Pagination
    currentPage: number = 1;
    pageSize: number = 10;
    totalPages: number = 1;
    currentPageHistory: number = 1;
    totalPagesHistory: number = 1;

    summary = {
        totalPending: 0,
        pendingAmount: 0,
        totalInstructors: 0
    };

    // KPI filter - changes based on active tab
    // For pending tab: 'current-cycle' | 'next-cycle' | 'all-cycles'
    // For history tab: '7days' | '30days' | 'this-month' | 'all-time'
    kpiFilter: string = 'current-cycle';
    isKpiFilterMenuOpen: boolean = false;

    isDetailModalOpen = false;
    isConfirmPaymentOpen = false;
    isQRModalOpen = false;
    isBulkConfirmModalOpen = false;  // Modal for bulk confirmation
    isSuccessModalOpen = false;  // Success notification modal
    successMessage = {
        title: '',
        instructor: '',
        amount: '',
        date: ''
    };
    selectedPayout: InstructorPayout | null = null;
    paymentNotes: string = '';
    bulkPaymentNotes: string = '';  // Notes for bulk confirmation
    loadingPayment = false;
    isLoading = false;
    qrCodeDataUrl: string = '';

    constructor(private payoutService: PayoutService) {}

    ngOnInit(): void {
        this.initializeCycleDates();
        this.loadPayoutData();
    }

    initializeCycleDates(): void {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Chu kỳ: 16 tháng trước - 15 tháng này
        if (today.getDate() <= 15) {
            // Đang trong chu kỳ tháng trước
            this.currentCycleStart = new Date(currentYear, currentMonth - 1, 16);
            this.currentCycleEnd = new Date(currentYear, currentMonth, 15);
            this.cutoffDate = new Date(currentYear, currentMonth, 15);
            this.payoutDate = new Date(currentYear, currentMonth, 20);
        } else {
            // Đang trong chu kỳ tháng này
            this.currentCycleStart = new Date(currentYear, currentMonth, 16);
            this.currentCycleEnd = new Date(currentYear, currentMonth + 1, 15);
            this.cutoffDate = new Date(currentYear, currentMonth + 1, 15);
            this.payoutDate = new Date(currentYear, currentMonth + 1, 20);
        }
    }

    getDaysToCutoff(): number {
        const today = new Date();
        const diff = this.cutoffDate.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    }

    getDaysToPayout(): number {
        const today = new Date();
        const diff = this.payoutDate.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    }

    formatCycleDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    toggleCycleFilter(): void {
        this.isCycleFilterOpen = !this.isCycleFilterOpen;
    }

    setCycleFilter(filter: 'current' | 'next' | 'overdue' | 'all'): void {
        this.cycleFilter = filter;
        this.isCycleFilterOpen = false;
    }

    getCycleFilterText(): string {
        const map: Record<string, string> = {
            'current': 'payout.cycleFilter.current',
            'next': 'payout.cycleFilter.next',
            'overdue': 'payout.cycleFilter.overdue',
            'all': 'payout.cycleFilter.all'
        };
        return map[this.cycleFilter] || 'payout.cycleFilter.all';
    }

    toggleGroupByPayoutDate(): void {
        this.groupByPayoutDate = !this.groupByPayoutDate;
    }

    isOverdue(payout: InstructorPayout): boolean {
        // Check if payout date has passed
        const today = new Date();
        const payoutCreatedDate = new Date(payout.createdDate);
        return today > this.payoutDate && payoutCreatedDate < this.payoutDate;
    }

    switchTab(tab: 'pending' | 'history'): void {
        this.activeTab = tab;

        // Auto-switch KPI filter when changing tabs
        if (tab === 'pending') {
            this.kpiFilter = 'current-cycle';
            this.calculatePagination();
        } else {
            this.kpiFilter = '30days';
            this.calculatePaginationHistory();
        }

        this.loadPayoutData();
    }

    getKpiFilterOptions(): string[] {
        if (this.activeTab === 'pending') {
            return ['current-cycle', 'next-cycle', 'all-cycles'];
        } else {
            return ['7days', '30days', 'this-month', 'all-time'];
        }
    }

    getKpiFilterLabel(option: string): string {
        const labelMap: Record<string, string> = {
            // Cycle filters (for pending tab)
            'current-cycle': 'payout.kpiFilter.currentCycle',
            'next-cycle': 'payout.kpiFilter.nextCycle',
            'all-cycles': 'payout.kpiFilter.allCycles',
            // Time filters (for history tab)
            '7days': 'payout.kpiFilter.last7Days',
            '30days': 'payout.kpiFilter.last30Days',
            'this-month': 'payout.kpiFilter.thisMonth',
            'all-time': 'payout.kpiFilter.allTime'
        };
        return labelMap[option] || option;
    }

    getCurrentKpiFilterLabel(): string {
        return this.getKpiFilterLabel(this.kpiFilter);
    }

    toggleKpiFilterMenu(): void {
        this.isKpiFilterMenuOpen = !this.isKpiFilterMenuOpen;
    }

    setKpiFilter(filter: string): void {
        this.kpiFilter = filter;
        this.isKpiFilterMenuOpen = false;
        this.loadPayoutData();
    }

    loadPayoutData(): void {
        this.isLoading = true;
        this.payoutService.getPayoutData(this.kpiFilter).subscribe({
            next: (response) => {
                this.pendingPayouts = response.pendingPayouts;
                this.groupedPendingPayouts = response.pendingPayouts;
                this.payoutHistory = response.payoutHistory;
                this.filteredPayoutHistory = response.payoutHistory;
                this.summary = response.summary;
                this.applyFiltersAndSearch();
                this.calculatePagination();
                this.calculatePaginationHistory();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading payout data:', error);
                this.isLoading = false;
            }
        });
    }

    openDetailModal(payout: InstructorPayout): void {
        this.selectedPayout = payout;
        this.isDetailModalOpen = true;
    }

    closeDetailModal(): void {
        this.isDetailModalOpen = false;
        this.selectedPayout = null;
    }

    openConfirmPayment(payout: InstructorPayout): void {
        this.selectedPayout = payout;
        this.isConfirmPaymentOpen = true;
        this.paymentNotes = '';
    }

    cancelPayment(): void {
        this.isConfirmPaymentOpen = false;
        this.paymentNotes = '';
    }

    // Multi-select methods
    togglePayoutSelection(payoutId: string): void {
        if (this.selectedPayouts.has(payoutId)) {
            this.selectedPayouts.delete(payoutId);
        } else {
            this.selectedPayouts.add(payoutId);
        }
    }

    toggleSelectAll(): void {
        const paginatedPayouts = this.getPaginatedPendingPayouts();
        if (this.selectedPayouts.size === paginatedPayouts.length && paginatedPayouts.every(p => this.selectedPayouts.has(p.id))) {
            paginatedPayouts.forEach(p => this.selectedPayouts.delete(p.id));
        } else {
            paginatedPayouts.forEach(p => this.selectedPayouts.add(p.id));
        }
    }

    isPayoutSelected(payoutId: string): boolean {
        return this.selectedPayouts.has(payoutId);
    }

    isAllSelected(): boolean {
        const paginatedPayouts = this.getPaginatedPendingPayouts();
        return paginatedPayouts.length > 0 && paginatedPayouts.every(p => this.selectedPayouts.has(p.id));
    }

    getTotalSelectedAmount(): number {
        let total = 0;
        this.selectedPayouts.forEach(payoutId => {
            const payout = this.pendingPayouts.find(p => p.id === payoutId);
            if (payout) {
                total += payout.totalOwed;
            }
        });
        return total;
    }

    confirmBulkPayment(): void {
        if (this.selectedPayouts.size === 0) {
            alert('Please select at least one payout');
            return;
        }

        this.isBulkConfirmModalOpen = true;
        this.bulkPaymentNotes = '';
    }

    closeBulkConfirmModal(): void {
        this.isBulkConfirmModalOpen = false;
        this.bulkPaymentNotes = '';
    }

    processBulkPayment(): void {
        if (this.selectedPayouts.size === 0) return;

        this.loadingPayment = true;

        setTimeout(() => {
            const selectedIds = Array.from(this.selectedPayouts);
            const currentDate = new Date();

            selectedIds.forEach(payoutId => {
                const payout = this.pendingPayouts.find(p => p.id === payoutId);
                if (payout) {
                    const historyRecord: PayoutHistory = {
                        id: payout.id,
                        batchNumber: `PAYOUT-${new Date().getFullYear()}-${this.getMonthNumber()}`,
                        instructorId: payout.instructorId,
                        instructorName: payout.instructorName,
                        paymentMethod: payout.paymentMethod,
                        paidAmount: payout.totalOwed,
                        paidDate: currentDate.toISOString(),
                        approvedBy: 'Admin - Current User',
                        notes: this.bulkPaymentNotes || 'Bulk confirmation payment',
                        orderCount: payout.orderCount,
                        status: 'complete'
                    };
                    this.payoutHistory.unshift(historyRecord);
                }
            });

            this.pendingPayouts = this.pendingPayouts.filter(p => !this.selectedPayouts.has(p.id));
            this.groupedPendingPayouts = this.pendingPayouts;
            this.selectedPayouts.clear();

            this.loadPayoutData(); // Reload to update summary
            this.calculatePagination();
            this.loadingPayment = false;

            this.isBulkConfirmModalOpen = false;
            this.bulkPaymentNotes = '';
        }, 500);
    }

    markAsPaid(): void {
        if (!this.selectedPayout) return;

        this.loadingPayment = true;

        setTimeout(() => {

            const historyRecord: PayoutHistory = {
                id: this.selectedPayout!.id,  // Dùng cùng ID từ pending payout
                batchNumber: `PAYOUT-${new Date().getFullYear()}-${this.getMonthNumber()}`,
                instructorId: this.selectedPayout!.instructorId,
                instructorName: this.selectedPayout!.instructorName,
                paymentMethod: this.selectedPayout!.paymentMethod,
                paidAmount: this.selectedPayout!.totalOwed,
                paidDate: this.getCurrentDate(),
                approvedBy: 'Admin - Current User',
                notes: this.paymentNotes,
                orderCount: this.selectedPayout!.orderCount,
                status: 'complete'
            };

            this.payoutHistory.unshift(historyRecord);

            this.pendingPayouts = this.pendingPayouts.filter(p => p.id !== this.selectedPayout!.id);
            this.groupedPendingPayouts = this.pendingPayouts;

            this.loadPayoutData(); // Reload to update summary
            this.calculatePagination();

            // Show success modal instead of alert
            this.successMessage = {
                title: 'Xác nhận thanh toán thành công!',
                instructor: this.selectedPayout!.instructorName,
                amount: this.formatCurrency(this.selectedPayout!.totalOwed),
                date: historyRecord.paidDate
            };
            this.isSuccessModalOpen = true;

            this.isConfirmPaymentOpen = false;
            this.isDetailModalOpen = false;
            this.selectedPayout = null;
            this.loadingPayment = false;
        }, 500);
    }

    openQRPaymentModal(payout: InstructorPayout): void {
        this.selectedPayout = payout;
        this.generateQRCode(payout);
    }

    generateQRCode(payout: InstructorPayout): void {
        if (!payout) return;

        try {
            // QR data includes bank info and total amount
            const qrData = `${payout.bankName}|${payout.bankAccount}|${payout.accountHolderName}|${payout.totalAmount}`;

            import('qrcode').then(QRCodeModule => {
                QRCodeModule.toDataURL(qrData, {
                    errorCorrectionLevel: 'H',
                    type: 'image/png',
                    width: 300,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                }).then((url: string) => {
                    this.qrCodeDataUrl = url;
                    this.isQRModalOpen = true;
                }).catch((error: any) => {
                    console.error('Error generating QR code:', error);
                    alert('Lỗi tạo mã QR');
                });
            });
        } catch (error) {
            console.error('Error generating QR code:', error);
            alert('Lỗi tạo mã QR');
        }
    }

    closeQRModal(): void {
        this.isQRModalOpen = false;
        this.qrCodeDataUrl = '';
    }

    closeSuccessModal(): void {
        this.isSuccessModalOpen = false;
        this.switchTab('history'); // Auto switch to history tab to see the result
    }

    confirmQRPayment(): void {
        if (!this.selectedPayout) return;

        // Close QR modal
        this.closeQRModal();

        // Mark as paid (same logic as confirm payment modal)
        this.markAsPaid();
    }

    downloadQRCode(): void {
        if (!this.qrCodeDataUrl || !this.selectedPayout) return;

        const link = document.createElement('a');
        link.href = this.qrCodeDataUrl;
        link.download = `qr-${this.selectedPayout.instructorName}-${Date.now()}.png`;
        link.click();
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
    }

    getCurrentDate(): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        return new Date().toLocaleDateString('vi-VN', options);
    }

    private getMonthNumber(): string {
        const month = new Date().getMonth() + 1;
        return month < 10 ? `0${month}` : `${month}`;
    }

    getSelectedPayoutsList(): InstructorPayout[] {
        return Array.from(this.selectedPayouts)
            .map(payoutId => this.pendingPayouts.find(p => p.id === payoutId))
            .filter((payout): payout is InstructorPayout => !!payout);
    }

    applyFiltersAndSearch(): void {
        let filtered = [...this.payoutHistory];

        // Filter by status
        if (this.filterStatus !== 'all') {
            filtered = filtered.filter(h => h.status === this.filterStatus);
        }

        // Filter by date range
        if (this.fromDate || this.toDate) {
            filtered = filtered.filter(h => {
                const paymentDateTime = new Date(h.paidDate).getTime();
                const fromDateTime = this.fromDate ? new Date(this.fromDate).getTime() : 0;
                const toDateTime = this.toDate ? new Date(this.toDate).getTime() : Number.MAX_SAFE_INTEGER;
                return paymentDateTime >= fromDateTime && paymentDateTime <= toDateTime;
            });
        }

        // Search by instructor name or batch number
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(h =>
                h.instructorName.toLowerCase().includes(query) ||
                h.batchNumber.toLowerCase().includes(query)
            );
        }

        this.filteredPayoutHistory = filtered;
        this.calculatePaginationHistory();
    }

    calculatePagination(): void {
        this.totalPages = Math.ceil(this.pendingPayouts.length / this.pageSize);
        if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
        }
    }

    calculatePaginationHistory(): void {
        this.totalPagesHistory = Math.ceil(this.filteredPayoutHistory.length / this.pageSize);
        if (this.currentPageHistory > this.totalPagesHistory) {
            this.currentPageHistory = Math.max(1, this.totalPagesHistory);
        }
    }

    getPaginatedPendingPayouts(): InstructorPayout[] {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.pendingPayouts.slice(start, end);
    }

    getPaginatedHistory(): PayoutHistory[] {
        const start = (this.currentPageHistory - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.filteredPayoutHistory.slice(start, end);
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

    goToPageHistory(page: number): void {
        if (page >= 1 && page <= this.totalPagesHistory) {
            this.currentPageHistory = page;
        }
    }

    nextPageHistory(): void {
        if (this.currentPageHistory < this.totalPagesHistory) {
            this.currentPageHistory++;
        }
    }

    prevPageHistory(): void {
        if (this.currentPageHistory > 1) {
            this.currentPageHistory--;
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

    getPageNumbersHistory(): number[] {
        const pages: number[] = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, this.currentPageHistory - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(this.totalPagesHistory, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }

    onFilterChange(): void {
        this.currentPageHistory = 1;
        this.applyFiltersAndSearch();
    }

    onSearchChange(): void {
        this.currentPageHistory = 1;
        this.applyFiltersAndSearch();
    }

    onDateChange(): void {
        this.currentPageHistory = 1;
        this.applyFiltersAndSearch();
    }

    clearFilters(): void {
        this.filterStatus = 'all';
        this.searchQuery = '';
        this.fromDate = '';
        this.toDate = '';
        this.currentPageHistory = 1;
        this.applyFiltersAndSearch();
    }

    exportToExcel(): void {
        try {
            if (this.activeTab === 'pending') {
                // Export pending payouts
                const data = this.pendingPayouts.map(p => ({
                    'STT': this.pendingPayouts.indexOf(p) + 1,
                    'Instructor Name': p.instructorName,
                    'Bank Name': p.bankName,
                    'Account Number': p.bankAccount,
                    'Account Holder': p.accountHolderName,
                    'Base Amount': p.baseAmount,
                    'Platform Fee': p.platformFee,
                    'Tax': p.tax,
                    'Total Amount': p.totalAmount,
                    'Orders Count': p.orderCount,
                    'Created Date': p.createdDate,
                    'Status': p.status
                }));

                if (data.length === 0) {
                    alert('Không có dữ liệu để xuất Excel');
                    return;
                }

                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Pending Payouts');

                const currentDate = new Date().toISOString().split('T')[0];
                const filename = `pending-payouts-${currentDate}.xlsx`;
                XLSX.writeFile(workbook, filename);
            } else {
                // Export payment history
                const data = this.filteredPayoutHistory.map(h => ({
                    'STT': this.filteredPayoutHistory.indexOf(h) + 1,
                    'Instructor Name': h.instructorName,
                    'Amount': h.paidAmount,
                    'Payment Date': h.paidDate,
                    'Approved By': h.approvedBy,
                    'Status': h.status,
                    'Notes': h.notes
                }));

                if (data.length === 0) {
                    alert('Không có dữ liệu để xuất Excel');
                    return;
                }

                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Payment History');

                const currentDate = new Date().toISOString().split('T')[0];
                const filename = `payment-history-${currentDate}.xlsx`;
                XLSX.writeFile(workbook, filename);
            }
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Lỗi khi xuất file Excel. Vui lòng thử lại.');
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.modal')) {

        }
        if (!target.closest('.trezo-card-dropdown')) {
            this.isKpiFilterMenuOpen = false;
        }
    }
}
