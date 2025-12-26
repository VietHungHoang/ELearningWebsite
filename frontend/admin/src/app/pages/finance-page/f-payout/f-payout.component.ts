import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

declare const QRCode: any;

export interface InstructorPayout {
    id: string;
    instructorId: string;
    instructorName: string;
    bankAccount: string;
    bankName: string;
    accountHolderName: string;
    totalOwed: number;
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
    imports: [CommonModule, FormsModule, RouterLink],
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

    summary = {
        totalPending: 0,
        totalInstructors: 0,
        totalOrders: 0
    };

    isDetailModalOpen = false;
    isConfirmPaymentOpen = false;
    isQRModalOpen = false;
    isBulkConfirmModalOpen = false;  // Modal for bulk confirmation
    selectedPayout: InstructorPayout | null = null;
    paymentNotes: string = '';
    bulkPaymentNotes: string = '';  // Notes for bulk confirmation
    loadingPayment = false;
    qrCodeDataUrl: string = '';

    constructor() {}

    ngOnInit(): void {
        this.loadPayoutData();
        this.loadPayoutHistory();
        this.applyFiltersAndSearch();
        this.updateSummary();
    }

    switchTab(tab: 'pending' | 'history'): void {
        this.activeTab = tab;
    }

    private loadPayoutData(): void {

        const rawPayouts: PayoutOrder[] = [
            {
                orderId: crypto.randomUUID(),
                orderNumber: `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
                learnerName: 'Nguyễn Văn A',
                sessionName: 'English Conversation',
                sessionType: '1 and 1',
                hourlyRate: 15,
                hours: 5,
                amount: 60,
                date: '05 Nov 2025 14:30:25'
            },
            {
                orderId: '12346',
                orderNumber: 'ORD-2025-00002',
                learnerName: 'Trần Thị B',
                sessionName: 'Business English',
                sessionType: '1 and n',
                hourlyRate: 12,
                hours: 3,
                amount: 28.8,
                date: '04 Nov 2025 10:15:45'
            },
            {
                orderId: '12347',
                orderNumber: 'ORD-2025-00003',
                learnerName: 'Lê Văn C',
                sessionName: 'English Conversation',
                sessionType: '1 and 1',
                hourlyRate: 15,
                hours: 4,
                amount: 48,
                date: '03 Nov 2025 16:45:10'
            },
            {
                orderId: '12348',
                orderNumber: 'ORD-2025-00004',
                learnerName: 'Phạm Thị D',
                sessionName: 'Advanced Grammar',
                sessionType: '1 and n',
                hourlyRate: 10,
                hours: 2,
                amount: 16,
                date: '02 Nov 2025 09:20:30'
            },
            {
                orderId: '12349',
                orderNumber: 'ORD-2025-00005',
                learnerName: 'Võ Văn E',
                sessionName: 'Advanced Grammar',
                sessionType: '1 and 1',
                hourlyRate: 18,
                hours: 6,
                amount: 86.4,
                date: '01 Nov 2025 15:00:00'
            }
        ];

        const instructorGroups: { [key: string]: InstructorPayout } = {
            'ins1': {
                id: 'payout-1',
                instructorId: 'ins1',
                instructorName: 'Đặng Minh Tuấn',
                bankAccount: '0123456789',
                bankName: 'Vietcombank',
                accountHolderName: 'ĐẶNG MINH TUẤN',
                totalOwed: 136.8,
                orderCount: 3,
                orders: [rawPayouts[0], rawPayouts[1], rawPayouts[2]],
                createdDate: '05 Nov 2025',
                status: 'pending'
            },
            'ins2': {
                id: 'payout-2',
                instructorId: 'ins2',
                instructorName: 'Nguyễn Thị Hương',
                bankAccount: '9876543210',
                bankName: 'Techcombank',
                accountHolderName: 'NGUYỄN THỊ HƯƠNG',
                totalOwed: 102.4,
                orderCount: 2,
                orders: [rawPayouts[3], rawPayouts[4]],
                createdDate: '02 Nov 2025',
                status: 'pending'
            }
        };

        this.pendingPayouts = Object.values(instructorGroups);
        this.groupedPendingPayouts = Object.values(instructorGroups);
    }

    private loadPayoutHistory(): void {
        this.payoutHistory = [
            {
                id: 'payout-3',  // Dùng cùng ID format như pending payout
                batchNumber: 'PAYOUT-2025-10',
                instructorId: 'ins3',
                instructorName: 'Trần Quốc Bảo',
                paidAmount: 5000000,
                paidDate: '01 Oct 2025',
                approvedBy: 'Admin - Ngô Thanh',
                notes: 'Thanh toán hàng tháng - Tháng 9/2025',
                orderCount: 12,
                status: 'complete'
            },
            {
                id: 'payout-4',  // Dùng cùng ID format như pending payout
                batchNumber: 'PAYOUT-2025-09',
                instructorId: 'ins4',
                instructorName: 'Ngô Thanh Tâm',
                paidAmount: 4500000,
                paidDate: '01 Sep 2025',
                approvedBy: 'Admin - Ngô Thanh',
                notes: 'Thanh toán hàng tháng - Tháng 8/2025',
                orderCount: 10,
                status: 'complete'
            },
            {
                id: 'payout-5',  // Dùng cùng ID format như pending payout
                batchNumber: 'PAYOUT-2025-08',
                instructorId: 'ins5',
                instructorName: 'Vũ Hà Linh',
                paidAmount: 3800000,
                paidDate: '01 Aug 2025',
                approvedBy: 'Admin - Vũ Hà',
                notes: 'Thanh toán hàng tháng - Tháng 7/2025',
                orderCount: 8,
                status: 'complete'
            }
        ];
    }

    private updateSummary(): void {
        this.summary.totalPending = this.pendingPayouts.reduce((sum, p) => sum + p.totalOwed, 0);
        this.summary.totalInstructors = this.pendingPayouts.length;
        this.summary.totalOrders = this.pendingPayouts.reduce((sum, p) => sum + p.orderCount, 0);
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
        if (this.selectedPayouts.size === this.pendingPayouts.length) {
            this.selectedPayouts.clear();
        } else {
            this.pendingPayouts.forEach(p => this.selectedPayouts.add(p.id));
        }
    }

    isPayoutSelected(payoutId: string): boolean {
        return this.selectedPayouts.has(payoutId);
    }

    isAllSelected(): boolean {
        return this.pendingPayouts.length > 0 && this.selectedPayouts.size === this.pendingPayouts.length;
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

            this.updateSummary();
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

            this.updateSummary();

            alert(`✓ Xác nhận thanh toán thành công!\n\nGiảng viên: ${this.selectedPayout!.instructorName}\nSố tiền: ${this.formatCurrency(this.selectedPayout!.totalOwed)}\nNgày: ${historyRecord.paidDate}`);

            this.isConfirmPaymentOpen = false;
            this.isDetailModalOpen = false;
            this.selectedPayout = null;
            this.loadingPayment = false;
        }, 500);
    }

    generateQRCode(payout: InstructorPayout): void {
        if (!payout) return;

        try {

            const qrData = `${payout.bankName}|${payout.bankAccount}|${payout.accountHolderName}|${payout.totalOwed}`;

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
    }

    onFilterChange(): void {
        this.applyFiltersAndSearch();
    }

    onSearchChange(): void {
        this.applyFiltersAndSearch();
    }

    onDateChange(): void {
        this.applyFiltersAndSearch();
    }

    clearFilters(): void {
        this.filterStatus = 'all';
        this.searchQuery = '';
        this.fromDate = '';
        this.toDate = '';
        this.applyFiltersAndSearch();
    }

    exportToExcel(): void {
        const data = this.filteredPayoutHistory.map(h => ({
            'ID': h.id,
            'Batch Number': h.batchNumber,
            'Instructor Name': h.instructorName,
            'Amount': h.paidAmount,
            'Payment Date': h.paidDate,
            'Approved By': h.approvedBy,
            'Notes': h.notes,
            'Status': h.status
        }));

        const worksheet = this.arrayToSheet(data);
        const workbook = {
            Sheets: { 'Payment History': worksheet },
            SheetNames: ['Payment History']
        };

        const filename = `payment-history-${new Date().getTime()}.xlsx`;
        this.downloadExcel(workbook, filename);
    }

    private arrayToSheet(data: any[]): any {
        if (data.length === 0) return {};

        const headers = Object.keys(data[0]);
        const rows = data.map(row => headers.map(h => row[h]));

        const sheet: any = {};
        headers.forEach((h, i) => {
            sheet[String.fromCharCode(65 + i) + '1'] = { t: 's', v: h };
        });

        rows.forEach((row, i) => {
            row.forEach((cell, j) => {
                const key = String.fromCharCode(65 + j) + (i + 2);
                sheet[key] = { t: typeof cell === 'number' ? 'n' : 's', v: cell };
            });
        });

        sheet['!ref'] = `A1:${String.fromCharCode(65 + headers.length - 1)}${rows.length + 1}`;
        return sheet;
    }

    private downloadExcel(workbook: any, filename: string): void {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js';
        script.onload = () => {
            const XLSX = (window as any).XLSX;
            XLSX.writeFile(workbook, filename);
        };
        document.head.appendChild(script);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.modal')) {

        }
    }
}
