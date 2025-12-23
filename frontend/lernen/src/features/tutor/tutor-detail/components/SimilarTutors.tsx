import React from 'react';
import SimilarTutorCard, { type SimilarTutor } from './SimilarTutorCard';
import { useTranslation } from 'react-i18next';


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

const SimilarTutors: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">{t('tutorDetail.similarTutors.title')}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockSimilarTutors.map(tutor => (
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