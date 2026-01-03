import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PaginatedResponse } from '../types/pagination';

export interface Review {
    id: string;
    rating: number;
    learnerId: string;
    learnerName: string;
    tutorId: string;
    tutorName: string;
    classId: string;
    classTitle: string;
    content: string;
    status: 'visible' | 'hidden'; // visible = công khai, hidden = đã ẩn
    isFlagged?: boolean; // true = needs moderation, false/undefined = already processed
    flagReason?: 'low_rating' | 'bad_words' | 'spam' | 'none';
    tutorReply?: string;
    createdDate: string;
    updatedDate?: string;
}

export interface ReviewFilters {
    type: 'flagged' | 'all';
    flagReason?: 'bad_words' | 'spam' | 'ai_content' | 'all';
    visibility?: 'all' | 'visible' | 'hidden';
    rating?: number | 'all';
    search?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private reviewsSubject = new BehaviorSubject<Review[]>([]);
    public reviews$ = this.reviewsSubject.asObservable();

    private mockReviews: Review[] = [];

    constructor(private apiService: ApiService) {
        this.loadMockData();
    }

    private loadMockData(): void {
        const mockReviews: Review[] = [
            {
                id: 'review_001',
                rating: 1,
                learnerId: 'learner_001',
                learnerName: 'Nguyễn Nam Sơn',
                tutorId: 'tutor_001',
                tutorName: 'Dr. Sarah',
                classId: 'session_001',
                classTitle: '#1256 - Tiếng Anh Giao tiếp',
                content: 'Gia sư đến muộn 15 phút và không có lời xin lỗi nào. Thái độ dạy rất hời hợt. Tôi muốn hoàn tiền ngay lập tức! Đừng học người này.',
                status: 'visible',
                isFlagged: true,
                flagReason: 'low_rating',
                tutorReply: undefined,
                createdDate: '2025-11-18 14:30:45'
            },
            {
                id: 'review_002',
                rating: 5,
                learnerId: 'learner_002',
                learnerName: 'Trần Thị Mai',
                tutorId: 'tutor_002',
                tutorName: 'Michael',
                classId: 'session_002',
                classTitle: '#1257 - Toán học nâng cao',
                content: 'Cô dạy rất hay, dễ hiểu. Giải thích chi tiết từng bước. Tôi rất hài lòng!',
                status: 'visible',
                isFlagged: false,
                flagReason: 'none',
                tutorReply: 'Cảm ơn bạn! Tôi rất vui vì bạn hài lòng với bài dạy.',
                createdDate: '2025-11-17 10:15:22'
            },
            {
                id: 'review_003',
                rating: 1,
                learnerId: 'learner_003',
                learnerName: 'Phạm Minh Đức',
                tutorId: 'tutor_003',
                tutorName: 'Javier',
                classId: 'session_003',
                classTitle: '#1258 - Tiếng Tây Ban Nha cho người mới',
                content: 'Thằng này dạy cái quỷ gì vậy. Chửi học viên suốt buổi. Toang hết!',
                status: 'visible',
                isFlagged: true,
                flagReason: 'bad_words',
                tutorReply: undefined,
                createdDate: '2025-11-16 09:45:18'
            },
            {
                id: 'review_004',
                rating: 4,
                learnerId: 'learner_004',
                learnerName: 'Hoàng Thị Linh',
                tutorId: 'tutor_001',
                tutorName: 'Dr. Sarah',
                classId: 'session_004',
                classTitle: '#1259 - Luyện thi TOEFL',
                content: 'Rất chuyên nghiệp, nhưng hơi đắt so với giá thị trường.',
                status: 'visible',
                isFlagged: false,
                flagReason: 'none',
                tutorReply: 'Cảm ơn phản hồi của bạn. Chúng tôi cung cấp giảm giá cho khóa dài hạn.',
                createdDate: '2025-11-15 16:20:33'
            },
            {
                id: 'review_005',
                rating: 2,
                learnerId: 'learner_005',
                learnerName: 'Võ Văn Quang',
                tutorId: 'tutor_004',
                tutorName: 'Emma',
                classId: 'session_005',
                classTitle: '#1260 - Python cơ bản',
                content: 'Không hiểu gì cả. Gia sư không giải thích kỹ lưỡng.',
                status: 'visible',
                isFlagged: true,
                flagReason: 'low_rating',
                tutorReply: undefined,
                createdDate: '2025-11-14 11:05:50'
            },
            {
                id: 'review_006',
                rating: 5,
                learnerId: 'learner_006',
                learnerName: 'Lý Thị Hương',
                tutorId: 'tutor_002',
                tutorName: 'Michael',
                classId: 'session_006',
                classTitle: '#1261 - Hóa học đại cương',
                content: 'Tuyệt vời! Bài dạy rất sinh động. Tôi đã tiến bộ rất nhiều.',
                status: 'visible',
                isFlagged: false,
                flagReason: 'none',
                tutorReply: 'Rất vui biết tin bạn tiến bộ! Cố gắng tiếp tục nhé!',
                createdDate: '2025-11-13 13:40:12'
            },
            {
                id: 'review_007',
                rating: 1,
                learnerId: 'learner_007',
                learnerName: 'Đinh Văn Khánh',
                tutorId: 'tutor_003',
                tutorName: 'Javier',
                classId: 'session_007',
                classTitle: '#1262 - Tiếng Tây Ban Nha nâng cao',
                content: '⭐⭐⭐⭐⭐ BUY CHEAP COURSES HERE >>> link-spam.com ⭐⭐⭐⭐⭐',
                status: 'visible',
                isFlagged: true,
                flagReason: 'spam',
                tutorReply: undefined,
                createdDate: '2025-11-12 08:25:07'
            },
            {
                id: 'review_008',
                rating: 3,
                learnerId: 'learner_008',
                learnerName: 'Ngô Thị Lan',
                tutorId: 'tutor_001',
                tutorName: 'Dr. Sarah',
                classId: 'session_008',
                classTitle: '#1263 - Business English',
                content: 'Bình thường. Không có gì đặc biệt nhưng cũng ổn.',
                status: 'visible',
                isFlagged: false,
                flagReason: 'none',
                tutorReply: undefined,
                createdDate: '2025-11-11 15:55:41'
            },
            {
                id: 'review_009',
                rating: 2,
                learnerId: 'learner_009',
                learnerName: 'Trịnh Văn Tuấn',
                tutorId: 'tutor_004',
                tutorName: 'Emma',
                classId: 'session_009',
                classTitle: '#1264 - JavaScript advanced',
                content: 'Nội dung quá phức tạp. Không phù hợp cho người mới bắt đầu.',
                status: 'hidden',
                isFlagged: false,
                flagReason: 'none',
                tutorReply: undefined,
                createdDate: '2025-11-10 12:30:28'
            },
            {
                id: 'review_010',
                rating: 5,
                learnerId: 'learner_010',
                learnerName: 'Tạ Thị Thảo',
                tutorId: 'tutor_003',
                tutorName: 'Javier',
                classId: 'session_010',
                classTitle: '#1265 - Văn hóa Tây Ban Nha',
                content: 'Gia sư rất thân thiện và có kiến thức sâu về văn hóa. Tôi yêu thích bài dạy này!',
                status: 'visible',
                isFlagged: false,
                flagReason: 'none',
                tutorReply: 'Cảm ơn bạn! Rất hạnh phúc khi bạn thích bài dạy.',
                createdDate: '2025-11-09 17:12:55'
            }
        ];

        this.mockReviews = mockReviews;
        this.reviewsSubject.next(mockReviews);
    }

