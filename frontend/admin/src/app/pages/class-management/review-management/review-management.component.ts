import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReviewService, Review } from '../../../services/review.service';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { I18nService } from '../../../i18n/i18n.service';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-review-management',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, SearchInputComponent, TranslatePipe],
    templateUrl: './review-management.component.html',
    styleUrl: './review-management.component.scss'
})
export class ReviewManagementComponent implements OnInit {
    reviews: Review[] = [];
    filteredReviews: Review[] = [];

    // New tab naming: 'flagged' (cần xử lý) vs 'all' (tất cả)
    activeTab: 'flagged' | 'all' = 'flagged';

    // Pagination
    itemsPerPage = 10;
    currentPage = 0; // 0-based for backend
    totalReviews = 0;
    totalPages = 1;
    loading = false;

    // Tab 1: Flagged Reviews (with flag status)
    selectedFlagReason: string = 'all';

    // Tab 2: All Reviews filters
    selectedVisibility: string = 'all'; // 'all', 'visible', 'hidden'
    selectedRating: number | 'all' = 'all';
    searchQuery: string = '';

    flagReasons = [
        { value: 'all', label: '' },
        { value: 'low_rating', label: '' },
        { value: 'bad_words', label: '' },
        { value: 'spam', label: '' }
    ];

    visibilityOptions = [
        { value: 'all', label: '' },
        { value: 'visible', label: '' },
        { value: 'hidden', label: '' }
    ];

    ratings = ['all', 1, 2, 3, 4, 5];

    isFlagReasonDropdownOpen = false;
    isVisibilityDropdownOpen = false;
    isRatingDropdownOpen = false;

    selectedReviewForAction: Review | null = null;
    actionConfirmType: 'hide' | 'restore' | 'toggleVisibility' | null = null;
    selectedReviewForDetail: Review | null = null;
    selectedReviews: Set<string> = new Set();
    bulkConfirmType: 'hide' | 'restore' | null = null;
    isProcessingAction = false; // Loading state for single action
    isProcessingBulk = false; // Loading state for bulk action

    Math = Math;

    constructor(
        private reviewService: ReviewService,
        private i18nService: I18nService
    ) {
        // React to language changes
        effect(() => {
            this.i18nService.currentLanguage$();
            this.initializeLabels();
        });
    }

    ngOnInit(): void {
        this.initializeLabels();
        this.loadReviews();
    }

    initializeLabels(): void {
        // Initialize flag reasons labels
        this.flagReasons = [
            { value: 'all', label: this.i18nService.translate('reviewManagement.filters.allReasons') },
            { value: 'low_rating', label: this.i18nService.translate('reviewManagement.filters.lowRating') },
            { value: 'bad_words', label: this.i18nService.translate('reviewManagement.filters.inappropriateLanguage') },
            { value: 'spam', label: this.i18nService.translate('reviewManagement.filters.spam') }
        ];

        // Initialize visibility options labels
        this.visibilityOptions = [
            { value: 'all', label: this.i18nService.translate('reviewManagement.filters.allStatus') },
            { value: 'visible', label: this.i18nService.translate('reviewManagement.status.visible') },
            { value: 'hidden', label: this.i18nService.translate('reviewManagement.status.hidden') }
        ];
    }

    loadReviews(): void {
        this.loading = true;
        const filters: any = {
            type: this.activeTab
        };

        if (this.activeTab === 'flagged') {
            if (this.selectedFlagReason && this.selectedFlagReason !== 'all') {
                filters.flagReason = this.selectedFlagReason;
            }
        } else {
            if (this.selectedVisibility && this.selectedVisibility !== 'all') {
                filters.visibility = this.selectedVisibility;
            }
            if (this.selectedRating && this.selectedRating !== 'all') {
                filters.rating = this.selectedRating;
            }
            if (this.searchQuery && this.searchQuery.trim()) {
                filters.search = this.searchQuery.trim();
            }
        }

        console.log('[ReviewManagement] loadReviews called:', { currentPage: this.currentPage, itemsPerPage: this.itemsPerPage, filters, activeTab: this.activeTab });
        
        this.reviewService.getReviews(this.currentPage, this.itemsPerPage, filters).subscribe(response => {
            console.log('[ReviewManagement] Received response:', {
                totalElements: response.totalElements,
                contentLength: response.content.length,
                content: response.content.map(r => ({ id: r.id, status: r.status, isFlagged: r.isFlagged }))
            });
            
            this.filteredReviews = response.content;
            this.reviews = response.content; // For backward compatibility
            this.totalReviews = response.totalElements;
            this.totalPages = response.totalPages;
            this.loading = false;
            
            console.log('[ReviewManagement] Updated component state:', {
                filteredReviewsLength: this.filteredReviews.length,
                totalReviews: this.totalReviews,
                totalPages: this.totalPages
            });
        });
    }

    applyFilters(): void {
        // Reset to first page when filters change
        this.currentPage = 0;
        this.loadReviews();
    }

    switchTab(tab: 'flagged' | 'all'): void {
        this.activeTab = tab;
        this.selectedReviews.clear();
        this.currentPage = 0;
        this.loadReviews();
    }

