import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TotalMentorsComponent } from './total-mentors/total-mentors.component';
import { StudentsInterestedTopicsComponent } from './students-interested-topics/students-interested-topics.component';
import { TopInstructorsComponent } from './top-instructors/top-instructors.component';
import { GroupLessonsComponent } from './group-lessons/group-lessons.component';
import { TotalCoursesComponent } from './total-courses/total-courses.component';
import { TotalSalesComponent } from './total-sales/total-sales.component';
import { OnlineClassesComponent } from "./online-classes/online-classes.component";
import { TotalStudentsComponent } from "./total-students/total-students.component";
import { DashboardService } from '../../services/dashboard.service';
import { DashboardSummary, TopInstructor, RecentBooking, PopularSubject } from '../../types/dashboard';
@Component({
    selector: 'app-overview',
    imports: [TotalCoursesComponent, TotalSalesComponent, TotalMentorsComponent, StudentsInterestedTopicsComponent, TopInstructorsComponent, GroupLessonsComponent, OnlineClassesComponent, TotalStudentsComponent],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, OnDestroy {
    // Dashboard data properties
    dashboardSummary?: DashboardSummary;
    topInstructors: TopInstructor[] = [];
    recentBookings: RecentBooking[] = [];
    popularSubjects: PopularSubject[] = [];

    private subscriptions: Subscription[] = [];

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.loadDashboardData();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private loadDashboardData(): void {
        // Load dashboard summary
        const summarySub = this.dashboardService.getDashboardSummary().subscribe(summary => {
            this.dashboardSummary = summary;
        });
        this.subscriptions.push(summarySub);

        // Load top instructors
        const instructorsSub = this.dashboardService.getTopInstructorsFull('revenue', 'month', 10).subscribe(instructors => {
            this.topInstructors = instructors;
        });
        this.subscriptions.push(instructorsSub);

        // Load recent bookings
        const bookingsSub = this.dashboardService.getRecentBookingsFull(5).subscribe(bookings => {
            this.recentBookings = bookings;
        });
        this.subscriptions.push(bookingsSub);

        // Load popular subjects
        const subjectsSub = this.dashboardService.getPopularSubjects('month').subscribe(subjects => {
            this.popularSubjects = subjects;
        });
        this.subscriptions.push(subjectsSub);
    }
}
