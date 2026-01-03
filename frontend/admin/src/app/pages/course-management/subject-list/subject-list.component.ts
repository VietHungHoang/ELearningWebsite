import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subject as RxjsSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { CategoryService } from '../../../services/category.service';
import { Category, Subject } from '../../../types/category';

interface SubjectItem {
    category: Category;
    subject: Subject;
    subjectIndex: number;
    displayId: string;
}

@Component({
    selector: 'app-subject-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, TranslatePipe],
    templateUrl: './subject-list.component.html',
    styleUrl: './subject-list.component.scss'
})
export class SubjectListComponent implements OnInit, OnDestroy {
    private destroy$ = new RxjsSubject<void>();

    categories: Category[] = [];

    subjectItems: SubjectItem[] = [];
    filteredSubjectItems: SubjectItem[] = [];
    paginatedSubjectItems: SubjectItem[] = [];

    isEditMode = false;
    editingId: string | null = null;
    searchTerm = '';
    selectedCategoryForSubject: string = '';
    editingSubjectCategoryId: string | null = null;
    editingSubjectId: string | null = null;
    newCategoryName: string = '';

    formData = {
        name: '',
        description: '',
        image: null as string | null,
        subjects: [] as Subject[]
    };

    itemsPerPage = 5;
    currentPage = 1;

    selectedStatus = 'All';
    isStatusDropdownOpen = false;

    selectedCategoryFilter = 'All';
    isCategoryFilterDropdownOpen = false;

    showAddModal = false;

    // Expose Math for template
    Math = Math;

    constructor(private categoryService: CategoryService) {
        console.log('🎯 [SubjectListComponent] CONSTRUCTOR CALLED - Component created!');
    }

