import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TotalCoursesService } from './total-courses.service';
import { DashboardService } from '../../../services/dashboard.service';
import { PendingApprovalsData } from '../../../types/dashboard';

@Component({
    selector: 'app-total-courses',
    imports: [],
    templateUrl: './total-courses.component.html',
    styleUrl: './total-courses.component.scss'
})
export class TotalCoursesComponent implements OnInit, OnDestroy {
    @Input() pendingApprovals?: PendingApprovalsData;

    pendingCount = 0;
    approvedCount = 0;
    rejectedCount = 0;
    totalCount = 0;

    pendingPercentage = 0;
    approvedPercentage = 0;
    rejectedPercentage = 0;

    private subscriptions: Subscription[] = [];

    constructor(
        private totalCoursesService: TotalCoursesService,
        private dashboardService: DashboardService
    ) {}    ngOnInit(): void {
        console.log('TotalCoursesComponent ngOnInit called');
        // If data is provided via Input, use it
        if (this.pendingApprovals) {
            this.updateFromData(this.pendingApprovals);
        } else {
            // Otherwise, load from service (fallback for backward compatibility)
            this.loadFromService();
        }

        // Load chart
        setTimeout(() => {
            this.totalCoursesService.loadChart();
        }, 100);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private updateFromData(data: PendingApprovalsData) {
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

    private loadFromService() {
        // Fallback: load from dashboard service
        const sub = this.dashboardService.dashboardSummary.subscribe(summary => {
            if (summary?.pendingApprovals) {
                this.updateFromData(summary.pendingApprovals);
            }
        });
        this.subscriptions.push(sub);
    }

}
