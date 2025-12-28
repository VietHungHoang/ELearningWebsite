import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import { UserService, Student } from '../../../services/user.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
    selector: 'app-learner-list',
    standalone: true,
    imports: [CommonModule, HttpClientModule, RouterLink, ConfirmDialogComponent, SearchInputComponent, TruncatePipe, TranslatePipe],
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

    constructor(private userService: UserService, private router: Router, public i18nService: I18nService) {}

    ngOnInit(): void {
        this.loadLearners();
    }

    /**
     * Load learners from API (with fallback to mock data)
     */
    loadLearners(): void {
        this.isLoading = true;
        this.userService.getStudents().subscribe({
            next: (learners) => {
                this.learners = learners;
                this.totalLearners = learners.length;
                this.paginatedLearners = learners;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading learners:', error);
                this.isLoading = false;
            }
        });
    }

    viewDetail(learner: Student): void {
        this.router.navigate(['/dashboard/user-management/learner-detail', learner.id.toString()]);
    }

    openDeleteDialog(learner: Student): void {
        this.learnerToDelete = learner;
        this.showDeleteDialog = true;
    }

    confirmDelete(): void {
        if (this.learnerToDelete) {
            this.userService.deleteStudent(this.learnerToDelete.id);
            this.showDeleteDialog = false;
            this.learnerToDelete = null;
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
                next: (learners) => {
                    this.learners = learners;
                    this.totalLearners = learners.length;
                    this.paginatedLearners = learners;
                },
                error: (error) => console.error('Error searching learners:', error)
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
            this.userService.getStudents().subscribe(learners => {
                this.applyPagination(learners);
            });
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.userService.getStudents().subscribe(learners => {
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
