import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { CategoryService } from '../../../services/category.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { Category, Subject } from '../../../types/category';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, TranslatePipe, LoadingComponent],
    templateUrl: './category-list.component.html',
    styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
    categories: Category[] = [];
    filteredCategories: Category[] = [];
    paginatedCategories: Category[] = [];

    isEditMode = false;
    editingId: string | null = null;
    searchTerm = '';

    // Form data for category
    categoryFormData = {
        name: '',
        description: ''
    };
    defaultSubjectName = '';

    // Pagination
    itemsPerPage = 10;
    currentPage = 1;

    // Modals
    showAddCategoryModal = false;
    showDeleteConfirm = false;
    deleteConfirmId: string | null = null;
    showCategoryDetailsModal = false;
    selectedCategoryForDetail: Category | null = null;

    isLoading = false;

    // Expose Math for template
    Math = Math;

    constructor(private categoryService: CategoryService) {}

    ngOnInit(): void {
        this.isLoading = true;
        this.categoryService.fetchCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
                this.applyFilters();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('[CategoryListComponent] Failed to load categories:', error);
                // Fallback to existing data if available
                this.categoryService.getCategories().subscribe(existingCategories => {
                    this.categories = existingCategories;
                    this.applyFilters();
                    this.isLoading = false;
                });
            }
        });
    }

    applyFilters(): void {
        let filtered = [...this.categories];

        // Search filter
        if (this.searchTerm.trim()) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(category =>
                (category.name && category.name.toLowerCase().includes(searchLower)) ||
                (category.description && category.description.toLowerCase().includes(searchLower))
            );
        }

        this.filteredCategories = filtered;
        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedCategories = this.filteredCategories.slice(startIndex, endIndex);
    }

    onSearchChange(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.applyFilters();
    }

    // Modal methods
    openAddCategoryModal(): void {
        this.showAddCategoryModal = true;
        this.isEditMode = false;
        this.editingId = null;
        this.categoryFormData = {
            name: '',
            description: ''
        };
        this.defaultSubjectName = '';
    }

    closeAddCategoryModal(): void {
        this.showAddCategoryModal = false;
        this.categoryFormData = {
            name: '',
            description: ''
        };
        this.defaultSubjectName = '';
        this.isEditMode = false;
        this.editingId = null;
    }

    editCategory(category: Category): void {
        this.isEditMode = true;
        this.editingId = category.id;
        this.categoryFormData = {
            name: category.name || '',
            description: category.description || ''
        };
        this.showAddCategoryModal = true;
    }

    submitCategoryForm(): void {
        if (!this.categoryFormData.name.trim()) {
            alert('Tên danh mục không được để trống');
            return;
        }

        if (this.isEditMode && this.editingId) {
            // Update existing category
            const category = this.categories.find(c => c.id === this.editingId);
            if (category) {
                this.categoryService.updateCategory(this.editingId, {
                    name: this.categoryFormData.name.trim(),
                    description: this.categoryFormData.description.trim()
                });
                alert('Danh mục đã được cập nhật');
            }
        } else {
            // Create new category
            if (!this.defaultSubjectName.trim()) {
                alert('Tên subject mặc định không được để trống');
                return;
            }

            // First create the category
            this.categoryService.addCategory({
                name: this.categoryFormData.name.trim(),
                description: this.categoryFormData.description.trim(),
                isActive: true
            }).subscribe({
                next: (newCategory) => {
                    if (!newCategory) {
                        alert('Có lỗi khi tạo danh mục');
                        return;
                    }

                    // Then add the default subject
                    const defaultSubject: Subject = {
                        id: Date.now().toString(),
                        name: this.defaultSubjectName.trim(),
                        description: '',
                        isActive: true
                    };

                    this.categoryService.addSubjectToCategory(newCategory.id, {
                        name: defaultSubject.name || '',
                        description: defaultSubject.description || '',
                        isActive: defaultSubject.isActive
                    }).subscribe({
                        next: () => {
                            alert('Danh mục và subject mặc định đã được thêm');
                            this.closeAddCategoryModal();
                            this.applyFilters();
                        },
                        error: (error) => {
                            console.error('Error adding subject:', error);
                            alert('Danh mục đã được tạo nhưng có lỗi khi thêm subject mặc định');
                        }
                    });
                },
                error: (error) => {
                    console.error('Error creating category:', error);
                    alert('Có lỗi khi tạo danh mục');
                }
            });
        }
    }

    // Delete methods
    confirmDelete(id: string): void {
        this.showDeleteConfirm = true;
        this.deleteConfirmId = id;
    }

    cancelDelete(): void {
        this.showDeleteConfirm = false;
        this.deleteConfirmId = null;
    }

    deleteCategory(categoryId?: string): void {
        const id = categoryId || this.deleteConfirmId;
        if (id) {
            this.categoryService.deleteCategory(id);
            this.showDeleteConfirm = false;
            this.deleteConfirmId = null;
            this.applyFilters();
            alert('Danh mục đã được xóa');
        }
    }

    // Category Details Modal
    openCategoryDetailsModal(category: Category): void {
        // Fetch detailed category data from API
        this.categoryService.getCategoryById(category.id).subscribe({
            next: (detailedCategory) => {
                if (detailedCategory) {
                    this.selectedCategoryForDetail = detailedCategory;
                } else {
                    // Fallback to existing data
                    this.selectedCategoryForDetail = category;
                }
                this.showCategoryDetailsModal = true;
            },
            error: (error) => {
                console.error('[CategoryListComponent] Failed to load category details:', error);
                // Fallback to existing data
                this.selectedCategoryForDetail = category;
                this.showCategoryDetailsModal = true;
            }
        });
    }

    closeCategoryDetailsModal(): void {
        this.showCategoryDetailsModal = false;
        this.selectedCategoryForDetail = null;
    }

    // Pagination
    get totalPages(): number {
        return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
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

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePagination();
        }
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
