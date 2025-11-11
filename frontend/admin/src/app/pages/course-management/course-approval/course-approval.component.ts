import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, Course } from '../../../services/course.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-course-approval',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, ConfirmDialogComponent],
    templateUrl: './course-approval.component.html',
    styleUrl: './course-approval.component.scss'
})
export class CourseApprovalComponent implements OnInit {
    courses: Course[] = [];
    filteredCourses: Course[] = [];
    selectedStatus: string = 'pending';
    searchTerm: string = '';

    pendingCount = 0;
    approvedCount = 0;
    rejectedCount = 0;
    allCount = 0;
    showRejectDialog = false;
    showApproveDialog = false;
    courseToReject: Course | null = null;
    courseToApprove: Course | null = null;

    constructor(public courseService: CourseService) {}

    ngOnInit(): void {
        this.courseService.courses$.subscribe(courses => {
            this.courses = courses;
            this.updateCounts();
            this.filterCourses();
        });
    }

    updateCounts(): void {
        this.pendingCount = this.courses.filter(c => c.status === 'pending').length;
        this.approvedCount = this.courses.filter(c => c.status === 'approved').length;
        this.rejectedCount = this.courses.filter(c => c.status === 'rejected').length;
        this.allCount = this.courses.length;
    }

    filterCourses(): void {
        let filtered = this.courses;

        if (this.selectedStatus !== 'all') {
            filtered = filtered.filter(course => course.status === this.selectedStatus);
        }

        if (this.searchTerm.trim()) {
            const term = this.searchTerm.toLowerCase().trim();
            filtered = filtered.filter(course =>
                course.name.toLowerCase().includes(term) ||
                course.instructor.name.toLowerCase().includes(term) ||
                course.category.toLowerCase().includes(term)
            );
        }

        this.filteredCourses = filtered;
    }

    onStatusChange(status: string): void {
        this.selectedStatus = status;
        this.filterCourses();
    }

    onSearchChange(): void {
        this.filterCourses();
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.filterCourses();
    }

    approveCourse(course: Course): void {
        this.courseToApprove = course;
        this.showApproveDialog = true;
    }

    confirmApprove(): void {
        if (this.courseToApprove) {
            this.courseService.updateCourseStatus(this.courseToApprove.id, 'approved');
            this.showApproveDialog = false;
            this.courseToApprove = null;
        }
    }

    cancelApprove(): void {
        this.showApproveDialog = false;
        this.courseToApprove = null;
    }

    rejectCourse(course: Course): void {
        this.courseToReject = course;
        this.showRejectDialog = true;
    }

    confirmReject(): void {
        if (this.courseToReject) {
            this.courseService.updateCourseStatus(this.courseToReject.id, 'rejected');
            this.showRejectDialog = false;
            this.courseToReject = null;
        }
    }

    cancelReject(): void {
        this.showRejectDialog = false;
        this.courseToReject = null;
    }

    undoPending(course: Course): void {
        if (confirm(`Bạn có chắc chắn muốn đưa khóa học "${course.name}" về trạng thái chờ duyệt không?`)) {
            this.courseService.updateCourseStatus(course.id, 'pending');
        }
    }

    getStatusBadgeClasses(status: string): string {
        switch (status) {
            case 'approved':
                return 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
            case 'rejected':
                return 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
            default:
                return 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
        }
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'approved':
                return 'check_circle';
            case 'pending':
                return 'schedule';
            case 'rejected':
                return 'cancel';
            default:
                return 'help';
        }
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'approved':
                return 'bg-success-50 text-success-600';
            case 'pending':
                return 'bg-warning-50 text-warning-600';
            case 'rejected':
                return 'bg-danger-50 text-danger-600';
            default:
                return 'bg-gray-50 text-gray-600';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'approved':
                return 'Approved';
            case 'pending':
                return 'Pending';
            case 'rejected':
                return 'Rejected';
            default:
                return status;
        }
    }
}
