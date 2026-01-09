import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subject as RxjsSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { CategoryService } from '../../../services/category.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { I18nService } from '../../../i18n/i18n.service';
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
    imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, TranslatePipe, LoadingComponent],
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

    selectedCategoryFilter = 'All';
    isCategoryFilterDropdownOpen = false;

    showAddModal = false;
    isLoading = false;

    // Expose Math for template
    Math = Math;

    constructor(
        private categoryService: CategoryService,
        private i18nService: I18nService
    ) {
        console.log('🎯 [SubjectListComponent] CONSTRUCTOR CALLED - Component created!');
    }

    ngOnInit(): void {
        this.isLoading = true;
        // Load categories first, then load subjects
        this.categoryService.fetchCategories()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (categories: Category[]) => {
                    this.categories = categories;
                    // Then load all subjects using PRIMARY API
                    this.loadSubjects();
                },
                error: (error: any) => {
                    console.error('[SubjectListComponent] Failed to load categories:', error);
                    // Still try to load subjects
                    this.loadSubjects();
                }
            });
    }

    private loadSubjects(): void {
        this.isLoading = true;
        this.categoryService.fetchAllSubjects()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (subjects: Subject[]) => {
                    // Create subject items from subjects data
                    this.subjectItems = [];
                    const currentLang = this.i18nService.getCurrentLanguage();

                    subjects.forEach(subject => {
                        // Find category by categoryId
                        const category = this.categories.find(cat => cat.id === subject.categoryId);

                        // Use found category or create a dummy one
                        const categoryForSubject: Category = category || {
                            id: subject.categoryId || 'unknown',
                            nameVi: 'Danh mục không xác định',
                            nameEn: 'Unknown Category',
                            name: currentLang === 'vi' ? 'Danh mục không xác định' : 'Unknown Category',
                            slug: '',
                            description: '',
                            displayOrder: 0,
                            isActive: true,
                            tutorCount: 0,
                            subjects: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };

                        // Ensure subject has name based on current language
                        if (!subject.name) {
                            subject.name = currentLang === 'vi'
                                ? (subject.nameVi || subject.nameEn || '')
                                : (subject.nameEn || subject.nameVi || '');
                        }

                        this.subjectItems.push({
                            category: categoryForSubject,
                            subject: subject,
                            subjectIndex: 0,
                            displayId: subject.id
                        });
                    });
                    this.applyFilters();
                    this.isLoading = false;
                },
                error: (error: any) => {
                    console.error('[SubjectListComponent] Failed to load subjects:', error);
                    // Fallback: create subject items from categories
                    this.createSubjectItems();
                    this.applyFilters();
                    this.isLoading = false;
                }
            });
    }

    getSubjectName(subject: Subject): string {
        const currentLang = this.i18nService.getCurrentLanguage();
        if (currentLang === 'vi') {
            return subject.nameVi || subject.nameEn || subject.name || '';
        } else {
            return subject.nameEn || subject.nameVi || subject.name || '';
        }
    }

    getCategoryName(category: Category): string {
        const currentLang = this.i18nService.getCurrentLanguage();
        if (currentLang === 'vi') {
            return category.nameVi || category.nameEn || category.name || '';
        } else {
            return category.nameEn || category.nameVi || category.name || '';
        }
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
                name: subject.name || '',
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
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(item => {
                const categoryName = this.getCategoryName(item.category).toLowerCase();
                const subjectName = this.getSubjectName(item.subject).toLowerCase();
                return categoryName.includes(searchLower) || subjectName.includes(searchLower);
            });
        }

        if (this.selectedCategoryFilter !== 'All') {
            filtered = filtered.filter(item => this.getCategoryName(item.category) === this.selectedCategoryFilter);
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
            name: item.subject.name || '',
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



    closeAddModal(): void {
        this.showAddModal = false;
        this.resetForm();
    }

    toggleCategoryFilterDropdown(): void {
        this.isCategoryFilterDropdownOpen = !this.isCategoryFilterDropdownOpen;

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

