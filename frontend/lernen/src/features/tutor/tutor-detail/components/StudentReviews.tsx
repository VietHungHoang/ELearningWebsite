import React, { useState, useEffect } from 'react';
import { FiStar, FiCheckCircle } from 'react-icons/fi';
import type { TutorDetail, TutorReview } from '../../../../types/tutor';
import Toast from '../../../../components/ui/Toast';
import { tutorService } from '../../../../services/tutorService';
import { useAuth } from '../../../../context/AuthContext';
import { useTranslation } from "react-i18next";

const StudentReviews: React.FC<{ tutorId: string }> = ({ tutorId }) => {
    const [visibleCount, setVisibleCount] = useState(3);
    const [selectedRating, setSelectedRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const { state } = useAuth();
    const { t } = useTranslation();
    const [tutor, setTutor] = useState<TutorDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTutor = async () => {
            try {
                setLoading(true);
                const response = await tutorService.getTutorDetail(tutorId);
                setTutor(response.data);
            } catch (err) {
                setError('Failed to load tutor details');
                console.error('Error fetching tutor:', err);
            } finally {
                setLoading(false);
            }
        };

        if (tutorId) {
            fetchTutor();
        }
    }, [tutorId]);

    if (loading || !tutor) {
        return <div>Lỗicmnr</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const reviews = tutor.reviews;

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
    const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
    };


    const RatingSummary: React.FC = () => (
        <div className="bg-[#f9f3eb] rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3">
                <p className="text-5xl font-bold text-gray-800">{averageRating.toFixed(1)}</p>
                <div>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{t(totalReviews === 1 ? 'tutorDetail.reviews.basedOnRating' : 'tutorDetail.reviews.basedOnRatings', { count: totalReviews })}</p>
                </div>
            </div>
            <div className="border-t border-gray-300/70 my-4"></div>
            <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(star => {
                    const count = ratingDistribution[star as keyof typeof ratingDistribution];
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
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

        return (
            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-2">
                    <div className="flex items-center gap-3">
                        <img src={review.avatarUrl || 'https://picsum.photos/seed/' + review.studentId + '/48/48'} alt={review.studentName} className="w-12 h-12 rounded-md object-cover" />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-gray-800 text-sm">{review.studentName}</p>
                                <FiCheckCircle className="w-3 h-3 text-green-500" />
                            </div>
                            <p className="text-xs text-gray-500">{review.submitAt || 'N/A'}</p>
                        </div>
                    </div>
                </div>
                <div className="col-span-8">
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
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


    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-800">{t('tutorDetail.reviews.title')}</h2>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <RatingSummary />

                    {/* Write a Review Section - only show if tutor doesn't have trial session */}
                    {!tutor.hasTrialSession && (
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b6459] resize-none text-sm"
                                />
                            </div>

                            <button
                                className="w-full px-6 py-3 bg-[#0b6459] text-white font-semibold rounded-lg hover:bg-[#084c43] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={selectedRating === 0}
                                onClick={async () => {
                                    if (!state.user) {
                                        setToast({ message: t('tutorDetail.reviews.loginRequired'), type: 'error' });
                                        return;
                                    }

                                    try {
                                        await tutorService.submitReview(tutor.id, {
                                            studentId: state.user.id,
                                            rating: selectedRating,
                                            comment: newComment,
                                        });
                                        setToast({ message: t('tutorDetail.reviews.submitSuccess'), type: 'success' });
                                        setSelectedRating(0);
                                        setNewComment('');
                                    } catch (error) {
                                        console.error('Failed to submit review:', error);
                                        setToast({ message: t('tutorDetail.reviews.submitError'), type: 'error' });
                                    }
                                }}
                            >
                                {t('tutorDetail.reviews.submitReview')}
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
                                className="px-5 py-2.5 border border-[#0b6459] text-[#0b6459] font-semibold rounded-xl hover:bg-[#0b6459] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                {t('tutorDetail.reviews.loadMore')}
                            </button>
                        </div>
                    ) : reviews.length > 3 && (
                        <div className="text-center mt-6">
                            <button
                                onClick={() => setVisibleCount(3)}
                                className="px-5 py-2.5 border border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
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