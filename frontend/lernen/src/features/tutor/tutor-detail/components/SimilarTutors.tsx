import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SimilarTutorCard, { type SimilarTutor } from './SimilarTutorCard';
import { useTranslation } from 'react-i18next';
import { tutorService } from '../../../../services/tutorService';
import { useAuth } from '../../../../context/AuthContext';
import type { Tutor } from '../../../../types/tutor';

const mockSimilarTutors: SimilarTutor[] = [
    {
        id: 1,
        name: 'Steven Ford',
        avatar: 'https://picsum.photos/seed/steven/80/80',
        verified: true,
        country: { name: 'Pakistan', code: 'PK' },
        tagline: 'Prepare for beta testing',
        price: 20.00,
        rating: 4.2,
        reviews: 142,
        students: 2,
        sessions: 2205,
        languages: ['English', 'Afrikaans', 'Albanian', 'Amharic'],
        isPrimary: false,
    },
    {
        id: 2,
        name: 'Anthony Shao',
        avatar: 'https://picsum.photos/seed/anthonyS/80/80',
        verified: true,
        country: { name: 'Angola', code: 'AO' },
        tagline: 'Inspiring Achievement Through...',
        price: 40.00,
        rating: 4.5,
        reviews: 4,
        students: 4,
        sessions: 2213,
        languages: ['Albanian', 'Arabic', 'Aragonese'],
        isPrimary: true,
    },
    {
        id: 3,
        name: 'Antony Clara',
        avatar: 'https://picsum.photos/seed/antonyC/80/80',
        verified: true,
        country: { name: 'Switzerland', code: 'CH' },
        tagline: 'Unlocking Potential Through...',
        price: 20.00,
        rating: 5.0,
        reviews: 2,
        students: 3,
        sessions: 1472,
        languages: ['Galician', 'Azerbaijani', 'Basque'],
        isPrimary: false,
    },
    {
        id: 4,
        name: 'Arianne Kearns',
        avatar: 'https://picsum.photos/seed/arianne/80/80',
        verified: true,
        country: { name: 'Bangladesh', code: 'BD' },
        tagline: 'Building Confidence Through...',
        price: 40.00,
        rating: 4.0,
        reviews: 1,
        students: 1,
        sessions: 2204,
        languages: ['French', 'Armenian', 'Asturian'],
        isPrimary: false,
    },
];

// Map Tutor to SimilarTutor
const mapTutorToSimilarTutor = (tutor: Tutor): SimilarTutor => {
    return {
        id: parseInt(tutor.id) || 0,
        name: tutor.fullName || tutor.name || 'Tutor',
        avatar: tutor.avatarUrl || '',
        verified: tutor.isVerified || false,
        country: tutor.country || { name: 'Unknown', code: 'XX' },
        tagline: tutor.headline || '',
        price: tutor.currentSessionFee || 0,
        rating: tutor.averageRating || 0,
        reviews: tutor.reviewCount || 0,
        students: tutor.studentCount || 0,
        sessions: tutor.bookedSessionsCount || 0,
        languages: tutor.languages?.map(lang => lang.language?.name || 'Unknown') || [],
        isPrimary: false,
    };
};

const SimilarTutors: React.FC = () => {
    const { t } = useTranslation();
    const { tutorId } = useParams<{ tutorId: string }>();
    const { state } = useAuth();
    const [similarTutors, setSimilarTutors] = useState<SimilarTutor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSimilarTutors = async () => {
            if (!tutorId) {
                setSimilarTutors(mockSimilarTutors);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await tutorService.getSimilarTutors(tutorId, state.user?.id);
                
                if (response.success && response.data && response.data.content) {
                    const mappedTutors = response.data.content.map(mapTutorToSimilarTutor);
                    setSimilarTutors(mappedTutors);
                } else {
                    // Fallback to mock data on API error
                    setSimilarTutors(mockSimilarTutors);
                }
            } catch (error) {
                console.error('Error fetching similar tutors:', error);
                // Fallback to mock data on error
                setSimilarTutors(mockSimilarTutors);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarTutors();
    }, [tutorId, state.user?.id]);

    if (loading) {
        return (
            <div className="py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">{t('tutorDetail.similarTutors.title')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (similarTutors.length === 0) {
        return null;
    }

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">{t('tutorDetail.similarTutors.title')}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarTutors.map(tutor => (
                    <SimilarTutorCard key={tutor.id} tutor={tutor} />
                ))}
            </div>

            <div className="mt-10 text-center">
                <button className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-bold text-gray-800 bg-white hover:bg-gray-50 transition-colors">
                    {t('tutorDetail.similarTutors.viewAll')}
                </button>
            </div>
        </div>
    );
};

export default SimilarTutors;