import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService, TutorDetail,Tutor, InstructorRequest } from '../../../services/user.service';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';
import { CareerEntry } from '../../../types/instructor';
import { LocaleUtilsService } from '../../../shared/utils/locale.utils';
import { I18nService } from '../../../i18n/i18n.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { PaginatedResponse } from '../../../types/pagination';
import { SubjectHelperService } from '../../../services/subject-helper.service';


@Component({
    selector: 'app-tutor-approval',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, SearchInputComponent, TranslatePipe],
    templateUrl: './tutor-approval.component.html',
    styleUrl: './tutor-approval.component.scss'
})
export class TutorApprovalComponent implements OnInit {
    // Tab management
    activeTab: 'pending' | 'requestEdit' | 'history' = 'pending';

    // Data from API
    filteredRequests: InstructorRequest[] = [];
    searchTerm: string = '';

    // Filter properties
    selectedStatus: string = 'all';
    selectedSubject: string = 'all';

    // Pagination (from backend)
    itemsPerPage = 5;
    currentPage = 0; // 0-based for Spring Boot
    totalRequests = 0;
    totalPages = 0;

    showLevelDialog = false;
    selectedRequest: InstructorRequest | null = null;
    selectedLevels: string[] = [];

    showRejectDialog = false;
    requestToReject: InstructorRequest | null = null;
    rejectReason = '';
    customRejectReason = '';

    showEditRequestDialog = false;
    requestToEdit: InstructorRequest | null = null;
    editRequestReason = '';
    customEditReason = '';

    selectedRequests: Set<string> = new Set();
    searchPlaceholder = '';

    constructor(
        public userService: UserService,
        private router: Router,
        private localeUtils: LocaleUtilsService,
        private i18nService: I18nService,
        private subjectHelper: SubjectHelperService
    ) {
        this.searchPlaceholder = this.i18nService.translate('instructorApproval.searchPlaceholder');

        // Update placeholder when language changes
        effect(() => {
            this.i18nService.currentLanguage$();
            this.searchPlaceholder = this.i18nService.translate('instructorApproval.searchPlaceholder');
        });
    }

    get totalPendingRequests(): number {
        // This is now handled by backend, return 0 or remove if not needed
        return 0;
    }

    rejectionReasons = [
        'Chưa đủ tuổi (dưới 18)',
        'Thiếu thông tin cá nhân',
        'Ảnh đại diện không rõ ràng',
        'Chứng chỉ không hợp lệ',
        'Kinh nghiệm không đủ',
        'Thông tin chuyên môn không chính xác',
        'Vi phạm chính sách',
        'Khác'
    ];

    editRequestReasons = [
        'Cần bổ sung thông tin cá nhân',
        'Ảnh đại diện cần thay đổi',
        'Chứng chỉ cần cập nhật',
        'Thông tin kinh nghiệm cần chỉnh sửa',
        'Thông tin chuyên môn cần điều chỉnh',
        'Khác'
    ];

    showCertificationViewer = false;
    selectedInstructorForCerts: InstructorRequest | null = null;

    levelOptions = [
        { id: 'beginner', code: 'BEG', label: 'Beginner (Under 1 year)', icon: 'school' },
        { id: 'intermediate', code: 'INT', label: 'Intermediate (1-3 years)', icon: 'workspace_premium' },
        { id: 'senior', code: 'SNR', label: 'Senior (Over 3 years)', icon: 'military_tech' },
        { id: 'master', code: 'MST', label: 'Master (Master\'s Degree)', icon: 'workspace_premium' },
        { id: 'doctor', code: 'DCT', label: 'Doctor (PhD Degree)', icon: 'local_police' }
    ];


    getEducationEntries(request: InstructorRequest): CareerEntry[] {
        return request.careerEntries?.filter(entry => entry.type === 'EDUCATION') || [];
    }

    getExperienceEntries(request: InstructorRequest): CareerEntry[] {
        return request.careerEntries?.filter(entry => entry.type === 'EXPERIENCE') || [];
    }

    getLanguageDisplayText(lang: any): string {
        return this.localeUtils.getLanguageName(lang.languageCode);
    }

    ngOnInit(): void {
        // Load subjects first, then load approval requests
        console.log('[TutorApproval] Loading subjects...');
        this.subjectHelper.loadAndCacheSubjects().subscribe({
            next: (subjects) => {
                console.log('[TutorApproval] Subjects loaded:', subjects.length);
                this.loadApprovalRequests();
            },
            error: (error) => {
                console.error('[TutorApproval] Error loading subjects:', error);
                this.loadApprovalRequests(); // Still load requests even if subjects fail
            }
        });
    }

