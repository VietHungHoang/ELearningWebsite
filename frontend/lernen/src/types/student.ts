export interface SubmitReviewRequest {
    tutorId: string;
    studentId: string;
    studentName?: string;
    studentAvatarUrl?: string;
    rating: number;
    comment: string;
}