import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { CategoryService, Category, Subject } from '../../../services/category.service';

interface SubjectItem {
    category: Category;
    subject: Subject;
    subjectIndex: number;
    displayId: string;
}

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
    templateUrl: './category-list.component.html',
    styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
    categories: Category[] = [];

    filteredCategories: Category[] = [];

    subjectItems: SubjectItem[] = [];
    filteredSubjectItems: SubjectItem[] = [];
    paginatedSubjectItems: SubjectItem[] = [];

    // Tab management
    activeTab: 'subjects' | 'categories' = 'subjects';

    isEditMode = false;
    editingId: string | null = null;
    searchTerm = '';
    searchTermCategory = '';
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

    newSubjectName = '';
    newSubjectDescription = '';

    itemsPerPage = 5;
    currentPage = 1;
    paginatedCategories: Category[] = [];

    selectedStatus = 'All';
    isStatusDropdownOpen = false;

    selectedCategoryFilter = 'All';
    isCategoryFilterDropdownOpen = false;

    showDeleteConfirm = false;
    deleteConfirmId: string | null = null;
    showAddModal = false;

    showAddCategoryModal = false;
    categoryFormData = {
        name: '',
        description: ''
    };
    defaultSubjectName = '';

    // Category Details Modal
    showCategoryDetailsModal = false;
    selectedCategoryForDetail: Category | null = null;

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
            } else {
                // Nếu category không có subjects, vẫn hiển thị 1 dòng cho category
                this.subjectItems.push({
                    category: category,
                    subject: null as any,
                    subjectIndex: -1,
                    displayId: category.id
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
        this.newSubjectName = '';
        this.newSubjectDescription = '';
        this.selectedCategoryForSubject = '';
        this.newCategoryName = '';
        this.isEditMode = false;
        this.editingId = null;
    }

    editCategory(category: Category): void {
        this.isEditMode = true;
        this.editingId = category.id;
        this.formData = {
            name: category.name,
            description: category.description,
            image: category.image || null,
            subjects: [...category.subjects]
        };
        this.showAddModal = true;
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

            // Lấy ID của category vừa tạo (ID sẽ là index cuối cùng + 1)
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
        }
    }

    toggleActive(category: Category): void {
        this.categoryService.toggleActive(category.id);
        this.applyFilters();
    }

    openAddModal(): void {
        this.showAddModal = true;
        this.isEditMode = false;
        this.selectedCategoryForSubject = '';
        this.resetForm();
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

    toggleCategoryFilterDropdown(): void {
        this.isCategoryFilterDropdownOpen = !this.isCategoryFilterDropdownOpen;
    }

    filterByCategory(categoryName: string): void {
        this.selectedCategoryFilter = categoryName;
        this.isCategoryFilterDropdownOpen = false;
        this.currentPage = 1;
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

    getTutorCountForSubject(subjectId: string): number {
        const subject = this.categories
            .flatMap(cat => cat.subjects)
            .find(sub => sub.id === subjectId);
        return subject?.tutorCount || 0;
    }

    addSubject(): void {
        if (!this.newSubjectName.trim()) {
            alert('Tên môn học không được để trống');
            return;
        }

        const newSubject: Subject = {
            id: Date.now().toString(),
            name: this.newSubjectName.trim(),
            description: this.newSubjectDescription.trim() || undefined,
            isActive: true
        };

        this.formData.subjects.push(newSubject);
        this.newSubjectName = '';
        this.newSubjectDescription = '';
    }

    removeSubject(index: number): void {
        this.formData.subjects.splice(index, 1);
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

    min(a: number, b: number): number {
        return Math.min(a, b);
    }

    openAddSubjectModal(): void {
        this.showAddModal = true;
        this.isEditMode = false;
        this.editingId = null;
        this.formData = {
            name: '',
            description: '',
            image: null,
            subjects: []
        };
    }

    openAddCategoryModal(): void {
        this.showAddCategoryModal = true;
        this.categoryFormData = {
            name: '',
            description: ''
        };
    }

    closeAddCategoryModal(): void {
        this.showAddCategoryModal = false;
        this.categoryFormData = {
            name: '',
            description: ''
        };
        this.defaultSubjectName = '';
    }

    submitCategoryForm(): void {
        if (!this.categoryFormData.name.trim()) {
            alert('Tên danh mục không được để trống');
            return;
        }

        if (!this.defaultSubjectName.trim()) {
            alert('Tên subject mặc định không được để trống');
            return;
        }

        // Tạo subject mặc định
        const defaultSubject: Subject = {
            id: Date.now().toString(),
            name: this.defaultSubjectName.trim(),
            description: '',
            isActive: true
        };

        this.categoryService.addCategory({
            name: this.categoryFormData.name,
            description: this.categoryFormData.description,
            isActive: true,
            tutorCount: 0,
            subjects: [defaultSubject]
        });

        this.closeAddCategoryModal();
        alert('Danh mục và subject mặc định đã được thêm');
    }

    onCategoryChange(): void {
        // Method này chỉ để trigger change detection khi dropdown thay đổi
        // Để hiển thị/ẩn input "New Category Name"
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

    // Tab management
    switchTab(tab: 'subjects' | 'categories'): void {
        this.activeTab = tab;
    }

    // Get total tutors for a category
    getTutorCountForCategory(categoryId: string): number {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category || !category.subjects) return 0;

        let totalTutors = 0;
        category.subjects.forEach(subject => {
            if (subject.tutorCount) {
                totalTutors += subject.tutorCount;
            }
        });
        return totalTutors;
    }

    openCategoryDetailsModal(category: Category): void {
        this.selectedCategoryForDetail = category;
        this.showCategoryDetailsModal = true;
    }

    closeCategoryDetailsModal(): void {
        this.showCategoryDetailsModal = false;
        this.selectedCategoryForDetail = null;
    }
}

