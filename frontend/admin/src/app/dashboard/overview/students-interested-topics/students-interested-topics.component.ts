import { Component, HostListener, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopularSubject, TimePeriod } from '../../../types/dashboard';
import { DashboardService } from '../../../services/dashboard.service';
import { StudentsInterestedTopicsService } from './students-interested-topics.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
    selector: 'app-students-interested-topics',
    imports: [TranslatePipe],
    templateUrl: './students-interested-topics.component.html',
    styleUrl: './students-interested-topics.component.scss'
})
export class StudentsInterestedTopicsComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() popularSubjects?: PopularSubject[];

    selectedTimeframe: TimePeriod = 'month';
    instanceId: string;
    private initialized = false;
    private chartLoaded = false;
    private subscriptions: Subscription[] = [];

    subjectsData: PopularSubject[] = [];

    constructor(
        private dashboardService: DashboardService,
        private studentsInterestedTopicsService: StudentsInterestedTopicsService
    ) {
        this.instanceId = 'students-interested-' + Math.random().toString(36).substr(2, 9);
    }

    ngOnInit(): void {
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        // If popularSubjects provided via Input, use them
        if (this.popularSubjects && this.popularSubjects.length > 0) {
            this.subjectsData = this.popularSubjects;
        } else {
            // Otherwise, load from service
            this.loadPopularSubjects();
        }
    }

    ngAfterViewInit(): void {
        // Load chart after view is initialized
        if (this.subjectsData.length > 0) {
            this.loadChartData();
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private loadPopularSubjects() {
        const sub = this.dashboardService.getPopularSubjects(this.selectedTimeframe).subscribe(subjects => {
            this.subjectsData = subjects;
            // Load chart after data is loaded
            setTimeout(() => this.loadChartData(), 100);
        });
        this.subscriptions.push(sub);
    }

    private loadChartData() {
        // Transform subjects data to chart format
        const series = [{ name: 'Students', data: this.subjectsData.map(s => s.studentCount || s.instructors) }];
        const categories = this.subjectsData.map(s => s.subject);

        // Use the chart service to render/update chart
        // Always load chart first time, then update for subsequent calls
        if (!this.chartLoaded) {
            this.studentsInterestedTopicsService.loadChart(series, categories);
            this.chartLoaded = true;
        } else {
            this.studentsInterestedTopicsService.updateChart(series, categories);
        }
    }

    onTimeframeChange(timeframe: TimePeriod): void {
        this.selectedTimeframe = timeframe;
        this.loadPopularSubjects();
    }

    isCardHeaderOpen = false;
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

}
