import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { CategoryService, Category, Subject } from '../../../services/category.service';

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
export class SubjectListComponent implements OnInit {
    categories: Category[] = [];
    
    subjectItems: SubjectItem[] = [];
    filteredSubjectItems: SubjectItem[] = [];
    paginatedSubjectItems: SubjectItem[] = [];

    isEditMode = false;
    editingId: string | null = null;
    searchTerm = '';
    selectedCategoryForSubject: string = '';
    editingSubjectCategoryId: string | null = null;
    editingSubjectIndex: number | null = null;
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

    constructor(private categoryService: CategoryService) {}

    ngOnInit(): void {
        this.categoryService.getCategories().subscribe(categories => {
            this.categories = categories;
            this.applyFilters();
        });
    }

    private createSubjectItems(): void {
        this.subjectItems = [];
        this.categories.forEach(category => {
            if (category.subjects && category.subjects.length > 0) {
                category.subjects.forEach((subject, index) => {
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
        this.editingSubjectIndex = null;
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

        // Nếu chọn "Other", tạo category mới
        if (this.selectedCategoryForSubject === 'other') {
            if (!this.newCategoryName.trim()) {
                alert('Vui lòng nhập tên danh mục mới');
                return;
            }

            // Tạo category mới với 1 subject mặc định
            const defaultSubject: Subject = {
                id: Date.now().toString(),
                name: 'General',
                description: '',
                isActive: true
            };

            this.categoryService.addCategory({
                name: this.newCategoryName.trim(),
                description: '',
                isActive: true,
                tutorCount: 0,
                subjects: [defaultSubject]
            });

            // Lấy ID của category vừa tạo
            const lastCategoryId = Math.max(...this.categories.map(c => parseInt(c.id) || 0)) + 1;
            categoryId = lastCategoryId.toString();
        }

        const newSubject: Subject = {
            id: this.editingId || Date.now().toString(),
            name: this.formData.name,
            description: this.formData.description || undefined,
            isActive: true
        };

        if (this.isEditMode && this.editingSubjectCategoryId && this.editingSubjectIndex !== null) {
            // Update existing subject
            this.categoryService.updateSubject(this.editingSubjectCategoryId, this.editingSubjectIndex, newSubject);
        } else {
            // Add new subject to category
            this.categoryService.addSubjectToCategory(categoryId, newSubject);
        }

        this.resetForm();
        this.showAddModal = false;
        this.applyFilters();
        alert(this.isEditMode ? 'Môn học đã được cập nhật' : 'Môn học đã được thêm');
    }

    applyFilters(): void {
        this.createSubjectItems();
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
        const subject = this.categories
            .flatMap(cat => cat.subjects)
            .find(sub => sub.id === subjectId);
        return subject?.tutorCount || 0;
    }

    editSubject(item: SubjectItem): void {
        if (!item.subject) return;

        this.isEditMode = true;
        this.editingId = item.subject.id;
        this.editingSubjectCategoryId = item.category.id;
        this.editingSubjectIndex = item.subjectIndex;
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

        this.categoryService.deleteSubjectFromCategory(item.category.id, item.subjectIndex);
        this.applyFilters();
    }

    toggleSubjectActive(item: SubjectItem): void {
        if (!item.subject) return;

        this.categoryService.toggleSubjectActive(item.category.id, item.subjectIndex);
        this.applyFilters();
    }

    openAddSubjectModal(): void {
        this.showAddModal = true;
        this.isEditMode = false;
        this.resetForm();
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

