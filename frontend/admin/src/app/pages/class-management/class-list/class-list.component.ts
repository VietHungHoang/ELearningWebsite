import { Component, OnInit, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClassService, GroupClass, ClassStatus } from '../../../services/class.service';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';
import { I18nService } from '../../../i18n/i18n.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SearchInputComponent, TranslatePipe],
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.scss'
})
export class ClassListComponent implements OnInit {
[x: string]: any;
  classes: GroupClass[] = [];
  filteredClasses: GroupClass[] = [];
  paginatedClasses: GroupClass[] = [];

  isStatusDropdownOpen = false;
  isInstructorDropdownOpen = false;
  instructors: { id: string; name: string }[] = [];

  selectedStatus: ClassStatus | 'all' = 'all';
  selectedInstructor: string | 'all' = 'all';
  selectedDateRange = { start: '', end: '' };
  searchQuery = '';

  itemsPerPage = 5;
  currentPage = 1;
  totalClasses = 0;
  totalPages = 1;
  searchPlaceholder = '';

  constructor(
    private classService: ClassService,
    private i18nService: I18nService
  ) {
    this.searchPlaceholder = this.i18nService.translate('classManagement.searchPlaceholder');
    
    // Update placeholder when language changes
    effect(() => {
      this.i18nService.currentLanguage$();
      this.searchPlaceholder = this.i18nService.translate('classManagement.searchPlaceholder');
    });
  }

  ngOnInit(): void {
    this.classService.getAllClasses().subscribe(classes => {
      this.classes = classes;
      this.loadInstructors();
      this.applyFilters();
    });
  }

  loadInstructors(): void {
    this.classService.getInstructorsList().subscribe(instructors => {
      this.instructors = instructors;
    });
  }

  toggleStatusDropdown(): void {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  toggleInstructorDropdown(): void {
    this.isInstructorDropdownOpen = !this.isInstructorDropdownOpen;
  }

  selectStatus(status: ClassStatus | 'all'): void {
    this.selectedStatus = status;
    this.isStatusDropdownOpen = false;
    this.currentPage = 1;
    this.applyFilters();
  }

  selectInstructor(instructorId: string | 'all'): void {
    this.selectedInstructor = instructorId;
    this.isInstructorDropdownOpen = false;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyDateRangeFilter(): void {
    if (this.selectedDateRange.start && this.selectedDateRange.end) {
      const startDate = new Date(this.selectedDateRange.start);
      const endDate = new Date(this.selectedDateRange.end);
      endDate.setHours(23, 59, 59, 999);

      this.classService.getClassesByDateRange(startDate, endDate).subscribe(classes => {
        this.classes = classes;
        this.currentPage = 1;
        this.applyFilters();
      });
    }
  }

  clearDateRangeFilter(): void {
    this.selectedDateRange = { start: '', end: '' };
    this.classService.getAllClasses().subscribe(classes => {
      this.classes = classes;
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.classes];

    if (this.selectedStatus !== 'all') {
      result = result.filter(c => c.status === this.selectedStatus);
    }

    if (this.searchQuery.trim()) {
      const lowerQuery = this.searchQuery.toLowerCase();
      result = result.filter(c =>
        c.class_name.toLowerCase().includes(lowerQuery) ||
        c.instructor_name.toLowerCase().includes(lowerQuery)
      );
    }

    this.filteredClasses = result;
    this.totalClasses = result.length;
    this.totalPages = Math.ceil(this.totalClasses / this.itemsPerPage);
    this.updatePaginatedClasses();
  }

  updatePaginatedClasses(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedClasses = this.filteredClasses.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedClasses();
    }
  }

  getStatusText(status: ClassStatus): string {
    return this.i18nService.translate(`classManagement.status.${status}`);
  }

  getClassTypeText(classType: string): string {
    if (classType === '1-on-1') {
      return this.i18nService.translate('classManagement.table.typeValue.oneOnOne');
    } else if (classType === '1-on-n') {
      return this.i18nService.translate('classManagement.table.typeValue.oneOnN');
    }
    return classType;
  }

  getSttNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }

  getStatusClass(status: ClassStatus): string {
    const statusClasses = {
      upcoming: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      ongoing: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      completed: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300'
    };
    return statusClasses[status] || '';
  }

  formatCapacity(enrollment: number, max: number): string {
    return `${enrollment} / ${max}`;
  }

  getSelectedStatusText(): string {
    if (this.selectedStatus === 'all') {
      return this.i18nService.translate('classManagement.status.all');
    }
    return this.getStatusText(this.selectedStatus as ClassStatus);
  }

  getSelectedInstructorText(): string {
    if (this.selectedInstructor === 'all') return 'All Instructors';
    const instructor = this.instructors.find(i => i.id === this.selectedInstructor);
    return instructor ? instructor.name : 'All Instructors';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isStatusDropdownOpen = false;
      this.isInstructorDropdownOpen = false;
    }
  }

  formatDateTime(date: Date): string {
    return this.classService.formatDateTime(date);
  }

  formatDuration(minutes: number): string {
    return this.classService.formatDuration(minutes);
  }

  getEndRange(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalClasses);
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, this.currentPage + 2);

      if (startPage > 1) {
        visiblePages.push(1);
        if (startPage > 2) {
          visiblePages.push(-1);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }

      if (endPage < this.totalPages) {
        if (endPage < this.totalPages - 1) {
          visiblePages.push(-1);
        }
        visiblePages.push(this.totalPages);
      }
    }

    return visiblePages;
  }
}
