import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category.service';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './category-list.component.html',
    styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
    categories: Category[] = [];

    filteredCategories: Category[] = [];

    isEditMode = false;
    editingId: string | null = null;
    searchTerm = '';

    formData = {
        name: '',
        description: '',
        displayOrder: 0,
        image: null as string | null
    };

    itemsPerPage = 5;
    currentPage = 1;
    paginatedCategories: Category[] = [];
    totalPages = 1;

    selectedStatus = 'All';
    isStatusDropdownOpen = false;

    showDeleteConfirm = false;
    deleteConfirmId: string | null = null;
    showAddModal = false;

    constructor(private categoryService: CategoryService) {}

    ngOnInit(): void {
        this.categoryService.getCategories().subscribe(categories => {
            this.categories = categories;
            this.applyFilters();
        });
    }

    resetForm(): void {
        this.formData = {
            name: '',
            description: '',
            displayOrder: 0,
            image: null
        };
        this.isEditMode = false;
        this.editingId = null;
    }

    editCategory(category: Category): void {
        this.isEditMode = true;
        this.editingId = category.id;
        this.formData = {
            name: category.name,
            description: category.description,
            displayOrder: category.displayOrder,
            image: category.image || null
        };
        this.showAddModal = true;
    }

    submitForm(): void {
        if (!this.formData.name.trim()) {
            alert('Tên danh mục không được để trống');
            return;
        }

        if (this.isEditMode && this.editingId) {
            this.categoryService.updateCategory(this.editingId, {
                name: this.formData.name,
                description: this.formData.description,
                displayOrder: this.formData.displayOrder
            });
        } else {
            this.categoryService.addCategory({
                name: this.formData.name,
                description: this.formData.description,
                displayOrder: this.formData.displayOrder,
                isActive: true,
                courseCount: 0
            });
        }

        this.resetForm();
        this.showAddModal = false;
        alert(this.isEditMode ? 'Danh mục đã được cập nhật' : 'Danh mục đã được thêm');
    }

    applyFilters(): void {
        let filtered = this.categories;

        if (this.searchTerm.trim()) {
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        if (this.selectedStatus !== 'All') {
            const isActive = this.selectedStatus === 'Active';
            filtered = filtered.filter(c => c.isActive === isActive);
        }

        this.filteredCategories = filtered;
        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination(): void {
        this.totalPages = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedCategories = this.filteredCategories.slice(startIndex, endIndex);
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePagination();
        }
    }

    confirmDelete(id: string): void {
        this.showDeleteConfirm = true;
        this.deleteConfirmId = id;
    }

    cancelDelete(): void {
        this.showDeleteConfirm = false;
        this.deleteConfirmId = null;
    }

    deleteCategory(): void {
        if (this.deleteConfirmId) {
            this.categoryService.deleteCategory(this.deleteConfirmId);
            this.showDeleteConfirm = false;
            this.deleteConfirmId = null;
            this.applyFilters();
        }
    }

    toggleActive(category: Category): void {
        this.categoryService.toggleActive(category.id);
    }

    openAddModal(): void {
        this.showAddModal = true;
    }

    closeAddModal(): void {
        this.showAddModal = false;
        this.resetForm();
    }

    toggleStatusDropdown(): void {
        this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
    }

    filterByStatus(status: string): void {
        this.selectedStatus = status;
        this.isStatusDropdownOpen = false;
        this.applyFilters();
    }

    onSearchCategories(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.applyFilters();
    }

    getIndent(category: Category): string {
        return '0px';
    }

    getIndentLevel(category: Category): number {
        return 0;
    }

    getCategoryDisplayName(category: Category): string {
        return category.name;
    }

    getStatusColor(isActive: boolean): string {
        return isActive ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600';
    }

    min(a: number, b: number): number {
        return Math.min(a, b);
    }
}
