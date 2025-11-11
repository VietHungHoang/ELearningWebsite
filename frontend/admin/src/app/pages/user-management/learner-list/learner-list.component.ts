import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import { UserService, Learner } from '../../../services/user.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';

@Component({
    selector: 'app-learner-list',
    standalone: true,
    imports: [CommonModule, HttpClientModule, RouterLink, ConfirmDialogComponent, SearchInputComponent],
    templateUrl: './learner-list.component.html',
    styleUrl: './learner-list.component.scss'
})
export class LearnerListComponent implements OnInit {
    learners: Learner[] = [];
    showDeleteDialog = false;
    learnerToDelete: Learner | null = null;

    itemsPerPage = 5;
    currentPage = 1;
    totalLearners = 0;
    paginatedLearners: Learner[] = [];

    constructor(private userService: UserService, private router: Router) {}

    ngOnInit(): void {
        this.userService.getLearners().subscribe(learners => {
            this.learners = learners;
            this.totalLearners = learners.length;
            this.applyPagination(learners);
        });
    }

    viewDetail(learner: Learner): void {
        this.router.navigate(['/dashboard/user-management/learner-detail', learner.id.toString()]);
    }

    openDeleteDialog(learner: Learner): void {
        this.learnerToDelete = learner;
        this.showDeleteDialog = true;
    }

    confirmDelete(): void {
        if (this.learnerToDelete) {
            this.userService.deleteLearner(this.learnerToDelete.id);
            this.showDeleteDialog = false;
            this.learnerToDelete = null;
        }
    }

    cancelDelete(): void {
        this.showDeleteDialog = false;
        this.learnerToDelete = null;
    }

    onSearchLearners(searchTerm: string): void {
        if (searchTerm.trim()) {
            this.userService.searchLearners(searchTerm).subscribe(filteredLearners => {
                this.totalLearners = filteredLearners.length;
                this.currentPage = 1;
                this.applyPagination(filteredLearners);
            });
        } else {

            this.userService.getLearners().subscribe(learners => {
                this.learners = learners;
                this.totalLearners = learners.length;
                this.currentPage = 1;
                this.applyPagination(learners);
            });
        }
    }

    private applyPagination(allLearners: Learner[]): void {
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
        return `Showing ${startItem}-${endItem} of ${this.totalLearners} results`;
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.userService.getLearners().subscribe(learners => {
                this.applyPagination(learners);
            });
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.userService.getLearners().subscribe(learners => {
                this.applyPagination(learners);
            });
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.userService.getLearners().subscribe(learners => {
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
