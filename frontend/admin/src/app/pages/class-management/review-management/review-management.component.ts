import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReviewService, Review } from '../../../services/review.service';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';

@Component({
    selector: 'app-review-management',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, SearchInputComponent],
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
        { value: 'all', label: 'All Reasons' },
        { value: 'low_rating', label: '1-2 Stars' },
        { value: 'bad_words', label: 'Inappropriate Language' },
        { value: 'spam', label: 'Spam/Advertising' }
    ];

    visibilityOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'visible', label: 'Visible' },
        { value: 'hidden', label: 'Hidden' }
    ];

    ratings = ['all', 1, 2, 3, 4, 5];

    summary: any = {};

    isFlagReasonDropdownOpen = false;
    isVisibilityDropdownOpen = false;
    isRatingDropdownOpen = false;

    selectedReviewForAction: Review | null = null;
    actionConfirmType: 'hide' | 'unflag' | 'toggleVisibility' | null = null;
    selectedReviewForDetail: Review | null = null;
    selectedReviews: Set<string> = new Set();

    Math = Math;

    constructor(private reviewService: ReviewService) {}

    ngOnInit(): void {
        this.loadReviews();
        this.loadSummary();
    }

    loadReviews(): void {
        this.reviewService.getReviews().subscribe(reviews => {
            this.reviews = reviews;
            this.applyFilters();
        });
    }

    loadSummary(): void {
        this.summary = this.reviewService.getSummary();
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
        return reason ? reason.label : 'All Reasons';
    }

    getVisibilityLabel(): string {
        const visibility = this.visibilityOptions.find(v => v.value === this.selectedVisibility);
        return visibility ? visibility.label : 'All Status';
    }

    getRatingLabel(): string {
        return this.selectedRating === 'all' ? 'All Ratings' : `${this.selectedRating} Stars`;
    }

    getDisplayedRating(rating: any): string {
        return rating === 'all' ? 'All Ratings' : `${rating} Stars`;
    }

    getRatingStars(rating: number): string {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    // Actions for Tab 1: Flagged Reviews
    hideReview(review: Review): void {
        this.selectedReviewForAction = review;
        this.actionConfirmType = 'hide';
    }

    unflagReview(review: Review): void {
        this.selectedReviewForAction = review;
        this.actionConfirmType = 'unflag';
    }

    // Actions for Tab 2: All Reviews - toggle visibility
    toggleReviewVisibility(review: Review): void {
        this.selectedReviewForAction = review;
        this.actionConfirmType = 'toggleVisibility';
    }

    // Restore hidden review (make visible)
    restoreReview(review: Review): void {
        this.selectedReviewForAction = review;
        this.actionConfirmType = 'toggleVisibility';
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
        } else if (this.actionConfirmType === 'unflag') {
            // Unflag the review (remove flag but keep it visible)
            this.reviewService.unflagReview(this.selectedReviewForAction.id);
            this.reviews = this.reviews.map(r =>
                r.id === this.selectedReviewForAction!.id
                    ? { ...r, isFlagged: false }
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
        this.loadSummary();
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
        return status === 'hidden' ? 'Hidden' : 'Visible';
    }

    getStatusClass(status: string): string {
        return status === 'hidden' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700';
    }

    getActionConfirmMessage(): string {
        if (this.actionConfirmType === 'hide') {
            return 'Hide this review? It will no longer be visible to users.';
        } else if (this.actionConfirmType === 'unflag') {
            return 'Mark as processed? The flag will be removed.';
        } else if (this.actionConfirmType === 'toggleVisibility') {
            const willHide = this.selectedReviewForAction?.status !== 'hidden';
            return willHide
                ? 'Hide this review?'
                : 'Make this review visible again?';
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

    bulkHideReviews(): void {
        if (this.selectedReviews.size === 0) return;

        if (confirm(`Hide ${this.selectedReviews.size} review(s)?`)) {
            this.selectedReviews.forEach(id => {
                this.reviewService.hideReview(id);
                this.reviews = this.reviews.map(r =>
                    r.id === id ? { ...r, status: 'hidden', isFlagged: false } : r
                );
            });
            this.selectedReviews.clear();
            this.loadReviews();
            this.loadSummary();
        }
    }

    bulkUnflagReviews(): void {
        if (this.selectedReviews.size === 0) return;

        if (confirm(`Mark ${this.selectedReviews.size} review(s) as processed?`)) {
            this.selectedReviews.forEach(id => {
                this.reviews = this.reviews.map(r =>
                    r.id === id ? { ...r, isFlagged: false } : r
                );
            });
            this.selectedReviews.clear();
            this.applyFilters();
        }
    }
}
