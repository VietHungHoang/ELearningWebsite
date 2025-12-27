import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReviewService, Review } from '../../../services/review.service';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { I18nService } from '../../../i18n/i18n.service';

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
        this.reviewService.getReviews().subscribe(reviews => {
            this.reviews = reviews;
            this.applyFilters();
        });
    }

    applyFilters(): void {
        if (this.activeTab === 'flagged') {
            // Tab 1: Show only flagged (visible + flagged) reviews
            this.filteredReviews = this.reviews.filter(r => {
                const isFlagged = r.isFlagged === true;
                const isVisible = r.status === 'visible'; // Visible = visible status
                const reasonMatch = this.selectedFlagReason === 'all' || r.flagReason === this.selectedFlagReason;
                return isFlagged && isVisible && reasonMatch;
            });
        } else {
            // Tab 2: Show all reviews with visibility filter
            this.filteredReviews = this.reviews.filter(r => {
                const visibilityMatch = this.selectedVisibility === 'all' ||
                    (this.selectedVisibility === 'visible' && r.status === 'visible') ||
                    (this.selectedVisibility === 'hidden' && r.status === 'hidden');
                const ratingMatch = this.selectedRating === 'all' || r.rating === this.selectedRating;
                const searchMatch = !this.searchQuery ||
                    r.learnerName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    r.tutorName.toLowerCase().includes(this.searchQuery.toLowerCase());
                return visibilityMatch && ratingMatch && searchMatch;
            });
        }
    }

    switchTab(tab: 'flagged' | 'all'): void {
        this.activeTab = tab;
        this.selectedReviews.clear();
        this.applyFilters();
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
        if (!this.selectedReviewForAction || !this.actionConfirmType) return;

        if (this.actionConfirmType === 'hide') {
            this.reviewService.hideReview(this.selectedReviewForAction.id);
            // Remove from review array
            this.reviews = this.reviews.map(r =>
                r.id === this.selectedReviewForAction!.id
                    ? { ...r, status: 'hidden', isFlagged: false }
                    : r
            );
        } else if (this.actionConfirmType === 'restore') {
            // Restore the review (make it visible again)
            this.reviewService.makeReviewVisible(this.selectedReviewForAction.id);
            this.reviews = this.reviews.map(r =>
                r.id === this.selectedReviewForAction!.id
                    ? { ...r, status: 'visible' as const, isFlagged: false }
                    : r
            );
        } else if (this.actionConfirmType === 'toggleVisibility') {
            // Toggle between visible and hidden
            const newStatus = this.selectedReviewForAction.status === 'hidden' ? 'visible' : 'hidden';
            if (newStatus === 'hidden') {
                this.reviewService.hideReview(this.selectedReviewForAction.id);
            } else {
                this.reviewService.makeReviewVisible(this.selectedReviewForAction.id);
            }
            this.reviews = this.reviews.map(r =>
                r.id === this.selectedReviewForAction!.id
                    ? { ...r, status: newStatus }
                    : r
            );
        }

        this.loadReviews();
        this.cancelAction();
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

    showBulkConfirmDialog(action: 'hide' | 'restore'): void {
        if (this.selectedReviews.size === 0) return;
        this.bulkConfirmType = action;
    }

    cancelBulkAction(): void {
        this.bulkConfirmType = null;
    }

    confirmBulkAction(): void {
        if (!this.bulkConfirmType || this.selectedReviews.size === 0) return;

        switch (this.bulkConfirmType) {
            case 'hide':
            this.selectedReviews.forEach(id => {
                this.reviewService.hideReview(id);
                this.reviews = this.reviews.map(r =>
                    r.id === id ? { ...r, status: 'hidden', isFlagged: false } : r
                );
            });
                break;
            case 'restore':
                this.selectedReviews.forEach(id => {
                    this.reviewService.makeReviewVisible(id);
                    this.reviews = this.reviews.map(r =>
                        r.id === id ? { ...r, status: 'visible' as const } : r
                    );
                });
                break;
        }

            this.selectedReviews.clear();
        this.bulkConfirmType = null;
            this.loadReviews();
        this.applyFilters();
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
