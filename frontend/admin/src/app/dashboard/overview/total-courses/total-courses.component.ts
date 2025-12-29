import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TotalCoursesService, TutorPendingApprovalsData } from './total-courses.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
    selector: 'app-total-courses',
    imports: [TranslatePipe],
    templateUrl: './total-courses.component.html',
    styleUrl: './total-courses.component.scss'
})
export class TotalCoursesComponent implements OnInit, OnDestroy {
    pendingCount = 0;
    approvedCount = 0;
    rejectedCount = 0;
    totalCount = 0;

    pendingPercentage = 0;
    approvedPercentage = 0;
    rejectedPercentage = 0;

    private subscriptions: Subscription[] = [];

    constructor(
        private totalCoursesService: TotalCoursesService
    ) {}

    ngOnInit(): void {
        this.loadData();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private loadData(): void {
        const sub = this.totalCoursesService.getTutorPendingApprovalsData().subscribe({
            next: (data: TutorPendingApprovalsData) => {
                this.updateFromData(data);
                setTimeout(() => {
                    this.totalCoursesService.loadChart(data);
                }, 100);
            },
            error: (error) => {
                console.error('Error loading tutor pending approvals data:', error);
            }
        });
        this.subscriptions.push(sub);
    }

    private updateFromData(data: TutorPendingApprovalsData) {
        this.pendingCount = data.pending;
        this.approvedCount = data.approved;
        this.rejectedCount = data.rejected;
        this.totalCount = data.total;

        if (this.totalCount > 0) {
            this.pendingPercentage = data.percentage;
            this.approvedPercentage = Math.round((this.approvedCount / this.totalCount) * 100);
            this.rejectedPercentage = Math.round((this.rejectedCount / this.totalCount) * 100);
        }
    }
}
