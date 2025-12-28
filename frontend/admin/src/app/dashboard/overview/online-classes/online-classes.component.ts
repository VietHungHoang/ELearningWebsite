import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OnlineClassesService, CompletedSessionsData } from './online-classes.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-online-classes',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './online-classes.component.html',
  styleUrl: './online-classes.component.scss'
})
export class OnlineClassesComponent implements OnInit, OnDestroy {
  totalSessions = 0;
  growthPercentage = 0;
  private subscription?: Subscription;

  constructor(
    private onlineClassesService: OnlineClassesService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private loadData(): void {
    this.subscription = this.onlineClassesService.getCompletedSessionsData().subscribe({
      next: (data: CompletedSessionsData) => {
        this.totalSessions = data.totalSessions;
        this.growthPercentage = data.growthPercentage;
        this.onlineClassesService.loadChart(data);
      },
      error: (error) => {
        console.error('Error loading completed sessions data:', error);
      }
    });
  }
}
