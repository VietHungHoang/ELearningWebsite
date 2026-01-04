import { Component, OnInit, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClassService, GroupClass, ClassStatus } from '../../../services/class.service';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { I18nService } from '../../../i18n/i18n.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SearchInputComponent, LoadingComponent, TranslatePipe],
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.scss'
})
export class ClassListComponent implements OnInit {
[x: string]: any;
  classes: GroupClass[] = [];
  paginatedClasses: GroupClass[] = [];

  isStatusDropdownOpen = false;

  selectedStatus: ClassStatus | 'all' = 'all';
  selectedDateRange = { start: '', end: '' };
  searchQuery = '';

  itemsPerPage = 5;
  currentPage = 0; // 0-based for backend
  totalClasses = 0;
  totalPages = 1;
  searchPlaceholder = '';
  loading = false;

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
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading = true;
    const filters: any = {};
    
    if (this.selectedStatus !== 'all') {
      filters.status = this.selectedStatus;
    }
    if (this.searchQuery.trim()) {
      filters.search = this.searchQuery.trim();
    }
    if (this.selectedDateRange.start) {
      filters.startDate = this.selectedDateRange.start;
    }
    if (this.selectedDateRange.end) {
      filters.endDate = this.selectedDateRange.end;
    }

    this.classService.getClasses(this.currentPage, this.itemsPerPage, filters).subscribe(response => {
      this.paginatedClasses = response.content;
      this.classes = response.content; // For backward compatibility
      this.totalClasses = response.totalElements;
      this.totalPages = response.totalPages;
      this.loading = false;
    });
  }

  toggleStatusDropdown(): void {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatus(status: ClassStatus | 'all'): void {
    this.selectedStatus = status;
    this.isStatusDropdownOpen = false;
    this.currentPage = 0;
    this.loadClasses();
  }


  applyDateRangeFilter(): void {
    if (this.selectedDateRange.start && this.selectedDateRange.end) {
      this.currentPage = 0;
      this.loadClasses();
    }
  }

  clearDateRangeFilter(): void {
    this.selectedDateRange = { start: '', end: '' };
    this.currentPage = 0;
    this.loadClasses();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 0;
    this.loadClasses();
  }

  goToPage(page: number): void {
    // Convert from 1-based to 0-based
    const zeroBasedPage = page - 1;
    if (zeroBasedPage >= 0 && zeroBasedPage < this.totalPages) {
      this.currentPage = zeroBasedPage;
      this.loadClasses();
    }
  }

  getStatusText(status: ClassStatus): string {
    // Normalize API status to UI status for i18n
    let normalizedStatus: 'upcoming' | 'ongoing' | 'completed';
    if (status === 'OPENING') {
      normalizedStatus = 'ongoing';
    } else if (status === 'CLOSED' || status === 'COMPLETED' || status === 'CANCELLED' || status === 'completed') {
      normalizedStatus = 'completed';
    } else if (status === 'ongoing') {
      normalizedStatus = 'ongoing';
    } else {
      normalizedStatus = 'upcoming';
    }
    return this.i18nService.translate(`classManagement.status.${normalizedStatus}`);
  }

  getClassTypeText(classType: string): string {
    if (classType === '1-on-1' || classType === 'ONE_ON_ONE') {
      return this.i18nService.translate('classManagement.table.typeValue.oneOnOne');
    } else if (classType === '1-on-n' || classType === 'GROUP') {
      return this.i18nService.translate('classManagement.table.typeValue.oneOnN');
    }
    return classType;
  }

  getSttNumber(index: number): number {
    return this.currentPage * this.itemsPerPage + index + 1;
  }

  getStatusClass(status: ClassStatus): string {
    // Normalize API status to UI status
    let normalizedStatus: 'upcoming' | 'ongoing' | 'completed';
    if (status === 'OPENING') {
      normalizedStatus = 'ongoing';
    } else if (status === 'CLOSED' || status === 'COMPLETED' || status === 'CANCELLED' || status === 'completed') {
      normalizedStatus = 'completed';
    } else if (status === 'ongoing') {
      normalizedStatus = 'ongoing';
    } else {
      normalizedStatus = 'upcoming';
    }

    const statusClasses: Record<'upcoming' | 'ongoing' | 'completed', string> = {
      upcoming: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      ongoing: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      completed: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300'
    };
    return statusClasses[normalizedStatus] || '';
  }

  formatCapacity(enrollment: number, max: number): string {
    return `${enrollment} / ${max}`;
  }

  formatDate(dateString: string | Date | undefined): string {
    if (!dateString) return 'N/A';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  getSelectedStatusText(): string {
    if (this.selectedStatus === 'all') {
      return this.i18nService.translate('classManagement.status.all');
    }
    return this.getStatusText(this.selectedStatus as ClassStatus);
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isStatusDropdownOpen = false;
    }
  }

  formatDateTime(date: Date): string {
    return this.classService.formatDateTime(date);
  }

  formatDuration(minutes: number): string {
    return this.classService.formatDuration(minutes);
  }

  getEndRange(): number {
    return Math.min((this.currentPage + 1) * this.itemsPerPage, this.totalClasses);
  }

  getStartRange(): number {
    return this.currentPage * this.itemsPerPage + 1;
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const maxVisible = 5;
    const currentPageOneBased = this.currentPage + 1; // Convert to 1-based for display

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPageOneBased - 2);
      const endPage = Math.min(this.totalPages, currentPageOneBased + 2);

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
