import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../i18n/translate.pipe';

@Component({
    selector: 'app-f-transactions-detail',
    imports: [RouterLink, CommonModule, TranslatePipe],
    templateUrl: './f-transactions-detail.component.html',
    styleUrl: './f-transactions-detail.component.scss'
})
export class FTransactionsDetailComponent implements OnInit {
    transactionId: string | null = null;
    studentId: string | null = 'STU-2025-00145';
    classId: string | null = 'CLS-2025-00089';

    // Student Information
    studentName: string = 'Shannon Nelson';
    studentEmail: string = 'shannon.nelson@example.com';
    studentPhone: string = '+1 444 556 8899';

    // Class Information
    className: string = 'English Conversation Advanced';
    classType: string = '1-on-1';
    tutorName: string = 'David Smith';

    // Payment Information
    totalAmount: number = 75;
    paymentTime: string = '01 Dec 2025, 14:30:25';
    paymentMethod: string = 'VNPay';
    paymentStatus: string = 'Completed';

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.transactionId = params['id'] || '#PAY-2025-12-001';
            this.studentId = params['studentId'] || this.studentId;
            this.classId = params['classId'] || this.classId;
        });
    }

    getClassTypeTranslationKey(): string {
        if (this.classType === '1-on-1') {
            return 'transactions.detail.classInformation.classType.oneOnOne';
        } else if (this.classType === '1 and n' || this.classType === 'Group') {
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
        } else if (method === 'banking') {
            return 'transactions.paymentMethod.banking';
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
}