    /**
     * Get paginated reviews with filters
     * @param page Page number (0-based)
     * @param size Page size
     * @param filters Filter options
     * @returns Observable of paginated reviews
     */
    getReviews(page: number = 0, size: number = 10, filters?: ReviewFilters): Observable<PaginatedResponse<Review>> {
        const params: any = {
            page,
            size
        };

        if (filters) {
            params.type = filters.type;

            if (filters.type === 'flagged') {
                if (filters.flagReason && filters.flagReason !== 'all') {
                    params.flagReason = filters.flagReason;
                }
            } else if (filters.type === 'all') {
                if (filters.visibility && filters.visibility !== 'all') {
                    params.visibility = filters.visibility;
                }
                if (filters.rating && filters.rating !== 'all') {
                    params.rating = filters.rating;
                }
                if (filters.search && filters.search.trim()) {
                    params.search = filters.search.trim();
                }
            }
        }

        console.log('[ReviewService] getReviews called:', { page, size, filters, params });

        return this.apiService.get<PaginatedResponse<Review>>('/reviews', params).pipe(
            map(response => {
                console.log('[ReviewService] API response:', response);
                if (response.success && response.data) {
                    console.log('[ReviewService] API success - data received:', {
                        totalElements: response.data.totalElements,
                        contentLength: response.data.content.length,
                        content: response.data.content.map(r => ({ id: r.id, status: r.status, isFlagged: r.isFlagged }))
                    });
                    return response.data;
                }
                console.warn('[ReviewService] API failed, returning mock data:', response.message);
                const mockResponse = this.getMockPaginatedResponse(page, size, filters);
                console.log('[ReviewService] Mock data response:', {
                    totalElements: mockResponse.totalElements,
                    contentLength: mockResponse.content.length,
                    content: mockResponse.content.map(r => ({ id: r.id, status: r.status, isFlagged: r.isFlagged }))
                });
                return mockResponse;
            }),
            catchError(error => {
                console.error('[ReviewService] API error, returning mock data:', error);
                const mockResponse = this.getMockPaginatedResponse(page, size, filters);
                console.log('[ReviewService] Mock data response (error fallback):', {
                    totalElements: mockResponse.totalElements,
                    contentLength: mockResponse.content.length,
                    content: mockResponse.content.map(r => ({ id: r.id, status: r.status, isFlagged: r.isFlagged }))
                });
                return of(mockResponse);
            })
        );
    }

