import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private reviewsSubject = new BehaviorSubject<Review[]>([]);
    public reviews$ = this.reviewsSubject.asObservable();

    constructor() {
        this.loadMockData();
    }

    private loadMockData(): void {
        const mockReviews: Review[] = [
            {
                id: 'review_001',
                rating: 1,
                learnerId: 'learner_001',
                learnerName: 'Nguyễn Văn A',
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
                learnerName: 'Trần Thị B',
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
                learnerName: 'Phạm Văn C',
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
                learnerName: 'Hoàng Thị D',
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
                learnerName: 'Võ Văn E',
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
                learnerName: 'Lý Thị F',
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
                learnerName: 'Đinh Văn G',
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
                learnerName: 'Ngô Thị H',
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
                learnerName: 'Trịnh Văn I',
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
                learnerName: 'Tạ Thị K',
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

        this.reviewsSubject.next(mockReviews);
    }

    // Get all reviews
    getReviews(): Observable<Review[]> {
        return this.reviews$;
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

    // Make review visible
    makeReviewVisible(id: string): boolean {
        const reviews = this.reviewsSubject.value;
        const review = reviews.find(r => r.id === id);
        if (!review) return false;

        review.status = 'visible';
        review.isFlagged = false;
        review.updatedDate = this.getCurrentDate();
        this.reviewsSubject.next([...reviews]);
        return true;
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

    // Hide review
    hideReview(id: string, reason?: string): boolean {
        const reviews = this.reviewsSubject.value;
        const review = reviews.find(r => r.id === id);
        if (!review) return false;

        review.status = 'hidden';
        review.isFlagged = false;
        review.updatedDate = this.getCurrentDate();
        this.reviewsSubject.next([...reviews]);
        return true;
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