    selectFlagReason(reason: string): void {
        this.selectedFlagReason = reason;
        this.isFlagReasonDropdownOpen = false;
        this.applyFilters();
    }

    selectVisibility(visibility: string): void {
        this.selectedVisibility = visibility;
        this.isVisibilityDropdownOpen = false;
        this.applyFilters();
    }

    selectRating(rating: any): void {
        this.selectedRating = rating;
        this.isRatingDropdownOpen = false;
        this.applyFilters();
    }

    toggleFlagReasonDropdown(): void {
        this.isFlagReasonDropdownOpen = !this.isFlagReasonDropdownOpen;
    }

    toggleVisibilityDropdown(): void {
        this.isVisibilityDropdownOpen = !this.isVisibilityDropdownOpen;
    }

    toggleRatingDropdown(): void {
        this.isRatingDropdownOpen = !this.isRatingDropdownOpen;
    }

    getFlagReasonLabel(): string {
        const reason = this.flagReasons.find(r => r.value === this.selectedFlagReason);
        return reason ? reason.label : this.i18nService.translate('reviewManagement.filters.allReasons');
    }

    getVisibilityLabel(): string {
        const visibility = this.visibilityOptions.find(v => v.value === this.selectedVisibility);
        return visibility ? visibility.label : this.i18nService.translate('reviewManagement.filters.allStatus');
    }

    getRatingLabel(): string {
        return this.selectedRating === 'all' 
            ? this.i18nService.translate('reviewManagement.filters.allRatings')
            : `${this.selectedRating} ${this.i18nService.translate('reviewManagement.stars')}`;
    }

    getDisplayedRating(rating: any): string {
        return rating === 'all' 
            ? this.i18nService.translate('reviewManagement.filters.allRatings')
            : `${rating} ${this.i18nService.translate('reviewManagement.stars')}`;
    }