    /**
     * Get all reviews (for backward compatibility)
     * @deprecated Use getReviews() instead
     */
    getReviewsOld(): Observable<Review[]> {
        return this.reviews$;
    }

    /**
     * Get mock paginated response
     */
    private getMockPaginatedResponse(page: number, size: number, filters?: ReviewFilters): PaginatedResponse<Review> {
        console.log('[ReviewService] getMockPaginatedResponse called:', { page, size, filters });
        console.log('[ReviewService] Mock reviews before filter:', this.mockReviews.map(r => ({ id: r.id, status: r.status, isFlagged: r.isFlagged })));

        let filtered = [...this.mockReviews];

        // Apply filters
        if (filters) {
            if (filters.type === 'flagged') {
                // Tab "flagged": Show all flagged reviews (both visible and hidden)
                // They will be displayed with appropriate badge
                console.log('[ReviewService] Filtering for flagged tab - before filter:', filtered.length);
                filtered = filtered.filter(r => r.isFlagged === true);
                console.log('[ReviewService] After isFlagged filter:', filtered.length, filtered.map(r => ({ id: r.id, status: r.status, isFlagged: r.isFlagged })));
                if (filters.flagReason && filters.flagReason !== 'all') {
                    filtered = filtered.filter(r => r.flagReason === filters.flagReason);
                    console.log('[ReviewService] After flagReason filter:', filtered.length);
                }
            } else if (filters.type === 'all') {
                // Tab "all": Show all reviews (visible and hidden) unless filtered by visibility
                console.log('[ReviewService] Filtering for all tab - before filter:', filtered.length);
                if (filters.visibility && filters.visibility !== 'all') {
                    filtered = filtered.filter(r => r.status === filters.visibility);
                    console.log('[ReviewService] After visibility filter:', filtered.length);
                }
                if (filters.rating && filters.rating !== 'all') {
                    filtered = filtered.filter(r => r.rating === filters.rating);
                    console.log('[ReviewService] After rating filter:', filtered.length);
                }
                if (filters.search && filters.search.trim()) {
                    const lowerQuery = filters.search.toLowerCase();
                    filtered = filtered.filter(r =>
                        r.learnerName.toLowerCase().includes(lowerQuery) ||
                        r.tutorName.toLowerCase().includes(lowerQuery) ||
                        r.content.toLowerCase().includes(lowerQuery)
                    );
                    console.log('[ReviewService] After search filter:', filtered.length);
                }
            }
        }

        console.log('[ReviewService] Filtered reviews after all filters:', filtered.length, filtered.map(r => ({ id: r.id, status: r.status, isFlagged: r.isFlagged })));

        // Paginate
        const totalElements = filtered.length;
        const totalPages = Math.ceil(totalElements / size);
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const content = filtered.slice(startIndex, endIndex);

        return {
            content,
            pageable: {
                pageNumber: page,
                pageSize: size,
                offset: startIndex,
                paged: true
            },
            totalPages,
            totalElements,
            last: page >= totalPages - 1,
            first: page === 0,
            numberOfElements: content.length,
            size,
            number: page,
            empty: content.length === 0
        };
    }

