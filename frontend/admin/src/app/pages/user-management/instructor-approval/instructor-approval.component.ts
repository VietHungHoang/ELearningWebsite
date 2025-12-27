import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService, TutorDetail,Tutor, InstructorRequest } from '../../../services/user.service';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { CareerEntry } from '../../../types/instructor';
import { LocaleUtilsService } from '../../../shared/utils/locale.utils';
import { I18nService } from '../../../i18n/i18n.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';


@Component({
    selector: 'app-instructor-approval',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, SearchInputComponent, TruncatePipe, TranslatePipe],
    templateUrl: './instructor-approval.component.html',
    styleUrl: './instructor-approval.component.scss'
})
export class InstructorApprovalComponent implements OnInit {
    // Tab management
    activeTab: 'pending' | 'requestEdit' | 'history' = 'pending';
    pendingRequests: InstructorRequest[] = [];
    requestEditRequests: InstructorRequest[] = [];
    historyRequests: InstructorRequest[] = [];

    filteredRequests: InstructorRequest[] = [];
    allFilteredRequests: InstructorRequest[] = [];
    searchTerm: string = '';

    // Pagination
    itemsPerPage = 5;
    currentPage = 1;
    totalRequests = 0;

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
        private i18nService: I18nService
    ) {
        this.searchPlaceholder = this.i18nService.translate('instructorApproval.searchPlaceholder');
        
        // Update placeholder when language changes
        effect(() => {
            this.i18nService.currentLanguage$();
            this.searchPlaceholder = this.i18nService.translate('instructorApproval.searchPlaceholder');
        });
    }

    get totalPendingRequests(): number {
        return this.pendingRequests.filter(r =>
            r.requestStatus === 'PENDING' || r.requestStatus === 'REQUEST_CHANGES'
        ).length;
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
        this.loadApprovalRequests();
    }

    switchTab(tab: 'pending' | 'requestEdit' | 'history'): void {
        this.activeTab = tab;
        this.selectedRequests.clear(); // Clear selections when switching tabs
        this.currentPage = 1;
        this.filterRequests();
    }

    loadApprovalRequests(): void {
        // Sử dụng dữ liệu thực từ service với API call
        this.userService.getInstructorRequests().subscribe(requests => {
            this.pendingRequests = requests;
            this.currentPage = 1;
            this.filterRequests();
        });
    }

    filterRequests(): void {
        // Select data based on active tab
        let source: InstructorRequest[] = [];

        switch (this.activeTab) {
            case 'pending':
                // Gộp cả PENDING và REQUEST_CHANGES vào tab Pending
                source = this.pendingRequests.filter(req =>
                    req.requestStatus === 'PENDING' || req.requestStatus === 'REQUEST_CHANGES'
                );
                break;
            case 'requestEdit':
                source = this.requestEditRequests;
                break;
            case 'history':
                source = this.historyRequests;
                break;
        }

        let filtered = source;

        if (this.searchTerm.trim()) {
            const term = this.searchTerm.toLowerCase().trim();
            filtered = filtered.filter(req =>
                req.name.toLowerCase().includes(term) ||
                (req.subjects && Array.isArray(req.subjects) &&
                 req.subjects.some(s => s.subjectName.toLowerCase().includes(term)))
            );
        }

        this.allFilteredRequests = filtered;
        this.totalRequests = filtered.length;
        this.applyPagination();
    }

    private applyPagination(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.filteredRequests = this.allFilteredRequests.slice(startIndex, endIndex);
    }

    onSearchChange(searchTerm?: string): void {
        if (searchTerm !== undefined) {
            this.searchTerm = searchTerm;
        }
        this.currentPage = 1;
        this.filterRequests();
    }

    viewProfile(request: InstructorRequest): void {
        this.router.navigate(['/dashboard/user-management/instructor-approval/profile', request.id]);
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.filterRequests();
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

    confirmApprove(): void {
        if (this.selectedRequest && this.selectedLevels.length > 0) {
            // Convert level IDs to codes before sending to backend
            const levelCodes = this.selectedLevels.map(levelId => {
                const level = this.levelOptions.find(l => l.id === levelId);
                return level ? level.code : levelId;
            });

            // Approve request via API
            this.userService.approveInstructorRequest(this.selectedRequest.id, levelCodes).subscribe(success => {
                if (success) {
                    // Xóa request khỏi danh sách pending
                    const index = this.pendingRequests.indexOf(this.selectedRequest!);
                    if (index >= 0) {
                        this.selectedRequest!.requestStatus = 'APPROVED';
                        this.historyRequests.push(this.selectedRequest!);
                        this.pendingRequests.splice(index, 1);
                    }

                    // Cập nhật filtered list
                    this.filterRequests();
                }
                this.closeLevelDialog();
            });
        }
    }

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
            this.userService.rejectInstructorRequest(this.requestToReject.id, finalReason).subscribe(success => {
                if (success) {
                    // Move request to history
                    const index = this.pendingRequests.indexOf(this.requestToReject!);
                    if (index >= 0) {
                        this.requestToReject!.requestStatus = 'REJECTED';
                        this.historyRequests.push(this.requestToReject!);
                        this.pendingRequests.splice(index, 1);
                    }

                    this.filterRequests();
                }
                this.closeRejectDialog();
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
            // Move request to requestEdit tab
            const index = this.pendingRequests.indexOf(this.requestToEdit);
            if (index >= 0) {
                this.requestToEdit.requestStatus = 'REQUEST_CHANGES';
                this.requestEditRequests.push(this.requestToEdit);
                this.pendingRequests.splice(index, 1);
            }

            this.filterRequests();
            this.closeEditRequestDialog();
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

    bulkRejectRequests(): void {
        if (this.selectedRequests.size === 0) return;

        if (confirm(`Reject ${this.selectedRequests.size} instructor application(s)?`)) {
            const rejectsToMove: InstructorRequest[] = [];
            const requestsToReject = Array.from(this.selectedRequests);

            // Call API for each rejection
            let completedCount = 0;
            requestsToReject.forEach(requestId => {
                const request = this.pendingRequests.find(r => r.id === requestId);
                if (request) {
                    this.userService.rejectInstructorRequest(requestId, 'Bulk rejected').subscribe(success => {
                        completedCount++;
                        if (success) {
                            request.requestStatus = 'REJECTED';
                            rejectsToMove.push(request);
                        }

                        // After all requests processed, update UI
                        if (completedCount === requestsToReject.length) {
                            this.pendingRequests = this.pendingRequests.filter(r => !this.selectedRequests.has(r.id));
                            this.historyRequests.push(...rejectsToMove);
                            this.selectedRequests.clear();
                            this.filterRequests();
                        }
                    });
                }
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
    get totalPages(): number {
        return Math.ceil(this.totalRequests / this.itemsPerPage);
    }

    get showingText(): string {
        if (this.totalRequests === 0) {
            return this.i18nService.translate('instructorApproval.pagination.showing', { start: 0, end: 0, total: 0 });
        }
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalRequests);
        return this.i18nService.translate('instructorApproval.pagination.showing', {
            start: startItem,
            end: endItem,
            total: this.totalRequests
        });
    }

    getSttNumber(index: number): number {
        // Calculate STT based on current page and items per page
        return (this.currentPage - 1) * this.itemsPerPage + index + 1;
    }

    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.applyPagination();
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.applyPagination();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.applyPagination();
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
}







