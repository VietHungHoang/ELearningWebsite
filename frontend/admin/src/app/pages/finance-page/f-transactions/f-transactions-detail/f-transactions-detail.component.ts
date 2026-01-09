import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../i18n/translate.pipe';
import { TransactionService, TransactionDetailResponse } from '../../../../services/transaction.service';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { LoadingComponent } from '../../../../components/loading/loading.component';

@Component({
    selector: 'app-f-transactions-detail',
    imports: [RouterLink, CommonModule, TranslatePipe, CurrencyFormatPipe, LoadingComponent],
    templateUrl: './f-transactions-detail.component.html',
    styleUrl: './f-transactions-detail.component.scss'
})
export class FTransactionsDetailComponent implements OnInit {
    transactionId: string | null = null;
    studentId: string | null = null;
    classId: string | null = null;

    // Tutor Information
    tutorId: string | null = null;
    tutorName: string = '';

    // Class Information
    className: string = '';
    classType: string = '';

    // Payment Information
    totalAmount: number = 0;
    paymentTime: string = '';
    paymentMethod: string = '';
    paymentStatus: string = '';
    providerTransactionId: string = '';
    sessionsPurchased: number = 0;
    pricePerSession: number = 0;
    discount: number = 0;
    schedule: string = '';

    // UI state
    loading: boolean = true;
    error: string | null = null;
    downloading: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private transactionService: TransactionService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.loadTransactionDetail(id);
            } else {
                this.error = 'Transaction ID not found';
                this.loading = false;
            }
        });
    }

    loadTransactionDetail(id: string): void {
        this.loading = true;
        this.error = null;

        this.transactionService.getTransactionById(id).subscribe({
            next: (response: TransactionDetailResponse) => {
                this.mapResponseToFields(response);
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading transaction detail:', err);
                this.error = 'Failed to load transaction detail';
                this.loading = false;
            }
        });
    }

    mapResponseToFields(response: TransactionDetailResponse): void {
        this.transactionId = response.id;
        this.studentId = response.studentId;
        this.tutorId = response.tutorId;
        this.tutorName = response.tutorName || 'Unknown Tutor';
        this.classId = response.classId || null;
        this.className = response.className || 'Unknown Class';
        this.classType = response.classType || '1-on-1';
        this.totalAmount = response.amount || 0;
        this.providerTransactionId = response.providerTransactionId || '';
        this.sessionsPurchased = response.sessionsPurchased || 0;
        this.pricePerSession = response.pricePerSession || 0;
        this.discount = response.discount || 0;
        this.schedule = response.schedule || '';

        // Map payment provider to display value
        const providerMap: { [key: string]: string } = {
            'MOMO': 'momo',
            'VNPAY': 'vnpay',
            'SEPAY': 'sepay'
        };
        this.paymentMethod = providerMap[response.paymentProvider || ''] || 'vnpay';

        // Map status to display value
        const statusMap: { [key: string]: string } = {
            'PENDING': 'pending',
            'CONFIRMED': 'completed',
            'FAILED': 'failed',
            'CANCELLED': 'failed'
        };
        this.paymentStatus = statusMap[response.status] || 'pending';

        // Format payment time
        if (response.createdAt) {
            const date = new Date(response.createdAt);
            this.paymentTime = date.toLocaleString('vi-VN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }

    downloadPdf(): void {
        if (!this.transactionId || this.downloading) {
            return;
        }

        this.downloading = true;

        this.transactionService.downloadTransactionPdf(this.transactionId).subscribe({
            next: (blob: Blob) => {
                // Create a download link and trigger download
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `transaction-${this.transactionId}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
                this.downloading = false;
            },
            error: (err) => {
                console.error('Error downloading PDF:', err);
                this.error = 'Failed to download PDF';
                this.downloading = false;
            }
        });
    }

    getClassTypeTranslationKey(): string {
        if (this.classType === '1-on-1' || this.classType === 'ONE_ON_ONE') {
            return 'transactions.detail.classInformation.classType.oneOnOne';
        } else if (this.classType === '1 and n' || this.classType === 'Group' || this.classType === 'GROUP') {
            return 'transactions.detail.classInformation.classType.group';
        }
        return 'transactions.detail.classInformation.classType.oneOnOne';
    }

    getPaymentMethodTranslationKey(): string {
        const method = this.paymentMethod.toLowerCase();
        if (method === 'vnpay') {
            return 'transactions.paymentMethod.vnpay';
        } else if (method === 'momo') {
            return 'transactions.paymentMethod.momo';
        } else if (method === 'sepay') {
            return 'transactions.paymentMethod.sepay';
        }
        return this.paymentMethod;
    }

    getPaymentStatusTranslationKey(): string {
        const status = this.paymentStatus.toLowerCase();
        if (status === 'completed') {
            return 'transactions.status.completed';
        } else if (status === 'failed') {
            return 'transactions.status.failed';
        } else if (status === 'pending') {
            return 'transactions.status.pending';
        }
        return this.paymentStatus;
    }

    getStatusClass(): string {
        const status = this.paymentStatus.toLowerCase();
        if (status === 'completed') {
            return 'bg-success-50 text-success-600';
        } else if (status === 'failed') {
            return 'bg-danger-50 text-danger-600';
        } else if (status === 'pending') {
            return 'bg-warning-50 text-warning-600';
        }
        return 'bg-gray-50 text-gray-600';
    }
}