    // Get flagged reviews (for moderation queue)
    getFlaggedReviews(): Review[] {
        return this.reviewsSubject.value.filter(r => r.isFlagged === true && r.status === 'visible');
    }

    // Get visible reviews count
    getVisibleReviewsCount(): number {
        return this.reviewsSubject.value.filter(r => r.status === 'visible').length;
    }

    // Get review by id
    getReviewById(id: string): Review | undefined {
        return this.reviewsSubject.value.find(r => r.id === id);
    }

    /**
     * Make review visible (restore)
     * @param id Review ID
     * @returns Observable<boolean> - true if successful, false otherwise
     */
    makeReviewVisible(id: string): Observable<boolean> {
        if (!id || id.trim() === '') {
            console.error('[ReviewService] Invalid review ID:', id);
            return of(false);
        }

        console.log('[ReviewService] Making review visible:', id);
        return this.apiService.patch<boolean>(`/reviews/${id}/visible`, {}).pipe(
            map(response => {
                if (response.success) {
                    // Update local mock data for fallback
                    const review = this.mockReviews.find(r => r.id === id);
                    if (review) {
                        console.log('[ReviewService] Before making visible - review:', { id: review.id, status: review.status, isFlagged: review.isFlagged });
                        review.status = 'visible';
                        // Keep isFlagged as is - don't change it when making visible
                        review.updatedDate = this.getCurrentDate();
                        console.log('[ReviewService] After making visible - review:', { id: review.id, status: review.status, isFlagged: review.isFlagged });
                    } else {
                        console.warn('[ReviewService] Review not found in mock data:', id);
                    }
                    console.log('[ReviewService] Review made visible successfully:', id);
                    return true;
                }
                console.warn('[ReviewService] API returned unsuccessful response:', response.message);
                // Update local mock data for fallback
                const review = this.mockReviews.find(r => r.id === id);
                if (review) {
                    console.log('[ReviewService] Before making visible (unsuccessful) - review:', { id: review.id, status: review.status, isFlagged: review.isFlagged });
                    review.status = 'visible';
                    // Keep isFlagged as is - don't change it when making visible
                    review.updatedDate = this.getCurrentDate();
                    console.log('[ReviewService] After making visible (unsuccessful) - review:', { id: review.id, status: review.status, isFlagged: review.isFlagged });
                }
                return false;
            }),
            catchError(error => {
                console.error('[ReviewService] API error making review visible:', error);
                // Update local mock data for fallback
                const review = this.mockReviews.find(r => r.id === id);
                if (review) {
                    console.log('[ReviewService] Before making visible (error) - review:', { id: review.id, status: review.status, isFlagged: review.isFlagged });
                    review.status = 'visible';
                    // Keep isFlagged as is - don't change it when making visible
                    review.updatedDate = this.getCurrentDate();
                    console.log('[ReviewService] After making visible (error) - review:', { id: review.id, status: review.status, isFlagged: review.isFlagged });
                }
                return of(false);
            })
        );
    }

    // Unflag review (mark as processed, keep it visible)
    unflagReview(id: string): boolean {
        const reviews = this.reviewsSubject.value;
        const review = reviews.find(r => r.id === id);
        if (!review) return false;

        review.isFlagged = false;
        review.updatedDate = this.getCurrentDate();
        this.reviewsSubject.next([...reviews]);
        return true;
    }

