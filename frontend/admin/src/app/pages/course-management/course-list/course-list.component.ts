import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService, Course } from '../../../services/course.service';
import { UserService, Instructor } from '../../../services/user.service';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';

@Component({
    selector: 'app-course-list',
    standalone: true,
    imports: [RouterLink, CommonModule, SearchInputComponent],
    templateUrl: './course-list.component.html',
    styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {
    courses: Course[] = [];
    instructors: Instructor[] = [];
    isStatusDropdownOpen = false;
    isCategoryDropdownOpen = false;
    selectedStatus = 'All';
    selectedCategory = 'All';

    itemsPerPage = 5;
    currentPage = 1;
    totalCourses = 0;
    paginatedCourses: Course[] = [];

    constructor(
        public courseService: CourseService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.courseService.courses$.subscribe(courses => {
            this.courses = courses;
            this.totalCourses = courses.length;
            this.applyFilters();
        });

        this.userService.getInstructors().subscribe(instructors => {
            this.instructors = instructors;
        });
    }

    toggleStatusDropdown() {
        this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
    }

    toggleCategoryDropdown() {
        this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
    }

    filterByStatus(status: string) {
        this.selectedStatus = status;
        this.isStatusDropdownOpen = false;
        this.currentPage = 1; 
        this.applyFilters();
    }

    filterByCategory(category: string) {
        this.selectedCategory = category;
        this.isCategoryDropdownOpen = false;
        this.currentPage = 1; 
        this.applyFilters();
    }

    private applyFilters() {
        this.courseService.courses$.subscribe(allCourses => {
            let filteredCourses = [...allCourses];

            if (this.selectedStatus !== 'All') {
                filteredCourses = filteredCourses.filter(course => course.status === this.selectedStatus.toLowerCase());
            }

            if (this.selectedCategory !== 'All') {
                filteredCourses = filteredCourses.filter(course => course.category === this.selectedCategory);
            }

            this.totalCourses = filteredCourses.length;

            this.applyPagination(filteredCourses);
        });
    }

    onSearchCourses(searchTerm: string): void {
        if (searchTerm.trim()) {
            this.courseService.searchCourses(searchTerm).subscribe(filteredCourses => {

                let finalFiltered = [...filteredCourses];

                if (this.selectedStatus !== 'All') {
                    finalFiltered = finalFiltered.filter(course => course.status === this.selectedStatus.toLowerCase());
                }

                if (this.selectedCategory !== 'All') {
                    finalFiltered = finalFiltered.filter(course => course.category === this.selectedCategory);
                }

                this.totalCourses = finalFiltered.length;
                this.currentPage = 1;

                this.applyPagination(finalFiltered);
            });
        } else {

            this.applyFilters();
        }
    }

    deleteCourse(id: string): void {
        if (confirm('Are you sure you want to delete this course?')) {
            this.courseService.deleteCourse(id);
        }
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'approved':
                return 'bg-success-50 text-success-600';
            case 'pending':
                return 'bg-warning-50 text-warning-600';
            case 'rejected':
                return 'bg-danger-50 text-danger-600';
            default:
                return 'bg-gray-50 text-gray-600';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'approved':
                return 'Approved';
            case 'pending':
                return 'Pending';
            case 'rejected':
                return 'Rejected';
            default:
                return status;
        }
    }

    getInstructorId(instructorName: string): string | null {
        const instructor = this.instructors.find(inst => inst.name === instructorName);
        return instructor ? instructor.id : null;
    }

    private applyPagination(filteredCourses: Course[]): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedCourses = filteredCourses.slice(startIndex, endIndex);
        this.courses = this.paginatedCourses;
    }

    get totalPages(): number {
        return Math.ceil(this.totalCourses / this.itemsPerPage);
    }

    get showingText(): string {
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalCourses);
        return `Showing ${startItem}-${endItem} of ${this.totalCourses} results`;
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.applyFilters();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.applyFilters();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.applyFilters();
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

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.trezo-card-dropdown')) {
            this.isStatusDropdownOpen = false;
            this.isCategoryDropdownOpen = false;
        }
    }
}
