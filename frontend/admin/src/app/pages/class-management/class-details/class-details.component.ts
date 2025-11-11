import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClassService, GroupClass, StudentEnrollment, ClassFinancialReport } from '../../../services/class.service';

@Component({
  selector: 'app-class-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './class-details.component.html',
  styleUrl: './class-details.component.scss'
})
export class ClassDetailsComponent implements OnInit {
  groupClass: GroupClass | null = null;
  enrollments: StudentEnrollment[] = [];
  financialReport: ClassFinancialReport | null = null;
  loading = true;
  error: string | null = null;

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
          this.error = 'Class not found';
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'Error loading class details';
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
      this.loading = false;
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'upcoming': 'Upcoming',
      'ongoing': 'Ongoing',
      'completed': 'Completed'
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