    /**
     * Hide review
     * @param id Review ID
     * @param reason Optional reason for hiding
     * @returns Observable<boolean> - true if successful, false otherwise
     */
    hideReview(id: string, reason?: string): Observable<boolean> {
        if (!id || id.trim() === '') {
            console.error('[ReviewService] Invalid review ID:', id);
            return of(false);
        }

        console.log('[ReviewService] Hiding review:', id, reason ? `Reason: ${reason}` : '');
        const body = reason ? { reason } : {};

        return this.apiService.patch<boolean>(`/reviews/${id}/hide`, body).pipe(
            map(response => {
                if (response.success) {
                    // Update local mock data for fallback
                    const review = this.mockReviews.find(r => r.id === id);
                    if (review) {
                        console.log('[ReviewService] Before hiding - review:', { id: review.id, status: review.status, isFlagged: review.isFlagged });
                        review.status = 'hidden';
                        // Keep isFlagged as is - don't change it when hiding
                        // Review will still show in "flagged" tab with "hidden" badge
                        review.updatedDate = this.getCurrentDate();
                        console.log('[ReviewService] After hiding - review:', { id: review.id, status: review.status, isFlagged: review.isFlagged });
                    } else {
                        console.warn('[ReviewService] Review not found in mock data:', id);
                    }
                    console.log('[ReviewService] Review hidden successfully:', id);
                    return true;
                }
                console.warn('[ReviewService] API returned unsuccessful response:', response.message);
                // Update local mock data for fallback
                const review = this.mockReviews.find(r => r.id === id);
                if (review) {
                    console.log('[ReviewService] Before hiding (unsuccessful) - review:', { id: review.id, status: review.status, isFlagged: review.isFlagged });
                    review.status = 'hidden';
                    // Keep isFlagged as is - don't change it when hiding
                    // Review will still show in "flagged" tab with "hidden" badge
                    review.updatedDate = this.getCurrentDate();
                    console.log('[ReviewService] After hiding (unsuccessful) - review:', { id: review.id, status: review.status, isFlagged: review.isFlagged });
                }
                return false;
            }),
            catchError(error => {
                console.error('[ReviewService] API error hiding review:', error);
                // Update local mock data for fallback
                const review = this.mockReviews.find(r => r.id === id);
                if (review) {
                    console.log('[ReviewService] Before hiding (error) - review:', { id: review.id, status: review.status, isFlagged: review.isFlagged });
                    review.status = 'hidden';
                    // Keep isFlagged as is - don't change it when hiding
                    // Review will still show in "flagged" tab with "hidden" badge
                    review.updatedDate = this.getCurrentDate();
                    console.log('[ReviewService] After hiding (error) - review:', { id: review.id, status: review.status, isFlagged: review.isFlagged });
                }
                return of(false);
            })
        );
    }

    // Delete review permanently
    deleteReview(id: string): boolean {
        const reviews = this.reviewsSubject.value.filter(r => r.id !== id);
        this.reviewsSubject.next(reviews);
        return true;
    }

    // Get filtered reviews
    getFilteredReviews(
        status?: 'visible' | 'hidden' | 'all',
        flagReason?: string,
        searchTerm?: string,
        rating?: number
    ): Review[] {
        let filtered = [...this.reviewsSubject.value];

        if (status && status !== 'all') {
            filtered = filtered.filter(r => r.status === status);
        }

        if (flagReason && flagReason !== 'all') {
            filtered = filtered.filter(r => r.flagReason === flagReason);
        }

        if (rating) {
            filtered = filtered.filter(r => r.rating === rating);
        }

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(r =>
                r.learnerName.toLowerCase().includes(search) ||
                r.tutorName.toLowerCase().includes(search) ||
                r.content.toLowerCase().includes(search)
            );
        }

        return filtered;
    }

    // Get summary stats
    getSummary(): {
        totalReviews: number;
        visibleCount: number;
        hiddenCount: number;
        flaggedCount: number;
        averageRating: number;
    } {
        const all = this.reviewsSubject.value;
        const visible = all.filter(r => r.status === 'visible');
        const hidden = all.filter(r => r.status === 'hidden');
        const flagged = all.filter(r => r.isFlagged === true && r.status === 'visible');
        const avgRating = all.length > 0
            ? all.reduce((sum, r) => sum + r.rating, 0) / all.length
            : 0;

        return {
            totalReviews: all.length,
            visibleCount: visible.length,
            hiddenCount: hidden.length,
            flaggedCount: flagged.length,
            averageRating: Math.round(avgRating * 10) / 10
        };
    }

    private getCurrentDate(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}
