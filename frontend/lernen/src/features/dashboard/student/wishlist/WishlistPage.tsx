import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiHeart, HiX } from 'react-icons/hi';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { useTranslation } from 'react-i18next';
import wishlistService from '../../../../services/wishlistService';
import type { TutorWishlistItemWithTutor } from '../../../../types/wishlist';
import Toast from '../../../../components/ui/Toast';
import Pagination from '../../../../components/ui/Pagination';

const WishlistPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [tutors, setTutors] = useState<TutorWishlistItemWithTutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const itemsPerPage = 10;
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: t('dashboard.student.wishlist.title') || 'Wishlist' }
        ]);
    }, [setBreadcrumb, t]);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);
                setError(null);

                const items = await wishlistService.getTutorWishlist();
                setTutors(items.map(item => ({
                    ...item,
                    tutor: {
                        id: item.tutorId,
                        fullName: 'Tutor Name',
                        headline: 'Professional Tutor',
                        avatarUrl: '',
                        averageRating: 0,
                        reviewsCount: 0,
                        currentSessionFee: 0,
                        country: { code: 'VN', name: 'Vietnam' },
                        isVerified: false
                    }
                })));
            } catch (err) {
                setError('Failed to fetch wishlist');
                console.error('Error fetching wishlist:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemoveTutor = async (tutorId: string) => {
        try {
            await wishlistService.removeTutorFromWishlist(tutorId);
            setTutors(tutors.filter(t => t.tutorId !== tutorId));
            setToast({ message: t('dashboard.student.wishlist.removedSuccess') || 'Removed from wishlist', type: 'success' });
        } catch (err) {
            setToast({ message: t('dashboard.student.wishlist.removeError') || 'Failed to remove', type: 'error' });
            console.error('Error removing tutor from wishlist:', err);
        }
    };

    const handleViewTutor = (tutorId: string) => {
        navigate(`/tutors/${tutorId}`);
    };

    const filteredTutors = tutors.filter(t =>
        t.tutor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tutor.headline.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedTutors = filteredTutors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Page Header */}
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            {t('dashboard.student.wishlist.title') || 'Wishlist'}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="relative w-full max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiSearch className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder={t('dashboard.student.wishlist.searchPlaceholder') || 'Search...'}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none hover:shadow-md transition-all duration-300 ease-in-out placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b6459] mx-auto"></div>
                        <p className="text-gray-500 mt-4">{t('dashboard.student.wishlist.loading') || 'Loading...'}</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <h3 className="text-lg font-bold text-red-600">{t('dashboard.student.wishlist.errorTitle') || 'Error'}</h3>
                        <p className="text-gray-500 mt-2">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors"
                        >
                            {t('dashboard.student.wishlist.tryAgain') || 'Try Again'}
                        </button>
                    </div>
                ) : displayedTutors.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                            {displayedTutors.map((item) => (
                                <div
                                    key={item.id}
                                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow p-4"
                                >
                                    <div className="flex items-start gap-4">
                                        {item.tutor.avatarUrl ? (
                                            <img
                                                src={item.tutor.avatarUrl}
                                                alt={item.tutor.fullName}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400 text-xl">
                                                    {item.tutor.fullName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1">
                                                {item.tutor.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">{item.tutor.headline}</p>
                                            {item.tutor.averageRating > 0 && (
                                                <p className="text-sm text-gray-600 mb-2">
                                                    ⭐ {item.tutor.averageRating} ({item.tutor.reviewsCount} {t('dashboard.student.wishlist.reviews') || 'reviews'})
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-3">
                                                <button
                                                    onClick={() => handleViewTutor(item.tutorId)}
                                                    className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    {t('dashboard.student.wishlist.view') || 'View'}
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveTutor(item.tutorId)}
                                                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title={t('dashboard.student.wishlist.remove') || 'Remove'}
                                                >
                                                    <HiX className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredTutors.length > itemsPerPage && (
                            <div className="p-4 border-t border-gray-200">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(filteredTutors.length / itemsPerPage)}
                                    totalItems={filteredTutors.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <HiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-800">
                            {t('dashboard.student.wishlist.noTutors') || 'No tutors in wishlist'}
                        </h3>
                        <p className="text-gray-500 mt-2">
                            {t('dashboard.student.wishlist.noTutorsDescription') || 'Start adding tutors to your wishlist'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
