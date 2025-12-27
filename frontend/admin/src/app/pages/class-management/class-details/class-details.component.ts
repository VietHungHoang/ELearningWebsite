import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { ClassService, GroupClass, StudentEnrollment, ClassFinancialReport } from '../../../services/class.service';

@Component({
  selector: 'app-class-details',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './class-details.component.html',
  styleUrl: './class-details.component.scss'
})
export class ClassDetailsComponent implements OnInit {
  groupClass: GroupClass | null = null;
  enrollments: StudentEnrollment[] = [];
  financialReport: ClassFinancialReport | null = null;
  loading = true;
  error: string | null = null;
  weekDays: any[] = [];
  currentWeekStart: Date = new Date();

  constructor(
    private classService: ClassService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const classId = params['id'];
      if (classId) {
        this.loadClassDetails(classId);
      }
    });
  }

  loadClassDetails(classId: string): void {
    this.loading = true;
    this.error = null;

    this.classService.getClassById(classId).subscribe({
      next: (groupClass) => {
        if (groupClass) {
          this.groupClass = groupClass;
          this.loadEnrollments(classId);
          this.loadFinancialReport(classId);
        } else {
          this.error = 'classManagement.classDetails.error.notFound';
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'classManagement.classDetails.error.loadingError';
        this.loading = false;
      }
    });
  }

  loadEnrollments(classId: string): void {
    this.classService.getClassEnrollments(classId).subscribe(enrollments => {
      this.enrollments = enrollments;
    });
  }

  loadFinancialReport(classId: string): void {
    this.classService.calculateFinancialReport(classId).subscribe(report => {
      this.financialReport = report;
      if (this.groupClass) {
        const classDate = new Date(this.groupClass.start_datetime);
        this.currentWeekStart = this.getMonday(classDate);
      }
      this.generateWeeklySchedule();
      this.loading = false;
    });
  }

  private generateWeeklySchedule(): void {
    if (!this.groupClass) return;

    const classDate = new Date(this.groupClass.start_datetime);
    const weekStart = this.currentWeekStart;
    const classDay = classDate.getDay();
    const classTime = new Date(this.groupClass.start_datetime);

    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);

      const dayName = this.formatDayName(day.getDay());
      const dateStr = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(day);

      // Check if this day matches the class day and is in the same week
      const isSameDayOfWeek = day.getDay() === classDay;
      const isSameWeek = this.isSameWeek(day, classDate);
      const hasClass = isSameDayOfWeek && isSameWeek;
      
      const time = hasClass ? new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(classTime) : '';

      this.weekDays.push({
        dayIndex: i,
        dayName: dayName,
        date: dateStr,
        hasClass: hasClass,
        time: time
      });
    }
  }

  private isSameWeek(date1: Date, date2: Date): boolean {
    const monday1 = this.getMonday(date1);
    const monday2 = this.getMonday(date2);
    return monday1.getTime() === monday2.getTime();
  }

  previousWeek(): void {
    const newWeek = new Date(this.currentWeekStart);
    newWeek.setDate(newWeek.getDate() - 7);
    this.currentWeekStart = newWeek;
    this.generateWeeklySchedule();
  }

  nextWeek(): void {
    const newWeek = new Date(this.currentWeekStart);
    newWeek.setDate(newWeek.getDate() + 7);
    this.currentWeekStart = newWeek;
    this.generateWeeklySchedule();
  }

  getCurrentWeekRange(): string {
    const weekEnd = new Date(this.currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const startStr = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(this.currentWeekStart);
    
    const endStr = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(weekEnd);
    
    return `${startStr} - ${endStr}`;
  }

  private getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  private formatDayName(dayIndex: number): string {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[dayIndex];
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'upcoming': 'classManagement.status.upcoming',
      'ongoing': 'classManagement.status.ongoing',
      'completed': 'classManagement.status.completed'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'upcoming': 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      'ongoing': 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      'completed': 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300'
    };
    return statusClasses[status] || '';
  }

  formatCurrency(amount: number): string {
    return this.classService.formatCurrency(amount);
  }

  formatDateTime(date: Date): string {
    return this.classService.formatDateTime(date);
  }

  formatDuration(minutes: number): string {
    return this.classService.formatDuration(minutes);
  }

  formatDateOnly(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(date));
  }

  getEnrollmentPercentage(): number {
    if (!this.groupClass) return 0;
    return Math.round((this.groupClass.enrollment_count / this.groupClass.max_capacity) * 100);
  }
}
