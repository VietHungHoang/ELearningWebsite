import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import { UserService, Instructor } from '../../../services/user.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';

@Component({
    selector: 'app-instructor-list',
    standalone: true,
    imports: [CommonModule, RouterLink, ConfirmDialogComponent, SearchInputComponent],
    templateUrl: './instructor-list.component.html',
    styleUrl: './instructor-list.component.scss'
})
export class InstructorListComponent implements OnInit {
    instructors: Instructor[] = [];
    selectedInstructor: Instructor | null = null;
    showDetailModal = false;
    showDeleteDialog = false;
    instructorToDelete: Instructor | null = null;

    itemsPerPage = 5;
    currentPage = 1;
    totalInstructors = 0;
    paginatedInstructors: Instructor[] = [];

    constructor(private userService: UserService, private router: Router) {}

    ngOnInit(): void {
        this.userService.getInstructors().subscribe(instructors => {
            this.instructors = instructors;
            this.totalInstructors = instructors.length;
            this.applyPagination(instructors);
        });
    }

    viewDetail(instructor: Instructor): void {
        this.router.navigate(['/dashboard/user-management/instructor-detail', instructor.id.toString()]);
    }

    closeModal(): void {
        this.showDetailModal = false;
        this.selectedInstructor = null;
    }

    openDeleteDialog(instructor: Instructor): void {
        this.instructorToDelete = instructor;
        this.showDeleteDialog = true;
    }

    confirmDelete(): void {
        if (this.instructorToDelete) {
            this.userService.deleteInstructor(this.instructorToDelete.id);
            this.showDeleteDialog = false;
            this.instructorToDelete = null;
        }
    }

    cancelDelete(): void {
        this.showDeleteDialog = false;
        this.instructorToDelete = null;
    }

    onSearchInstructors(searchTerm: string): void {
        if (searchTerm.trim()) {
            this.userService.searchInstructors(searchTerm).subscribe(filteredInstructors => {
                this.totalInstructors = filteredInstructors.length;
                this.currentPage = 1;
                this.applyPagination(filteredInstructors);
            });
        } else {

            this.userService.getInstructors().subscribe(instructors => {
                this.instructors = instructors;
                this.totalInstructors = instructors.length;
                this.currentPage = 1;
                this.applyPagination(instructors);
            });
        }
    }

    private applyPagination(allInstructors: Instructor[]): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedInstructors = allInstructors.slice(startIndex, endIndex);
        this.instructors = this.paginatedInstructors;
    }

    get totalPages(): number {
        return Math.ceil(this.totalInstructors / this.itemsPerPage);
    }

    get showingText(): string {
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalInstructors);
        return `Showing ${startItem}-${endItem} of ${this.totalInstructors} results`;
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.userService.getInstructors().subscribe(instructors => {
                this.applyPagination(instructors);
            });
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.userService.getInstructors().subscribe(instructors => {
                this.applyPagination(instructors);
            });
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.userService.getInstructors().subscribe(instructors => {
                this.applyPagination(instructors);
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
