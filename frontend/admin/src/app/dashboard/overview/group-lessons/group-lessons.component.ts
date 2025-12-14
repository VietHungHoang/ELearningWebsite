import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RecentBooking } from '../../../types/dashboard';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
    selector: 'app-group-lessons',
    imports: [RouterLink, CommonModule],
    templateUrl: './group-lessons.component.html',
    styleUrl: './group-lessons.component.scss'
})
export class GroupLessonsComponent implements OnInit, OnDestroy {
    @Input() recentBookings?: RecentBooking[];

    isCardHeaderOpen = false;
    itemsPerPage = 3;

    bookingsData: RecentBooking[] = [];
    private subscriptions: Subscription[] = [];

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        // If recentBookings provided via Input, use them
        if (this.recentBookings && this.recentBookings.length > 0) {
            this.bookingsData = this.recentBookings;
        } else {
            // Otherwise, load from service
            this.loadRecentBookings();
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private loadRecentBookings() {
        const sub = this.dashboardService.getRecentBookingsFull(5).subscribe(bookings => {
            this.bookingsData = bookings;
        });
        this.subscriptions.push(sub);
    }

    toggleCardHeaderMenu() {
        this.isCardHeaderOpen = !this.isCardHeaderOpen;
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.trezo-card-dropdown')) {
            this.isCardHeaderOpen = false;
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Upcoming':
                return 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
            case 'Completed':
                return 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
        }
    }

}