    switchTab(tab: 'pending' | 'requestEdit' | 'history'): void {
        this.activeTab = tab;
        this.selectedRequests.clear(); // Clear selections when switching tabs
        this.currentPage = 0; // Reset to first page (0-based)
        this.loadApprovalRequests();
    }

    loadApprovalRequests(): void {
        // Build params for API call
        const params: any = {
            page: this.currentPage,
            size: this.itemsPerPage
        };

        // Map activeTab to status filter
        // pending tab: show PENDING and REQUEST_CHANGES
        // requestEdit tab: show REQUEST_CHANGES
        // history tab: show APPROVED and REJECTED
        if (this.activeTab === 'pending') {
            // For pending tab, use status filter if selected, otherwise backend should return PENDING + REQUEST_CHANGES
            if (this.selectedStatus !== 'all') {
                params.status = this.selectedStatus;
            }
        } else if (this.activeTab === 'requestEdit') {
            params.status = 'edited'; // REQUEST_CHANGES
        } else if (this.activeTab === 'history') {
            // For history tab, backend should return APPROVED + REJECTED
            // Can add status filter if needed
        }

        // Add subject filter if not 'all'
        if (this.selectedSubject !== 'all') {
            params.subject = this.selectedSubject;
        }

        // Add search term if exists
        if (this.searchTerm.trim()) {
            params.search = this.searchTerm.trim();
        }

        // Call API with params
        this.userService.getInstructorRequests(params).subscribe({
            next: (response: PaginatedResponse<InstructorRequest>) => {
                this.filteredRequests = response.content;
                this.totalRequests = response.totalElements;
                this.totalPages = response.totalPages;
                this.currentPage = response.number; // Update current page from backend
            },
            error: (error) => {
                console.error('Error loading instructor requests:', error);
                this.filteredRequests = [];
                this.totalRequests = 0;
                this.totalPages = 0;
            }
        });
    }

    onSearchChange(searchTerm?: string): void {
        if (searchTerm !== undefined) {
            this.searchTerm = searchTerm;
        }
        this.currentPage = 0; // Reset to first page (0-based)
        this.loadApprovalRequests();
    }

    onFilterChange(): void {
        this.currentPage = 0; // Reset to first page (0-based)
        this.loadApprovalRequests();
    }

    clearFilters(): void {
        this.selectedStatus = 'all';
        this.selectedSubject = 'all';
        this.searchTerm = '';
        this.currentPage = 0; // Reset to first page (0-based)
        this.loadApprovalRequests();
    }

    getSubjectNames(request: InstructorRequest): string[] {
        if (request.subjectIds && request.subjectIds.length > 0) {
            const names = this.subjectHelper.getSubjectNamesByIds(request.subjectIds);
            console.log('[TutorApproval] Subject names for request', request.id, ':', names);
            return names;
        }
        return [];
    }

    viewProfile(request: InstructorRequest): void {
        this.router.navigate(['/dashboard/user-management/tutor-approval/profile', request.id]);
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.currentPage = 0; // Reset to first page (0-based)
        this.loadApprovalRequests();
    }

    viewCertification(request: InstructorRequest): void {
        this.selectedInstructorForCerts = request;
        this.showCertificationViewer = true;
    }

    closeCertificationViewer(): void {
        this.showCertificationViewer = false;
        this.selectedInstructorForCerts = null;
    }

    downloadCertification(fileUrl: string, fileName: string): void {
        // Tạo link download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    previewCertification(fileUrl: string): void {
        window.open(fileUrl, '_blank');
    }

    openLevelDialog(request: InstructorRequest): void {
        this.selectedRequest = request;
        this.selectedLevels = [];
        this.showLevelDialog = true;
    }

    closeLevelDialog(): void {
        this.showLevelDialog = false;
        this.selectedRequest = null;
        this.selectedLevels = [];
    }

    // COMMENTED: Level selection dialog methods
    /*
    confirmApprove(): void {
        if (this.selectedRequest && this.selectedLevels.length > 0) {
            // Convert level IDs to codes before sending to backend
            const levelCodes = this.selectedLevels.map(levelId => {
                const level = this.levelOptions.find(l => l.id === levelId);
                return level ? level.code : levelId;
            });

            // Approve request via API
            this.userService.approveInstructorRequest(this.selectedRequest.id, levelCodes).subscribe({
                next: (success) => {
                    if (success) {
                        // Reload data from API
                        this.loadApprovalRequests();
                    }
                    this.closeLevelDialog();
                },
                error: (error) => {
                    console.error('Error approving instructor request:', error);
                    this.closeLevelDialog();
                }
            });
        }
    }
    */

