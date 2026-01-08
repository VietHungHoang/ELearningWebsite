import React, { useState, useEffect } from 'react';
import { FiStar, FiCheckCircle, FiClock, FiAlertCircle, FiLoader, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import type { TutorReview, ReviewModerationStatus } from '../../../../types/tutor';
import Toast from '../../../../components/ui/Toast';
import { tutorService } from '../../../../services/tutorService';
import { useAuth } from '../../../../context/AuthContext';
import { useTranslation } from "react-i18next";

interface StudentReviewsProps {
    reviews: TutorReview[];
    tutorId: string;
    hasTrialSession?: boolean;
}

// Helper to check if a status is pending
const isPendingStatus = (status?: ReviewModerationStatus): boolean => {
    if (!status) return false;
    return status.startsWith('PENDING_');
};

const StudentReviews: React.FC<StudentReviewsProps> = ({ reviews: initialReviews, tutorId, hasTrialSession = false }) => {
    const [visibleCount, setVisibleCount] = useState(3);
    const [selectedRating, setSelectedRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localReviews, setLocalReviews] = useState<TutorReview[]>(initialReviews);
    const { state } = useAuth();
    const { t } = useTranslation();

    // Sync localReviews when initialReviews changes (e.g., from API response)
    useEffect(() => {
        setLocalReviews(initialReviews);
    }, [initialReviews]);

    // Use localReviews for display (includes newly submitted reviews)
    const reviews = localReviews;

    // Filter APPROVED reviews for stats calculation
    const approvedReviews = reviews.filter(r => !r.moderationStatus || r.moderationStatus === 'APPROVED');
    const totalApprovedReviews = approvedReviews.length;
    const averageRating = totalApprovedReviews > 0 ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / totalApprovedReviews : 0;
    const ratingDistribution = {
        5: approvedReviews.filter(r => r.rating === 5).length,
        4: approvedReviews.filter(r => r.rating === 4).length,
        3: approvedReviews.filter(r => r.rating === 3).length,
        2: approvedReviews.filter(r => r.rating === 2).length,
        1: approvedReviews.filter(r => r.rating === 1).length,
    };


    const RatingSummary: React.FC = () => (
        <div className="bg-[#f9f3eb] rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3">
                <p className="text-5xl font-bold text-gray-800">{averageRating.toFixed(1)}</p>
                <div>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{t(totalApprovedReviews === 1 ? 'tutorDetail.reviews.basedOnRating' : 'tutorDetail.reviews.basedOnRatings', { count: totalApprovedReviews })}</p>
                </div>
            </div>
            <div className="border-t border-gray-300/70 my-4"></div>
            <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(star => {
                    const count = ratingDistribution[star as keyof typeof ratingDistribution];
                    const percentage = totalApprovedReviews > 0 ? (count / totalApprovedReviews) * 100 : 0;
                    return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                            <p className="font-medium text-gray-700 w-8">{star.toFixed(1)}</p>
                            <div className="flex-grow bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <p className="text-gray-500 w-4 text-right">{count}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const ReviewCard: React.FC<{ review: TutorReview }> = ({ review }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const canTruncate = review.comment.length > 200;
        const displayText = isExpanded ? review.comment : `${review.comment.substring(0, 200)}${canTruncate ? '...' : ''}`;

        // Check if this is the current user's own review
        const isOwnReview = state.user?.id === review.studentId;
        const isPending = isPendingStatus(review.moderationStatus);
        const isRejected = review.moderationStatus === 'REJECTED';
        const isApproved = review.moderationStatus === 'APPROVED' || !review.moderationStatus;
        // Show moderation badge only for own pending/rejected reviews
        const showModerationBadge = isOwnReview && (isPending || isRejected);

        // Format date from createdAt
        const formatDate = (dateString?: string) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString();
            } catch {
                return '';
            }
        };

        // Get avatar URL - use studentAvatarUrl if available, otherwise generate default
        const getAvatarUrl = () => {
            if (review.studentAvatarUrl) return review.studentAvatarUrl;
            if (review.avatarUrl) return review.avatarUrl;
            // Generate a default avatar with initials or use a placeholder
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(review.studentName || 'User')}&background=random&size=48`;
        };

        return (
            <div className={`grid grid-cols-10 gap-4 ${showModerationBadge ? 'bg-yellow-50/50 p-4 rounded-lg border border-yellow-200' : ''}`}>
                <div className="col-span-2">
                    <div className="flex items-center gap-3">
                        <img src={getAvatarUrl()} alt={review.studentName} className="w-12 h-12 rounded-md object-cover" />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-gray-800 text-sm">{review.studentName}</p>
                                {isApproved && <FiCheckCircle className="w-3 h-3 text-green-500" />}
                            </div>
                            <p className="text-xs text-gray-500">{formatDate(review.createdAt) || formatDate(review.submitAt)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-span-8">
                    {/* Moderation status badge for pending/rejected reviews */}
                    {showModerationBadge && (
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-2 ${isRejected
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {isRejected ? (
                                <FiAlertCircle className="w-3 h-3" />
                            ) : (
                                <FiClock className="w-3 h-3" />
                            )}
                            <span>
                                {isRejected
                                    ? t('tutorDetail.reviews.moderation.rejected')
                                    : t('tutorDetail.reviews.moderation.pending')
                                }
                            </span>
                        </div>
                    )}

                    {/* Show reason for pending/rejected */}
                    {showModerationBadge && review.statusDescription && (
                        <p className={`text-xs mb-2 ${isRejected ? 'text-red-600' : 'text-yellow-600'}`}>
                            {review.statusDescription}
                        </p>
                    )}


                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <FiStar
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                        ))}
                        <span className="text-sm font-bold ml-1">{review.rating.toFixed(1)}/5.0</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {displayText}
                        {canTruncate && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="ml-1 text-sm font-semibold text-[#0b6459] underline hover:text-[#084c43]"
                            >
                                {isExpanded ? t('tutorDetail.aboutMe.showLess') : t('tutorDetail.aboutMe.showMore')}
                            </button>
                        )}
                    </p>
                </div>
            </div>
        );
    };

    const handleSubmitReview = async () => {
        if (!state.user) {
            setToast({ message: t('tutorDetail.reviews.loginRequired'), type: 'error' });
            return;
        }

        // Validate comment length
        if (newComment.trim().length < 10) {
            setToast({ message: t('tutorDetail.reviews.commentTooShort', { defaultValue: 'Vui lòng nhập ít nhất 10 ký tự.' }), type: 'error' });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await tutorService.submitReview({
                tutorId: tutorId,
                studentId: state.user.id,
                studentName: state.user.name,
                studentAvatarUrl: state.user.avatarUrl || undefined,
                rating: selectedRating,
                comment: newComment,
            });

            // Add the new review to local state
            if (response.data) {
                const newReview: TutorReview = {
                    id: response.data.id,
                    studentId: response.data.studentId,
                    studentName: response.data.studentName || state.user.name,
                    rating: response.data.rating,
                    comment: response.data.comment,
                    avatarUrl: response.data.avatarUrl || state.user.avatarUrl,
                    submitAt: new Date().toLocaleDateString(),
                    moderationStatus: response.data.moderationStatus,
                    statusDescription: response.data.statusDescription,
                    errorCode: response.data.errorCode,
                    errorMessage: response.data.errorMessage,
                    ownReview: true, // Mark as own review to show moderation status
                };
                setLocalReviews(prev => [newReview, ...prev]);
            }

            // Show appropriate message based on moderation status
            if (response.data?.moderationStatus === 'APPROVED') {
                setToast({ message: t('tutorDetail.reviews.submitSuccess'), type: 'success' });
            } else if (response.data?.moderationStatus) {
                // Review is pending moderation
                setToast({
                    message: t('tutorDetail.reviews.submitPending', {
                        defaultValue: 'Đánh giá của bạn đã được gửi và đang chờ kiểm duyệt.'
                    }),
                    type: 'success'
                });
            } else {
                setToast({ message: t('tutorDetail.reviews.submitSuccess'), type: 'success' });
            }

            setSelectedRating(0);
            setNewComment('');
        } catch (error) {
            console.error('Failed to submit review:', error);
            setToast({ message: t('tutorDetail.reviews.submitError'), type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-800">{t('tutorDetail.reviews.title')}</h2>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <RatingSummary />

                    {/* Write a Review Section - only show if user has booked a trial session */}
                    {hasTrialSession && (
                        <div className="bg-[#f9f3eb] rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('tutorDetail.reviews.writeReview')}</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('tutorDetail.reviews.yourRating')}</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onClick={() => setSelectedRating(star)}
                                            className="transition-colors"
                                            disabled={isSubmitting}
                                        >
                                            <FiStar
                                                className={`w-6 h-6 ${selectedRating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'} hover:text-yellow-400`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('tutorDetail.reviews.yourComment')}
                                </label>
                                <textarea
                                    id="review-comment"
                                    rows={4}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={t('tutorDetail.reviews.placeholder')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b6459] focus:border-[#0b6459] resize-none text-sm placeholder:text-gray-400 transition-all duration-300"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button
                                className="w-full px-6 py-3 bg-[#0b6459] text-white font-semibold rounded-lg hover:bg-[#084c43] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                disabled={selectedRating === 0 || isSubmitting}
                                onClick={handleSubmitReview}
                            >
                                {isSubmitting ? (
                                    <>
                                        <FiLoader className="w-5 h-5 animate-spin" />
                                        <span>{t('tutorDetail.reviews.submitting', { defaultValue: 'Đang gửi...' })}</span>
                                    </>
                                ) : (
                                    t('tutorDetail.reviews.submitReview')
                                )}
                            </button>
                        </div>
                    )}
                </div>
                <div className="lg:col-span-2 space-y-8">
                    {reviews.slice(0, visibleCount).map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                    {visibleCount < reviews.length ? (
                        <div className="text-center mt-6">
                            <button
                                onClick={() => setVisibleCount(prev => prev + 3)}
                                className="inline-flex items-center gap-1 text-[#0b6459] font-semibold hover:underline transition-all duration-200"
                            >
                                <FiChevronDown className="w-4 h-4" />
                                {t('tutorDetail.reviews.loadMore')}
                            </button>
                        </div>
                    ) : reviews.length > 3 && (
                        <div className="text-center mt-6">
                            <button
                                onClick={() => setVisibleCount(3)}
                                className="inline-flex items-center gap-1 text-gray-600 font-semibold hover:underline transition-all duration-200"
                            >
                                <FiChevronUp className="w-4 h-4" />
                                {t('tutorDetail.reviews.showLess')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default StudentReviews;