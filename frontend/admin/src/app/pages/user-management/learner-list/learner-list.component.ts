import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import { UserService, Student } from '../../../services/user.service';
import { ClassService, GroupClass } from '../../../services/class.service';
import { PaginatedResponse } from '../../../types/pagination';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { I18nService } from '../../../i18n/i18n.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-learner-list',
    standalone: true,
    imports: [CommonModule, HttpClientModule, RouterLink, ConfirmDialogComponent, SearchInputComponent, LoadingComponent, TranslatePipe],
    templateUrl: './learner-list.component.html',
    styleUrl: './learner-list.component.scss'
})
export class LearnerListComponent implements OnInit {
    learners: Student[] = [];
    showDeleteDialog = false;
    learnerToDelete: Student | null = null;

    itemsPerPage = 5;
    currentPage = 1;
    totalLearners = 0;
    paginatedLearners: Student[] = [];
    isLoading = false;

    constructor(
        private userService: UserService,
        private classService: ClassService,
        private router: Router,
        public i18nService: I18nService
    ) {}

    ngOnInit(): void {
        this.loadLearners();
    }

    /**
     * Load learners from API (with fallback to mock data)
     */
    loadLearners(): void {
        this.isLoading = true;
        // Load both learners and classes to calculate enrollment count
        forkJoin({
            learners: this.userService.getStudents(),
            classes: this.classService.getClasses(0, 1000) // Get all classes to count enrollments
        }).subscribe({
            next: ({ learners, classes }: { learners: Student[], classes: PaginatedResponse<GroupClass> }) => {
                // Calculate enrollment count for each learner
                const learnersWithEnrollment = learners.map((learner: Student) => {
                    // Count how many classes this learner is enrolled in
                    // Check if learner.id exists in any class's students array
                    let enrollmentCount = 0;
                    
                    classes.content.forEach((cls: GroupClass) => {
                        if (cls.students && Array.isArray(cls.students)) {
                            // Check if learner.id matches any student in the class
                            const isEnrolled = cls.students.some((student: any) => {
                                // Handle different possible student object structures
                                return student.id === learner.id || 
                                       student.studentId === learner.id ||
                                       (typeof student === 'string' && student === learner.id);
                            });
                            
                            if (isEnrolled) {
                                enrollmentCount++;
                            }
                        }
                    });
                    
                    return {
                        ...learner,
                        enrollmentCount: enrollmentCount
                    };
                });
                
                this.learners = learnersWithEnrollment;
                this.totalLearners = learnersWithEnrollment.length;
                this.paginatedLearners = learnersWithEnrollment;
                this.isLoading = false;
            },
            error: (error: any) => {
                console.error('Error loading learners:', error);
                // Fallback: load learners without enrollment count
                this.userService.getStudents().subscribe({
                    next: (learners: Student[]) => {
                        this.learners = learners.map((l: Student) => ({ ...l, enrollmentCount: 0 }));
                        this.totalLearners = learners.length;
                        this.paginatedLearners = this.learners;
                        this.isLoading = false;
                    },
                    error: (err: any) => {
                        console.error('Error loading learners:', err);
                        this.isLoading = false;
                    }
                });
            }
        });
    }

    openDeleteDialog(learner: Student): void {
        this.learnerToDelete = learner;
        this.showDeleteDialog = true;
    }

    confirmDelete(): void {
        if (this.learnerToDelete) {
            this.userService.deleteStudent(this.learnerToDelete.id).subscribe({
                next: () => {
                    // Reload learners after successful deletion
                    this.loadLearners();
                    this.showDeleteDialog = false;
                    this.learnerToDelete = null;
                },
                error: (error: any) => {
                    console.error('Error deleting student:', error);
                    // Still reload to update UI (fallback already updated local state)
                    this.loadLearners();
                    this.showDeleteDialog = false;
                    this.learnerToDelete = null;
                }
            });
        }
    }

    cancelDelete(): void {
        this.showDeleteDialog = false;
        this.learnerToDelete = null;
    }

    onSearchLearners(searchTerm: string): void {
        this.currentPage = 1;
        if (searchTerm.trim()) {
            // Call search method with search term
            this.userService.searchStudents(searchTerm).subscribe({
                next: (learners: Student[]) => {
                    this.learners = learners;
                    this.totalLearners = learners.length;
                    this.paginatedLearners = learners;
                },
                error: (error: any) => console.error('Error searching learners:', error)
            });
        } else {
            this.loadLearners();
        }
    }

    private applyPagination(allLearners: Student[]): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedLearners = allLearners.slice(startIndex, endIndex);
        this.learners = this.paginatedLearners;
    }

    get totalPages(): number {
        return Math.ceil(this.totalLearners / this.itemsPerPage);
    }

    get showingText(): string {
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalLearners);
        return this.i18nService.translate('learnerList.pagination.showing', { start: startItem, end: endItem, total: this.totalLearners });
    }

    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.loadLearners();
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.userService.getStudents().subscribe((learners: Student[]) => {
                this.applyPagination(learners);
            });
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.userService.getStudents().subscribe((learners: Student[]) => {
                this.applyPagination(learners);
            });
        }
    }

    get visiblePages(): number[] {
        const pages: number[] = [];
        const maxVisiblePages = 4;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }
}