    ngOnInit(): void {
        // Load all subjects using PRIMARY API
        this.categoryService.fetchAllSubjects()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (subjects) => {
                    // Create subject items from subjects data
                    this.subjectItems = [];
                    subjects.forEach(subject => {
                        // Create a dummy category object since we don't have full category data
                        const dummyCategory: Category = {
                            id: subject.categoryId || 'unknown',
                            name: 'Unknown Category', // Placeholder name
                            slug: '',
                            description: '',
                            displayOrder: 0,
                            isActive: true,
                            tutorCount: 0,
                            subjects: []
                        };
                        this.subjectItems.push({
                            category: dummyCategory,
                            subject: subject,
                            subjectIndex: 0,
                            displayId: subject.id
                        });
                    });
                    this.applyFilters();
                },
                error: (error) => {
                    console.error('[SubjectListComponent] Failed to load subjects:', error);
                    // Fallback: create subject items from categories
                    this.createSubjectItems();
                    this.applyFilters();
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private createSubjectItems(): void {
        this.subjectItems = [];
        if (this.categories.length > 0) {
            this.categories.forEach(category => {
                if (category.subjects && category.subjects.length > 0) {
                    category.subjects.forEach((subject: Subject, index: number) => {
                        this.subjectItems.push({
                            category: category,
                            subject: subject,
                            subjectIndex: index,
                            displayId: `${category.id}.${index + 1}`
                        });
                    });
                }
            });
        }
    }

    resetForm(): void {
        this.formData = {
            name: '',
            description: '',
            image: null,
            subjects: []
        };
        this.selectedCategoryForSubject = '';
        this.newCategoryName = '';
        this.isEditMode = false;
        this.editingId = null;
        this.editingSubjectCategoryId = null;
        this.editingSubjectId = null;
    }

    submitForm(): void {
        if (!this.formData.name.trim()) {
            alert('Tên môn học không được để trống');
            return;
        }

        if (!this.selectedCategoryForSubject) {
            alert('Vui lòng chọn danh mục');
            return;
        }

        let categoryId = this.selectedCategoryForSubject;

        const newSubject: Subject = {
            id: this.editingId || Date.now().toString(),
            name: this.formData.name,
            description: this.formData.description || undefined,
            isActive: true
        };

        // Nếu chọn "Other", tạo category mới
        if (this.selectedCategoryForSubject === 'other') {
            if (!this.newCategoryName.trim()) {
                alert('Vui lòng nhập tên danh mục mới');
                return;
            }

            // Create new category first
            this.categoryService.addCategory({
                name: this.newCategoryName.trim(),
                description: '',
                isActive: true
            }).subscribe({
                next: (newCategory) => {
                    if (!newCategory) {
                        alert('Có lỗi khi tạo danh mục mới');
                        return;
                    }
                    categoryId = newCategory.id;
                    // Continue with adding subject
                    this.addSubjectToCategory(categoryId, newSubject);
                },
                error: (error) => {
                    console.error('Error creating category:', error);
                    alert('Có lỗi khi tạo danh mục mới');
                }
            });
        } else {
            categoryId = this.selectedCategoryForSubject;
            this.addSubjectToCategory(categoryId, newSubject);
        }
    }

    private addSubjectToCategory(categoryId: string, subject: Subject): void {
        if (this.isEditMode && this.editingSubjectId) {
            // Update existing subject using PRIMARY API
            this.categoryService.updateSubjectPrimary(this.editingSubjectId, {
                name: subject.name,
                description: subject.description,
                isActive: subject.isActive
            }).subscribe({
                next: (updatedSubject) => {
                    if (updatedSubject) {
                        this.resetForm();
                        this.showAddModal = false;
                        this.applyFilters();
                        alert('Môn học đã được cập nhật');
                    } else {
                        alert('Có lỗi khi cập nhật môn học');
                    }
                },
                error: (error) => {
                    console.error('Error updating subject:', error);
                    alert('Có lỗi khi cập nhật môn học');
                }
            });
        } else {
            // Add new subject using PRIMARY API
            this.categoryService.addSubjectPrimary({
                categoryId: categoryId,
                name: subject.name,
                description: subject.description || '',
                isActive: subject.isActive
            }).subscribe({
                next: (newSubject) => {
                    if (newSubject) {
                        this.resetForm();
                        this.showAddModal = false;
                        this.applyFilters();
                        alert('Môn học đã được thêm');
                    } else {
                        alert('Có lỗi khi thêm môn học');
                    }
                },
                error: (error) => {
                    console.error('Error adding subject:', error);
                    alert('Có lỗi khi thêm môn học');
                }
            });
        }
    }

    applyFilters(): void {
        let filtered = this.subjectItems;

        if (this.searchTerm.trim()) {
            filtered = filtered.filter(item =>
                item.category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                (item.subject && item.subject.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
            );
        }

        if (this.selectedStatus !== 'All') {
            const isActive = this.selectedStatus === 'Active';
            filtered = filtered.filter(item => item.subject.isActive === isActive);
        }

        if (this.selectedCategoryFilter !== 'All') {
            filtered = filtered.filter(item => item.category.name === this.selectedCategoryFilter);
        }

        this.filteredSubjectItems = filtered;
        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedSubjectItems = this.filteredSubjectItems.slice(startIndex, endIndex);
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePagination();
        }
    }

    onSearchChange(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.applyFilters();
    }

    getStatusColor(isActive: boolean): string {
        return isActive ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600';
    }

    getTutorCountForSubject(subjectId: string): number {
        // Since we don't have subjects in categories anymore, return 0 or fetch from subject
        const subject = this.subjectItems.find(item => item.subject.id === subjectId)?.subject;
        return subject?.tutorCount || 0;
    }

    editSubject(item: SubjectItem): void {
        if (!item.subject) return;

        this.isEditMode = true;
        this.editingId = item.subject.id;
        this.editingSubjectCategoryId = item.category.id;
        this.editingSubjectId = item.subject.id;
        this.selectedCategoryForSubject = item.category.id;

        this.formData = {
            name: item.subject.name,
            description: item.subject.description || '',
            image: null,
            subjects: []
        };

        this.showAddModal = true;
    }

    deleteSubject(item: SubjectItem): void {
        if (!item.subject || !confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
            return;
        }

        // Use PRIMARY API for deleting subject
        this.categoryService.deleteSubjectPrimary(item.subject.id).subscribe({
            next: (success) => {
                if (success) {
                    this.applyFilters();
                    alert('Môn học đã được xóa');
                } else {
                    alert('Có lỗi khi xóa môn học');
                }
            },
            error: (error) => {
                console.error('Error deleting subject:', error);
                alert('Có lỗi khi xóa môn học');
            }
        });
    }

    toggleSubjectActive(item: SubjectItem): void {
        if (!item.subject) return;

        // Use PRIMARY API for toggling subject active status
        this.categoryService.toggleSubjectActivePrimary(item.subject.id).subscribe({
            next: (updatedSubject) => {
                if (updatedSubject) {
                    this.applyFilters();
                } else {
                    alert('Có lỗi khi thay đổi trạng thái môn học');
                }
            },
            error: (error) => {
                console.error('Error toggling subject active status:', error);
                alert('Có lỗi khi thay đổi trạng thái môn học');
            }
        });
    }



    closeAddModal(): void {
        this.showAddModal = false;
        this.resetForm();
    }

    toggleStatusDropdown(): void {
        this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
        this.isCategoryFilterDropdownOpen = false;
    }

    filterByStatus(status: string): void {
        this.selectedStatus = status;
        this.isStatusDropdownOpen = false;
        this.applyFilters();
    }

    toggleCategoryFilterDropdown(): void {
        this.isCategoryFilterDropdownOpen = !this.isCategoryFilterDropdownOpen;
        this.isStatusDropdownOpen = false;

        // Load categories if not loaded yet
        if (this.isCategoryFilterDropdownOpen && this.categories.length === 0) {
            this.categoryService.fetchCategories().subscribe({
                next: (categories) => {
                    this.categories = categories;
                },
                error: (error) => {
                    console.error('[SubjectListComponent] Failed to load categories for filter:', error);
                    // Fallback to existing data if available
                    this.categoryService.getCategories().subscribe(existingCategories => {
                        this.categories = existingCategories;
                    });
                }
            });
        }
    }

    filterByCategory(categoryName: string): void {
        this.selectedCategoryFilter = categoryName;
        this.isCategoryFilterDropdownOpen = false;
        this.currentPage = 1;
        this.applyFilters();
    }

    onCategoryChange(): void {
        // Method để trigger change detection khi dropdown thay đổi
    }

    openAddSubjectModal(): void {
        // Load categories khi mở modal add/edit
        this.categoryService.fetchCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
            },
            error: (error) => {
                console.error('[SubjectListComponent] Failed to load categories for modal:', error);
                // Fallback to existing data if available
                this.categoryService.getCategories().subscribe(existingCategories => {
                    this.categories = existingCategories;
                });
            }
        });

        this.resetForm();
        this.showAddModal = true;
    }

    get totalPages(): number {
        return Math.ceil(this.filteredSubjectItems.length / this.itemsPerPage);
    }

    get showingText(): string {
        if (this.filteredSubjectItems.length === 0) {
            return 'Showing 0 of 0 entries';
        }
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredSubjectItems.length);
        return `Showing ${startItem} to ${endItem} of ${this.filteredSubjectItems.length} entries`;
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

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagination();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePagination();
        }
    }
}

