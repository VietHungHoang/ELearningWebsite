import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../i18n/translate.pipe';
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
    imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
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

    // Pagination
    currentPage: number = 1;
    pageSize: number = 10;
    totalPages: number = 1;
    currentPageHistory: number = 1;
    totalPagesHistory: number = 1;

    summary = {
        totalPending: 0,
        totalInstructors: 0,
        totalOrders: 0
    };

    // Summary filter for KPI cards
    summaryFilter: string = '30days'; // 'all' | 'today' | '7days' | '30days'
    isSummaryFilterMenuOpen: boolean = false;

    isDetailModalOpen = false;
    isConfirmPaymentOpen = false;
    isQRModalOpen = false;
    isBulkConfirmModalOpen = false;  // Modal for bulk confirmation
    selectedPayout: InstructorPayout | null = null;
    paymentNotes: string = '';
    bulkPaymentNotes: string = '';  // Notes for bulk confirmation
    loadingPayment = false;
    qrCodeDataUrl: string = '';

    constructor(private payoutService: PayoutService) {}

    ngOnInit(): void {
        this.loadPayoutData();
    }

    switchTab(tab: 'pending' | 'history'): void {
        this.activeTab = tab;
        if (tab === 'pending') {
            this.calculatePagination();
        } else {
            this.calculatePaginationHistory();
        }
    }

    loadPayoutData(): void {
        this.payoutService.getPayoutData(this.summaryFilter).subscribe({
            next: (response) => {
                this.pendingPayouts = response.pendingPayouts;
                this.groupedPendingPayouts = response.pendingPayouts;
                this.payoutHistory = response.payoutHistory;
                this.filteredPayoutHistory = response.payoutHistory;
                this.summary = response.summary;
                this.applyFiltersAndSearch();
                this.calculatePagination();
                this.calculatePaginationHistory();
            },
            error: (error) => {
                console.error('Error loading payout data:', error);
            }
        });
    }

    onSummaryFilterChange(filter: string): void {
        this.summaryFilter = filter;
        this.isSummaryFilterMenuOpen = false;
        this.loadPayoutData();
    }

    toggleSummaryFilterMenu(): void {
        this.isSummaryFilterMenuOpen = !this.isSummaryFilterMenuOpen;
    }

    getSummaryFilterText(): string {
        const filterMap: { [key: string]: string } = {
            'all': 'payout.summaryFilter.all',
            'today': 'payout.summaryFilter.today',
            '7days': 'payout.summaryFilter.last7Days',
            '30days': 'payout.summaryFilter.last30Days'
        };
        return filterMap[this.summaryFilter] || 'payout.summaryFilter.all';
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

            alert(`✓ Xác nhận thanh toán thành công!\n\nGiảng viên: ${this.selectedPayout!.instructorName}\nSố tiền: ${this.formatCurrency(this.selectedPayout!.totalOwed)}\nNgày: ${historyRecord.paidDate}`);

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

    getPaymentMethodDisplay(method: 'vnpay' | 'momo' | 'sepay'): string {
        switch (method) {
            case 'vnpay':
                return 'payout.paymentMethod.vnpay';
            case 'momo':
                return 'payout.paymentMethod.momo';
            case 'sepay':
                return 'payout.paymentMethod.sepay';
            default:
                return method;
        }
    }

    getPaymentMethodColor(method: 'vnpay' | 'momo' | 'sepay'): string {
        switch (method) {
            case 'vnpay':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'momo':
                return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
            case 'sepay':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
        }
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
                    'Payment Method': this.getPaymentMethodDisplay(p.paymentMethod),
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
                    'Payment Method': this.getPaymentMethodDisplay(h.paymentMethod),
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
            this.isSummaryFilterMenuOpen = false;
        }
    }
}
