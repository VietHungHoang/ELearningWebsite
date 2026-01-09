import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import { UserService, Tutor } from '../../../services/user.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { LocaleUtilsService } from '../../../shared/utils';
import { I18nService } from '../../../i18n/i18n.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
    selector: 'app-instructor-list',
    standalone: true,
    imports: [CommonModule, RouterLink, ConfirmDialogComponent, SearchInputComponent, LoadingComponent, TranslatePipe, CurrencyFormatPipe],
    templateUrl: './instructor-list.component.html',
    styleUrl: './instructor-list.component.scss'
})
export class InstructorListComponent implements OnInit {
    instructors: Tutor[] = []; // Full list từ API (backup)
    allInstructors: Tutor[] = []; // Original data from API để restore sau search
    selectedInstructor: Tutor | null = null;
    showDetailModal = false;
    showDeleteDialog = false;
    instructorToDelete: Tutor | null = null;

    itemsPerPage = 3;
    currentPage = 1;
    totalInstructors = 0;
    paginatedInstructors: Tutor[] = [];
    isLoading = false;
    searchPlaceholder = '';

    constructor(
        private userService: UserService, 
        private router: Router, 
        private localeUtils: LocaleUtilsService,
        private i18nService: I18nService
    ) {
        this.searchPlaceholder = this.i18nService.translate('instructorList.searchPlaceholder');
        
        // Update placeholder when language changes
        effect(() => {
            this.i18nService.currentLanguage$();
            this.searchPlaceholder = this.i18nService.translate('instructorList.searchPlaceholder');
        });
    }

    ngOnInit(): void {
        this.loadInstructors();
    }

    /**
     * Load instructors from API (with fallback to mock data)
     * Gọi API lần đầu và cache dữ liệu cho phân trang
     */
    loadInstructors(): void {
        this.isLoading = true;
        this.userService.getTutor().subscribe({
            next: (instructors) => {
                this.allInstructors = instructors; // Lưu backup
                this.instructors = instructors; // Dùng cho phân trang hiện tại
                this.totalInstructors = instructors.length;
                this.currentPage = 1; // Reset trang về 1
                this.applyPagination(instructors);
                this.isLoading = false;
                console.log('[InstructorList] Data loaded from API:', instructors.length, 'items');
            },
            error: (error: any) => {
                console.error('Error loading instructors:', error);
                this.isLoading = false;
            }
        });
    }

    viewDetail(instructor: Tutor): void {
        this.router.navigate(['/dashboard/user-management/instructor-detail', instructor.id.toString()]);
    }

    closeModal(): void {
        this.showDetailModal = false;
        this.selectedInstructor = null;
    }

    openDeleteDialog(instructor: Tutor): void {
        this.instructorToDelete = instructor;
        this.showDeleteDialog = true;
    }

    confirmDelete(): void {
        if (this.instructorToDelete) {
            this.userService.deleteInstructor(this.instructorToDelete.id).subscribe({
                next: () => {
                    // Reload instructors after successful deletion
                    this.loadInstructors();
                    this.showDeleteDialog = false;
                    this.instructorToDelete = null;
                },
                error: (error) => {
                    console.error('Error deleting instructor:', error);
                    // Still reload to update UI (fallback already updated local state)
                    this.loadInstructors();
                    this.showDeleteDialog = false;
                    this.instructorToDelete = null;
                }
            });
        }
    }

    cancelDelete(): void {
        this.showDeleteDialog = false;
        this.instructorToDelete = null;
    }

    onSearchInstructors(searchTerm: string): void {
        this.currentPage = 1;
        if (searchTerm.trim()) {
            // Call search method with search term
            this.userService.searchInstructors(searchTerm).subscribe({
                next: (searchResults) => {
                    this.instructors = searchResults; // Update instructors cho pagination
                    this.totalInstructors = searchResults.length;
                    this.applyPagination(searchResults); // Apply pagination cho search results
                    console.log('[InstructorList] Search results:', searchResults.length, 'items');
                },
                error: (error) => console.error('Error searching instructors:', error)
            });
        } else {
            // Restore original data từ backup
            this.instructors = this.allInstructors;
            this.totalInstructors = this.allInstructors.length;
            this.applyPagination(this.allInstructors);
            console.log('[InstructorList] Cleared search, restored original data');
        }
    }

    /**
     * Get the rating of an instructor, formatted to 1 decimal place
     */
    getRating(instructor: Tutor): string {
        const rating = instructor.rating || 0;
        return rating.toFixed(1);
    }

    /**
     * Get the session fee of an instructor
     */
    getSessionFee(instructor: Tutor): number | null {
        return instructor.currentSessionFee || null;
    }

    /**
     * Get the country code of an instructor
     */
    getCountryCode(instructor: Tutor): string {
        if (!instructor.countryCode) return 'N/A';
        try {
            const country = this.localeUtils.getCountryByCode(instructor.countryCode);
            return country ? country.name.common : instructor.countryCode;
        } catch (error) {
            return instructor.countryCode || 'N/A';
        }
    }

    private applyPagination(allInstructors: Tutor[]): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedInstructors = allInstructors.slice(startIndex, endIndex);
        // NOT: this.instructors = this.paginatedInstructors; - Keep full list in instructors!
    }

    get totalPages(): number {
        return Math.ceil(this.totalInstructors / this.itemsPerPage);
    }

    get showingText(): string {
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalInstructors);
        return this.i18nService.translate('instructorList.pagination.showing', {
            start: startItem,
            end: endItem,
            total: this.totalInstructors
        });
    }

    getSttNumber(index: number): number {
        // Calculate STT based on current page and items per page
        return (this.currentPage - 1) * this.itemsPerPage + index + 1;
    }

    getDeleteMessage(): string {
        if (!this.instructorToDelete) return '';
        return this.i18nService.translate('instructorList.confirm.deleteMessage', {
            name: this.instructorToDelete.name || ''
        });
    }

    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.applyPagination(this.instructors);
        console.log('[InstructorList] Navigated to page', page);
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.applyPagination(this.instructors);
            console.log('[InstructorList] Previous page:', this.currentPage);
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.applyPagination(this.instructors);
            console.log('[InstructorList] Next page:', this.currentPage);
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