    openRejectDialog(request: InstructorRequest): void {
        this.requestToReject = request;
        this.showRejectDialog = true;
    }

    closeRejectDialog(): void {
        this.showRejectDialog = false;
        this.requestToReject = null;
        this.rejectReason = '';
        this.customRejectReason = '';
    }

    confirmReject(): void {
        const finalReason = this.rejectReason === 'Khác' ? this.customRejectReason : this.rejectReason;
        if (this.requestToReject && finalReason.trim()) {
            // Reject request via API
            this.userService.rejectInstructorRequest(this.requestToReject.id, finalReason).subscribe({
                next: (success) => {
                    if (success) {
                        // Reload data from API
                        this.loadApprovalRequests();
                    }
                    this.closeRejectDialog();
                },
                error: (error) => {
                    console.error('Error rejecting instructor request:', error);
                    this.closeRejectDialog();
                }
            });
        }
    }

    openEditRequestDialog(request: InstructorRequest): void {
        this.requestToEdit = request;
        this.showEditRequestDialog = true;
    }

    closeEditRequestDialog(): void {
        this.showEditRequestDialog = false;
        this.requestToEdit = null;
        this.editRequestReason = '';
        this.customEditReason = '';
    }

    confirmEditRequest(): void {
        const finalReason = this.editRequestReason === 'Khác' ? this.customEditReason : this.editRequestReason;
        if (this.requestToEdit && finalReason.trim()) {
            // Request edit via API
            this.userService.requestEditInstructorRequest(this.requestToEdit.id, finalReason).subscribe({
                next: (success) => {
                    if (success) {
                        // Reload data from API
                        this.loadApprovalRequests();
                    }
                    this.closeEditRequestDialog();
                },
                error: (error) => {
                    console.error('Error requesting edit for instructor:', error);
                    this.closeEditRequestDialog();
                }
            });
        }
    }

    toggleLevel(levelId: string): void {
        const index = this.selectedLevels.indexOf(levelId);
        if (index > -1) {
            this.selectedLevels.splice(index, 1);
        } else {
            this.selectedLevels.push(levelId);
        }
    }

    getLevelLabel(levelIds: string[]): string {
        if (!levelIds || levelIds.length === 0) return '';
        const labels = levelIds.map(id => {
            const level = this.levelOptions.find(l => l.id === id);
            return level ? level.label : '';
        }).filter(label => label);
        return labels.join(', ');
    }

    getLevelLabelByCodes(levelCodes: string[]): string {
        if (!levelCodes || levelCodes.length === 0) return '';
        const labels = levelCodes.map(code => {
            const level = this.levelOptions.find(l => l.code === code);
            return level ? level.label : code;
        }).filter(label => label);
        return labels.join(', ');
    }

    getLevelIcon(levelIds: string[]): string {
        if (!levelIds || levelIds.length === 0) return 'school';
        const level = this.levelOptions.find(l => l.id === levelIds[0]);
        return level ? level.icon : 'school';
    }

    toggleRequestSelection(requestId: string): void {
        if (this.selectedRequests.has(requestId)) {
            this.selectedRequests.delete(requestId);
        } else {
            this.selectedRequests.add(requestId);
        }
    }

    toggleSelectAllRequests(): void {
        if (this.selectedRequests.size === this.filteredRequests.length) {
            this.selectedRequests.clear();
        } else {
            this.filteredRequests.forEach(r => this.selectedRequests.add(r.id));
        }
    }

    isAllRequestsSelected(): boolean {
        return this.filteredRequests.length > 0 && this.selectedRequests.size === this.filteredRequests.length;
    }

    isRequestsIndeterminate(): boolean {
        return this.selectedRequests.size > 0 && this.selectedRequests.size < this.filteredRequests.length;
    }

