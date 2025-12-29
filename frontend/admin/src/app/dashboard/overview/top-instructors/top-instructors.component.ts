import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TopInstructorsService, TopInstructorItem, TopInstructorsData } from './top-instructors.service';
import { I18nService } from '../../../i18n/i18n.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

/** Ranking criteria type */
type RankingCriteria = 'revenue' | 'rating' | 'bookings';

/** Time period type */
type TimePeriod = 'week' | 'month' | 'year' | 'all';

@Component({
    selector: 'app-top-instructors',
    imports: [CommonModule, TranslatePipe],
    templateUrl: './top-instructors.component.html',
    styleUrl: './top-instructors.component.scss'
})
export class TopInstructorsComponent implements OnInit, OnDestroy {

    isTimePeriodOpen = false;
    rankingCriteria: RankingCriteria = 'revenue'; // Fixed to revenue, no dropdown
    timePeriod: TimePeriod = 'month';
    timePeriodLabelKey = 'dashboard.overview.topInstructors.timePeriod.thisMonth';

    instructorsData: TopInstructorItem[] = [];
    private subscription?: Subscription;

    constructor(
        private topInstructorsService: TopInstructorsService,
        private i18nService: I18nService
    ) {}

    ngOnInit(): void {
        this.loadInstructors();
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    private loadInstructors() {
        this.subscription = this.topInstructorsService.getTopInstructorsData(
            this.rankingCriteria,
            this.timePeriod,
            5
        ).subscribe({
            next: (data: TopInstructorsData) => {
                this.instructorsData = data.instructors;
            },
            error: (error) => {
                console.error('Error loading top instructors data:', error);
            }
        });
    }

    toggleTimePeriodMenu(): void {
        this.isTimePeriodOpen = !this.isTimePeriodOpen;
    }

    changeTimePeriod(period: TimePeriod, labelKey: string): void {
        this.timePeriod = period;
        this.timePeriodLabelKey = labelKey;
        this.isTimePeriodOpen = false;
        this.loadInstructors();
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.trezo-card-dropdown')) {
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
