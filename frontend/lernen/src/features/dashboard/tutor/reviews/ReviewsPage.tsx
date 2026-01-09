import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiStar, FiFilter, FiSearch } from 'react-icons/fi';
import { tutorService } from '../../../../services/tutorService';
import { useAuth } from '../../../../context/AuthContext';
import type { TutorReview } from '../../../../types/tutor';
import Loading from '../../../../components/ui/Loading';

interface Review {
    id: string;
    studentName: string;
    studentAvatar?: string;
    rating: number;
    comment: string;
    courseName?: string;
    sessionDate?: string;
    createdAt: string;
}

const ReviewsPage: React.FC = () => {
    const { t } = useTranslation();
    const { state } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch tutor data with reviews
    useEffect(() => {
        const fetchTutorReviews = async () => {
            if (!state.user?.id) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await tutorService.getTutor(state.user.id);
                
                if (response.success && response.data) {
                    // Extract reviews from tutor data
                    const tutorReviews: TutorReview[] = (response.data as any).reviews || [];
                    
                    // Filter only APPROVED reviews
                    const approvedReviews = tutorReviews.filter(
                        (review: TutorReview) => review.moderationStatus === 'APPROVED'
                    );
                    
                    // Map TutorReview to Review format
                    const mappedReviews: Review[] = approvedReviews.map((review: TutorReview) => ({
                        id: review.id,
                        studentName: review.studentName,
                        studentAvatar: review.studentAvatarUrl || review.avatarUrl,
                        rating: review.rating,
                        comment: review.comment,
                        courseName: undefined, // Not available in API response
                        sessionDate: undefined, // Not available in API response
                        createdAt: review.createdAt || review.submitAt || new Date().toISOString(),
                    }));
                    
                    setReviews(mappedReviews);
                } else {
                    setError('Failed to load reviews');
                    setReviews([]);
                }
            } catch (err) {
                console.error('Failed to fetch tutor reviews:', err);
                setError('Failed to load reviews');
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTutorReviews();
    }, [state.user?.id]);

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === star).length / totalReviews) * 100 : 0,
    }));

    // Filter reviews
    const filteredReviews = reviews.filter(review => {
        const matchesRating = filterRating === null || review.rating === filterRating;
        const matchesSearch = searchQuery === '' || 
            review.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.courseName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRating && matchesSearch;
    });

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClass = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                        key={star}
                        className={`${sizeClass} ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.reviews.title')}</h1>
                    <p className="text-sm text-gray-600 mt-1">{t('dashboard.reviews.subtitle')}</p>
                </div>
                <div className="p-6">
                    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-12 text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.reviews.title')}</h1>
                <p className="text-sm text-gray-600 mt-1">{t('dashboard.reviews.subtitle')}</p>
            </div>

            <div className="p-6">
                {/* Statistics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Overall Rating */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-medium text-gray-600 mb-4">{t('dashboard.reviews.overallRating')}</h3>
                        <div className="flex items-end gap-4">
                            <div className="text-5xl font-bold text-gray-800">
                                {averageRating.toFixed(1)}
                            </div>
                            <div className="pb-2">
                                {renderStars(Math.round(averageRating), 'lg')}
                                <p className="text-sm text-gray-500 mt-1">{totalReviews} {t('dashboard.reviews.reviews')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                        <h3 className="text-sm font-medium text-gray-600 mb-4">{t('dashboard.reviews.ratingDistribution')}</h3>
                        <div className="space-y-2">
                            {ratingDistribution.map(({ star, count, percentage }) => (
                                <div key={star} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-16">
                                        <span className="text-sm font-medium text-gray-700">{star}</span>
                                        <FiStar className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder={t('dashboard.reviews.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent placeholder:text-gray-400"
                            />
                        </div>

                        {/* Filter by Rating */}
                        <div className="flex items-center gap-2">
                            <FiFilter className="text-gray-400 w-4 h-4" />
                            <button
                                onClick={() => setFilterRating(null)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filterRating === null
                                        ? 'bg-[#0b6459] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {t('dashboard.reviews.all')}
                            </button>
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => setFilterRating(rating)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                                        filterRating === rating
                                            ? 'bg-[#0b6459] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {rating}
                                    <FiStar className="w-3 h-3" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {filteredReviews.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <FiStar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">{t('dashboard.reviews.noReviews')}</p>
                        </div>
                    ) : (
                        filteredReviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        {review.studentAvatar ? (
                                            <img
                                                src={review.studentAvatar}
                                                alt={review.studentName}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-[#0b6459] text-white flex items-center justify-center font-semibold">
                                                {review.studentName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{review.studentName}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {renderStars(review.rating, 'sm')}
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(review.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {review.courseName && (
                                            <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 mb-3">
                                                {review.courseName}
                                            </div>
                                        )}

                                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>

                                        {review.sessionDate && (
                                            <p className="text-xs text-gray-500 mt-3">
                                                {t('dashboard.reviews.sessionDate')}: {formatDate(review.sessionDate)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewsPage;