    bulkApproveRequests(): void {
        if (this.selectedRequests.size === 0) return;

        if (confirm(`Approve ${this.selectedRequests.size} instructor application(s)?`)) {
            const requestsToApprove = Array.from(this.selectedRequests);

            // Call API for each approval - NO LEVELS
            let completedCount = 0;

            requestsToApprove.forEach(requestId => {
                this.userService.approveInstructorRequest(requestId).subscribe({
                    next: (success) => {
                        completedCount++;
                        if (completedCount === requestsToApprove.length) {
                            this.selectedRequests.clear();
                            this.loadApprovalRequests();
                        }
                    },
                    error: (error) => {
                        console.error('Error approving instructor request:', error);
                        completedCount++;
                        if (completedCount === requestsToApprove.length) {
                            this.selectedRequests.clear();
                            this.loadApprovalRequests();
                        }
                    }
                });
            });
        }
    }

    bulkRequestEditRequests(): void {
        if (this.selectedRequests.size === 0) return;

        if (confirm(`Request edit for ${this.selectedRequests.size} instructor application(s)?`)) {
            const requestsToEdit = Array.from(this.selectedRequests);

            // Call API for each edit request
            let completedCount = 0;
            const defaultReason = 'Yêu cầu chỉnh sửa thông tin';

            requestsToEdit.forEach(requestId => {
                this.userService.requestEditInstructorRequest(requestId, defaultReason).subscribe({
                    next: (success) => {
                        completedCount++;
                        if (completedCount === requestsToEdit.length) {
                            this.selectedRequests.clear();
                            this.loadApprovalRequests();
                        }
                    },
                    error: (error) => {
                        console.error('Error requesting edit for instructor request:', error);
                        completedCount++;
                        if (completedCount === requestsToEdit.length) {
                            this.selectedRequests.clear();
                            this.loadApprovalRequests();
                        }
                    }
                });
            });
        }
    }

    bulkRejectRequests(): void {
        if (this.selectedRequests.size === 0) return;

        if (confirm(`Reject ${this.selectedRequests.size} instructor application(s)?`)) {
            const requestsToReject = Array.from(this.selectedRequests);

            // Call API for each rejection
            let completedCount = 0;
            requestsToReject.forEach(requestId => {
                this.userService.rejectInstructorRequest(requestId, 'Bulk rejected').subscribe({
                    next: (success) => {
                        completedCount++;
                        if (completedCount === requestsToReject.length) {
                            this.selectedRequests.clear();
                            this.loadApprovalRequests();
                        }
                    },
                    error: (error) => {
                        console.error('Error rejecting instructor request:', error);
                        completedCount++;
                        if (completedCount === requestsToReject.length) {
                            this.selectedRequests.clear();
                            this.loadApprovalRequests();
                        }
                    }
                });
            });
        }
    }

    getSubjectsDisplay(instructor: TutorDetail): string {
        if (!instructor?.subjects || !Array.isArray(instructor.subjects) || instructor.subjects.length === 0) {
            return 'N/A';
        }
        return instructor.subjects.map(s => s.subjectName).join(', ');
    }

    getLanguagesDisplay(instructor: TutorDetail): string {
        if (!instructor?.languages || !Array.isArray(instructor.languages) || instructor.languages.length === 0) {
            return 'Not specified';
        }
        return instructor.languages.map(l => l.languageCode).join(', ');
    }

    // Pagination methods
    get showingText(): string {
        if (this.totalRequests === 0) {
            return this.i18nService.translate('instructorApproval.pagination.showing', { start: 0, end: 0, total: 0 });
        }
        // Convert 0-based page to 1-based for display
        const startItem = this.currentPage * this.itemsPerPage + 1;
        const endItem = Math.min((this.currentPage + 1) * this.itemsPerPage, this.totalRequests);
        return this.i18nService.translate('instructorApproval.pagination.showing', {
            start: startItem,
            end: endItem,
            total: this.totalRequests
        });
    }

    getSttNumber(index: number): number {
        // Calculate STT based on current page (0-based) and items per page
        return this.currentPage * this.itemsPerPage + index + 1;
    }

    goToPage(page: number): void {
        // page is 1-based from UI, convert to 0-based for API
        const pageIndex = page - 1;
        if (pageIndex < 0 || pageIndex >= this.totalPages) return;
        this.currentPage = pageIndex;
        this.loadApprovalRequests();
    }

    previousPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.loadApprovalRequests();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.loadApprovalRequests();
        }
    }

    get visiblePages(): number[] {
        const pages: number[] = [];
        const maxVisiblePages = 4;
        // Convert 0-based to 1-based for display
        const currentPage1Based = this.currentPage + 1;
        let startPage = Math.max(1, currentPage1Based - Math.floor(maxVisiblePages / 2));
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







