import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudentsInterestedTopicsService, PopularSubjectsData } from './students-interested-topics.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
    selector: 'app-students-interested-topics',
    imports: [TranslatePipe],
    templateUrl: './students-interested-topics.component.html',
    styleUrl: './students-interested-topics.component.scss'
})
export class StudentsInterestedTopicsComponent implements OnInit, OnDestroy, AfterViewInit {

    instanceId: string;
    private initialized = false;
    private chartLoaded = false;
    private subscription?: Subscription;

    subjectsData: PopularSubjectsData['subjects'] = [];

    constructor(
        private studentsInterestedTopicsService: StudentsInterestedTopicsService
    ) {
        this.instanceId = 'students-interested-' + Math.random().toString(36).substr(2, 9);
    }

    ngOnInit(): void {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
    }

    ngAfterViewInit(): void {
        // Load data after view is initialized
        setTimeout(() => this.loadData(), 100);
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
        this.studentsInterestedTopicsService.destroyChart();
    }

    private loadData(): void {
        this.subscription = this.studentsInterestedTopicsService.getPopularSubjectsData().subscribe({
            next: (data: PopularSubjectsData) => {
                this.subjectsData = data.subjects;
                this.loadChartData();
            },
            error: (error) => {
                console.error('Error loading popular subjects data:', error);
            }
        });
    }

    private loadChartData(): void {
        // Transform subjects data to chart format
        const series = [{ name: 'học viên', data: this.subjectsData.map(s => s.studentCount) }];
        const categories = this.subjectsData.map(s => s.name);

        // Use the chart service to render/update chart
        if (!this.chartLoaded) {
            this.studentsInterestedTopicsService.loadChart(series, categories);
            this.chartLoaded = true;
        } else {
            this.studentsInterestedTopicsService.updateChart(series, categories);
        }
    }
}
