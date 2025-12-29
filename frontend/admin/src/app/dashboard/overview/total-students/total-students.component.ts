import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TotalStudentsService, NewStudentsData } from './total-students.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-total-students',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './total-students.component.html',
  styleUrl: './total-students.component.scss'
})
export class TotalStudentsComponent implements OnInit, OnDestroy {
  totalNewStudents = 0;
  growthPercentage = 0;
  private subscription?: Subscription;

  constructor(
    private totalStudentsService: TotalStudentsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private loadData(): void {
    this.subscription = this.totalStudentsService.getNewStudentsData().subscribe({
      next: (data: NewStudentsData) => {
        this.totalNewStudents = data.totalNewStudents;
        this.growthPercentage = data.growthPercentage;
        this.totalStudentsService.loadChart(data);
      },
      error: (error) => {
        console.error('Error loading new students data:', error);
      }
    });
  }
}
