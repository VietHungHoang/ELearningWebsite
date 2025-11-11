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
    courseName: string;
    amount: number;
    commission: number;
    date: string;
}

export interface PayoutHistory {
    id: string;
    batchNumber: string;
    instructorId: string;
    instructorName: string;
    paidAmount: number;
    paidDate: string;
    approvedBy: string;
    notes: string;
    orderCount: number;
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

    summary = {
        totalPending: 0,
        totalInstructors: 0,
        totalOrders: 0
    };

    isDetailModalOpen = false;
    isConfirmPaymentOpen = false;
    isQRModalOpen = false;
    selectedPayout: InstructorPayout | null = null;
    paymentNotes: string = '';
    loadingPayment = false;
    qrCodeDataUrl: string = '';

    constructor() {}

    ngOnInit(): void {
        this.loadPayoutData();
        this.loadPayoutHistory();
        this.updateSummary();
    }

    switchTab(tab: 'pending' | 'history'): void {
        this.activeTab = tab;
    }

    private loadPayoutData(): void {

        const rawPayouts: PayoutOrder[] = [
            {
                orderId: '12345',
                orderNumber: 'ORD-2025-00001',
                learnerName: 'Nguyễn Văn A',
                courseName: 'React Advanced',
                amount: 1000000,
                commission: 300000,
                date: '05 Nov 2025'
            },
            {
                orderId: '12346',
                orderNumber: 'ORD-2025-00002',
                learnerName: 'Trần Thị B',
                courseName: 'Vue.js Mastery',
                amount: 800000,
                commission: 240000,
                date: '04 Nov 2025'
            },
            {
                orderId: '12347',
                orderNumber: 'ORD-2025-00003',
                learnerName: 'Lê Văn C',
                courseName: 'React Advanced',
                amount: 1200000,
                commission: 360000,
                date: '03 Nov 2025'
            },
            {
                orderId: '12348',
                orderNumber: 'ORD-2025-00004',
                learnerName: 'Phạm Thị D',
                courseName: 'Node.js Backend',
                amount: 900000,
                commission: 270000,
                date: '02 Nov 2025'
            },
            {
                orderId: '12349',
                orderNumber: 'ORD-2025-00005',
                learnerName: 'Võ Văn E',
                courseName: 'Node.js Backend',
                amount: 1100000,
                commission: 330000,
                date: '01 Nov 2025'
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
                totalOwed: 900000, 
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
                totalOwed: 600000, 
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
                id: 'hist-1',
                batchNumber: 'PAYOUT-2025-10',
                instructorId: 'ins3',
                instructorName: 'Trần Quốc Bảo',
                paidAmount: 5000000,
                paidDate: '01 Oct 2025',
                approvedBy: 'Admin - Ngô Thanh',
                notes: 'Thanh toán hàng tháng - Tháng 9/2025',
                orderCount: 12
            },
            {
                id: 'hist-2',
                batchNumber: 'PAYOUT-2025-09',
                instructorId: 'ins1',
                instructorName: 'Đặng Minh Tuấn',
                paidAmount: 4500000,
                paidDate: '01 Sep 2025',
                approvedBy: 'Admin - Ngô Thanh',
                notes: 'Thanh toán hàng tháng - Tháng 8/2025',
                orderCount: 10
            },
            {
                id: 'hist-3',
                batchNumber: 'PAYOUT-2025-08',
                instructorId: 'ins2',
                instructorName: 'Nguyễn Thị Hương',
                paidAmount: 3800000,
                paidDate: '01 Aug 2025',
                approvedBy: 'Admin - Vũ Hà',
                notes: 'Thanh toán hàng tháng - Tháng 7/2025',
                orderCount: 8
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

    markAsPaid(): void {
        if (!this.selectedPayout) return;

        this.loadingPayment = true;

        setTimeout(() => {

            const historyRecord: PayoutHistory = {
                id: `hist-${Date.now()}`,
                batchNumber: `PAYOUT-${new Date().getFullYear()}-${this.getMonthNumber()}`,
                instructorId: this.selectedPayout!.instructorId,
                instructorName: this.selectedPayout!.instructorName,
                paidAmount: this.selectedPayout!.totalOwed,
                paidDate: this.getCurrentDate(),
                approvedBy: 'Admin - Current User',
                notes: this.paymentNotes,
                orderCount: this.selectedPayout!.orderCount
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

    private getCurrentDate(): string {
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

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.modal')) {

        }
    }
}
