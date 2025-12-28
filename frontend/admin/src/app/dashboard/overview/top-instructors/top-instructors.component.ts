import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TopInstructor, RankingCriteria, TimePeriod } from '../../../types/dashboard';
import { DashboardService } from '../../../services/dashboard.service';
import { I18nService } from '../../../i18n/i18n.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
    selector: 'app-top-instructors',
    imports: [CommonModule, TranslatePipe],
    templateUrl: './top-instructors.component.html',
    styleUrl: './top-instructors.component.scss'
})
export class TopInstructorsComponent implements OnInit, OnDestroy {
    @Input() instructors?: TopInstructor[];

    isCardHeaderOpen = false;
    isTimePeriodOpen = false;
    rankingCriteria: RankingCriteria = 'revenue';
    rankingLabelKey = 'dashboard.overview.topInstructors.rankingCriteria.revenue';
    timePeriod: TimePeriod = 'month';
    timePeriodLabelKey = 'dashboard.overview.topInstructors.timePeriod.thisMonth';

    // Pagination properties
    currentPage = 1;
    itemsPerPage = 5;
    totalItems = 0;

    instructorsData: TopInstructor[] = [];
    private subscriptions: Subscription[] = [];

    constructor(
        private dashboardService: DashboardService,
        private i18nService: I18nService
    ) {}

    ngOnInit(): void {
        // If instructors provided via Input, use them
        if (this.instructors && this.instructors.length > 0) {
            this.instructorsData = this.instructors;
            this.totalItems = this.instructorsData.length;
        } else {
            // Otherwise, load from service
            this.loadInstructors();
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private loadInstructors() {
        const sub = this.dashboardService.getTopInstructorsFull(
            this.rankingCriteria,
            this.timePeriod,
            10
        ).subscribe(instructors => {
            this.instructorsData = instructors;
            this.totalItems = instructors.length;
            this.sortAndRankInstructors();
        });
        this.subscriptions.push(sub);
    }

    sortAndRankInstructors(): void {
        let sorted = [...this.instructorsData];

        switch (this.rankingCriteria) {
            case 'revenue':
                sorted.sort((a, b) => b.revenue - a.revenue);
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'bookings':
                sorted.sort((a, b) => b.totalBookings - a.totalBookings);
                break;
        }

        sorted.forEach((instructor, index) => {
            (instructor as any).rank = index + 1;
        });

        this.instructorsData = sorted;
    }

    changeRankingCriteria(criteria: RankingCriteria, labelKey: string): void {
        this.rankingCriteria = criteria;
        this.rankingLabelKey = labelKey;
        this.loadInstructors(); // Reload data with new criteria
        this.currentPage = 1;
        this.isCardHeaderOpen = false;
    }

    toggleTimePeriodMenu(): void {
        this.isTimePeriodOpen = !this.isTimePeriodOpen;
        if (this.isTimePeriodOpen) {
            this.isCardHeaderOpen = false;
        }
    }

    changeTimePeriod(period: TimePeriod, labelKey: string): void {
        this.timePeriod = period;
        this.timePeriodLabelKey = labelKey;
        this.isTimePeriodOpen = false;
        this.loadInstructors(); // Reload data with new time period
    }

    get paginatedInstructors(): TopInstructor[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.instructorsData.slice(startIndex, endIndex);
    }

    get totalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    get startItem(): number {
        return (this.currentPage - 1) * this.itemsPerPage + 1;
    }

    get endItem(): number {
        const end = this.currentPage * this.itemsPerPage;
        return end > this.totalItems ? this.totalItems : end;
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    toggleCardHeaderMenu() {
        this.isCardHeaderOpen = !this.isCardHeaderOpen;
        if (this.isCardHeaderOpen) {
            this.isTimePeriodOpen = false;
        }
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.trezo-card-dropdown')) {
            this.isCardHeaderOpen = false;
            this.isTimePeriodOpen = false;
        }
    }

    formatRevenue(amount: number | undefined): string {
        if (amount === undefined || amount === null) {
            return '-';
        }
        if (amount >= 1000000000) {
            return (amount / 1000000000).toFixed(1) + 'B';
        } else if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(1) + 'K';
        }
        return amount.toString();
    }

    formatNumber(num: number | undefined): string {
        if (num === undefined || num === null) {
            return '-';
        }
        return new Intl.NumberFormat('en-US').format(num);
    }

}
