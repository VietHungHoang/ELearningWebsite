import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-f-transactions-detail',
    imports: [RouterLink, CommonModule],
    templateUrl: './f-transactions-detail.component.html',
    styleUrl: './f-transactions-detail.component.scss'
})
export class FTransactionsDetailComponent implements OnInit {
    transactionId: string | null = null;
    learnerId: string | null = 'LRN-2025-00145';
    classId: string | null = 'CLS-2025-00089';

    // Learner Information
    learnerName: string = 'Shannon Nelson';
    learnerEmail: string = 'shannon.nelson@example.com';
    learnerPhone: string = '+1 444 556 8899';

    // Class Information
    className: string = 'English Conversation Advanced';
    classType: string = '1-on-1';
    instructorName: string = 'David Smith';

    // Payment Information
    totalAmount: number = 75;
    paymentTime: string = '01 Dec 2025, 14:30:25';
    paymentMethod: string = 'VNPay';
    paymentStatus: string = 'Completed';

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.transactionId = params['id'] || '#PAY-2025-12-001';
            this.learnerId = params['learnerId'] || this.learnerId;
            this.classId = params['classId'] || this.classId;
        });
    }
}