    getRatingStars(rating: number): string {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    // Actions for Tab 1: Flagged Reviews
    hideReview(review: Review): void {
        this.selectedReviewForAction = review;
        this.actionConfirmType = 'hide';
    }

    // Actions for Tab 2: All Reviews - toggle visibility
    toggleReviewVisibility(review: Review): void {
        this.selectedReviewForAction = review;
        this.actionConfirmType = 'toggleVisibility';
    }

    // Restore review (make visible again)
    restoreReview(review: Review): void {
        this.selectedReviewForAction = review;
        this.actionConfirmType = 'restore';
    }

    confirmAction(): void {
        if (!this.selectedReviewForAction || !this.actionConfirmType || this.isProcessingAction) return;

        this.isProcessingAction = true;
        let action$: Observable<boolean>;

        if (this.actionConfirmType === 'hide') {
            action$ = this.reviewService.hideReview(this.selectedReviewForAction.id);
        } else if (this.actionConfirmType === 'restore') {
            action$ = this.reviewService.makeReviewVisible(this.selectedReviewForAction.id);
        } else if (this.actionConfirmType === 'toggleVisibility') {
            // Toggle between visible and hidden
            const newStatus = this.selectedReviewForAction.status === 'hidden' ? 'visible' : 'hidden';
            action$ = newStatus === 'hidden' 
                ? this.reviewService.hideReview(this.selectedReviewForAction.id)
                : this.reviewService.makeReviewVisible(this.selectedReviewForAction.id);
        } else {
            this.isProcessingAction = false;
            return;
        }

        action$.subscribe({
            next: (success) => {
                this.isProcessingAction = false;
                if (success) {
                    this.loadReviews();
                    this.cancelAction();
                } else {
                    console.error('[ReviewManagement] Action failed');
                    // Keep dialog open on error, user can retry
                }
            },
            error: (error) => {
                console.error('[ReviewManagement] Action error:', error);
                this.isProcessingAction = false;
                // Keep dialog open on error, user can retry
            }
        });
    }

    cancelAction(): void {
        this.selectedReviewForAction = null;
        this.actionConfirmType = null;
    }

    viewReviewDetail(review: Review): void {
        this.selectedReviewForDetail = review;
    }

    closeReviewDetail(): void {
        this.selectedReviewForDetail = null;
    }

    onSearchChange(searchValue: string): void {
        this.searchQuery = searchValue;
        this.applyFilters();
    }

    getStatusText(status: string): string {
        return status === 'hidden' 
            ? this.i18nService.translate('reviewManagement.status.hidden')
            : this.i18nService.translate('reviewManagement.status.visible');
    }

    getStatusClass(status: string): string {
        return status === 'hidden' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700';
    }

    getActionConfirmMessage(): string {
        if (this.actionConfirmType === 'hide') {
            return this.i18nService.translate('reviewManagement.confirm.hideSingle');
        } else if (this.actionConfirmType === 'restore') {
            return this.i18nService.translate('reviewManagement.confirm.restoreSingle');
        } else if (this.actionConfirmType === 'toggleVisibility') {
            const willHide = this.selectedReviewForAction?.status !== 'hidden';
            return willHide
                ? this.i18nService.translate('reviewManagement.confirm.hideToggle')
                : this.i18nService.translate('reviewManagement.confirm.showToggle');
        }
        return '';
    }

    // Bulk actions
    toggleReviewSelection(reviewId: string): void {
        if (this.selectedReviews.has(reviewId)) {
            this.selectedReviews.delete(reviewId);
        } else {
            this.selectedReviews.add(reviewId);
        }
    }

    toggleSelectAllReviews(): void {
        if (this.selectedReviews.size === this.filteredReviews.length) {
            this.selectedReviews.clear();
        } else {
            this.filteredReviews.forEach(r => this.selectedReviews.add(r.id));
        }
    }

    isAllReviewsSelected(): boolean {
        return this.filteredReviews.length > 0 && this.selectedReviews.size === this.filteredReviews.length;
    }

    isReviewsIndeterminate(): boolean {
        return this.selectedReviews.size > 0 && this.selectedReviews.size < this.filteredReviews.length;
    }

    /**
     * Check if at least one selected review is hidden (can be restored)
     */
    canRestoreSelected(): boolean {
        if (this.selectedReviews.size === 0) return false;
        return Array.from(this.selectedReviews).some(reviewId => {
            const review = this.filteredReviews.find(r => r.id === reviewId);
            return review && review.status === 'hidden';
        });
    }

    /**
     * Check if at least one selected review is visible (can be hidden)
     */
    canHideSelected(): boolean {
        if (this.selectedReviews.size === 0) return false;
        return Array.from(this.selectedReviews).some(reviewId => {
            const review = this.filteredReviews.find(r => r.id === reviewId);
            return review && review.status === 'visible';
        });
    }

    showBulkConfirmDialog(action: 'hide' | 'restore'): void {
        if (this.selectedReviews.size === 0) return;
        // Additional check: only allow action if it's applicable
        if (action === 'restore' && !this.canRestoreSelected()) return;
        if (action === 'hide' && !this.canHideSelected()) return;
        this.bulkConfirmType = action;
    }

    cancelBulkAction(): void {
        this.bulkConfirmType = null;
    }

    confirmBulkAction(): void {
        if (!this.bulkConfirmType || this.selectedReviews.size === 0 || this.isProcessingBulk) return;

        this.isProcessingBulk = true;
        const reviewIds = Array.from(this.selectedReviews);
        const operations: Observable<boolean>[] = [];

        switch (this.bulkConfirmType) {
            case 'hide':
                reviewIds.forEach(id => {
                    operations.push(this.reviewService.hideReview(id));
                });
                break;
            case 'restore':
                reviewIds.forEach(id => {
                    operations.push(this.reviewService.makeReviewVisible(id));
                });
                break;
        }

        // Execute all operations in parallel
        if (operations.length > 0) {
            forkJoin(operations).subscribe({
                next: (results) => {
                    this.isProcessingBulk = false;
                    const successCount = results.filter(r => r === true).length;
                    const failCount = results.length - successCount;
                    
                    if (failCount > 0) {
                        console.warn(`[ReviewManagement] Bulk action completed: ${successCount} succeeded, ${failCount} failed`);
                    }
                    
                    // Reload data regardless of success/failure to sync with backend
                    this.selectedReviews.clear();
                    this.bulkConfirmType = null;
                    this.loadReviews();
                },
                error: (error) => {
                    console.error('[ReviewManagement] Bulk action error:', error);
                    this.isProcessingBulk = false;
                    // Still reload data and clear selection
                    this.selectedReviews.clear();
                    this.bulkConfirmType = null;
                    this.loadReviews();
                }
            });
        } else {
            this.isProcessingBulk = false;
            this.selectedReviews.clear();
            this.bulkConfirmType = null;
        }
    }

    getBulkConfirmMessage(): string {
        if (!this.bulkConfirmType) return '';
        const count = this.selectedReviews.size;
        
        switch (this.bulkConfirmType) {
            case 'hide':
                return this.i18nService.translate('reviewManagement.confirm.bulkHide', { count });
            case 'restore':
                return this.i18nService.translate('reviewManagement.confirm.bulkRestore', { count });
            default:
                return '';
        }
    }

    getBulkConfirmButtonText(): string {
        if (!this.bulkConfirmType) return '';
        
        switch (this.bulkConfirmType) {
            case 'hide':
                return this.i18nService.translate('reviewManagement.bulkActions.hide');
            case 'restore':
                return this.i18nService.translate('reviewManagement.bulkActions.restore');
            default:
                return this.i18nService.translate('common.confirm');
        }
    }

    formatFlagReason(reason?: string): string {
        if (!reason || reason === 'none') return '';
        const reasonMap: { [key: string]: string } = {
            'low_rating': this.i18nService.translate('reviewManagement.filters.lowRating'),
            'bad_words': this.i18nService.translate('reviewManagement.filters.inappropriateLanguage'),
            'spam': this.i18nService.translate('reviewManagement.filters.spam')
        };
        return reasonMap[reason] || reason;
        }

    getSttNumber(index: number): number {
        // Calculate STT based on current page and items per page
        // For now, just return index + 1 (assuming no pagination)
        return index + 1;
    }
}
