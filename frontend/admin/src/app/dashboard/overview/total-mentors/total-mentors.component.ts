import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TotalMentorsService, NewTutorsData } from './total-mentors.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
    selector: 'app-total-mentors',
    imports: [TranslatePipe],
    templateUrl: './total-mentors.component.html',
    styleUrl: './total-mentors.component.scss'
})
export class TotalMentorsComponent implements OnInit, OnDestroy {
    totalNewTutors = 0;
    growthPercentage = 0;
    private subscription?: Subscription;

    constructor(
        private totalMentorsService: TotalMentorsService
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    private loadData(): void {
        this.subscription = this.totalMentorsService.getNewTutorsData().subscribe({
            next: (data: NewTutorsData) => {
                this.totalNewTutors = data.totalNewTutors;
                this.growthPercentage = data.growthPercentage || 42;
                this.totalMentorsService.loadChart(data);
            },
            error: (error) => {
                console.error('Error loading new tutors data:', error);
            }
        });
    }
}
