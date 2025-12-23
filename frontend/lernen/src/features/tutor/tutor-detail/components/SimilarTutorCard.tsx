import React from 'react';
import { FiCheckCircle, FiStar, FiUsers, FiList, FiGlobe, FiCalendar, FiMessageSquare, FiHeart } from 'react-icons/fi';
import { flagComponents } from '../../../../lib/flagMapping';
import { useTranslation } from 'react-i18next';

export interface SimilarTutor {
    id: number;
    name: string;
    avatar: string;
    verified: boolean;
    country: { name: string; code: string };
    tagline: string;
    price: number;
    rating: number;
    reviews: number;
    students: number;
    sessions: number;
    languages: string[];
    isPrimary: boolean;
}

interface SimilarTutorCardProps {
    tutor: SimilarTutor;
}

const StatItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="flex items-center text-sm text-gray-600">
        <div className="w-4 h-4 mr-2.5 flex-shrink-0 text-gray-500">{icon}</div>
        <div className="truncate">{children}</div>
    </div>
);


const SimilarTutorCard: React.FC<SimilarTutorCardProps> = ({ tutor }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col h-full interactive-card">
            {/* Header */}
            <div className="flex items-start gap-3">
                <img src={tutor.avatar} alt={tutor.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-grow">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-gray-800">{tutor.name}</h3>
                        {tutor.verified && <FiCheckCircle className="w-4 h-4 text-green-500" />}
                        {React.createElement(flagComponents[tutor.country.code] || 'span', { className: "w-4 h-4 rounded-sm" })}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{tutor.tagline}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-2.5 my-4">
                <StatItem icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}>
                    <span className="font-bold text-gray-800">{t('common.currency')}{tutor.price.toFixed(2)}</span>{t('tutorDetail.similarTutorCard.perSession')}
                </StatItem>
                <StatItem icon={<FiStar className="w-4 h-4 text-yellow-400 fill-current" />}>
                    <span className="font-bold text-gray-800">{tutor.rating.toFixed(1)}</span>{t('tutorDetail.similarTutorCard.rating')} ({tutor.reviews} {t('tutorDetail.similarTutorCard.reviews')})
                </StatItem>
                <StatItem icon={<FiUsers className="w-4 h-4" />}>
                    <span className="font-bold text-gray-800">{tutor.students}</span> {t('tutorDetail.similarTutorCard.activeStudents')}
                </StatItem>
                <StatItem icon={<FiList className="w-4 h-4" />}>
                    <span className="font-bold text-gray-800">{tutor.sessions}</span> {t('tutorDetail.similarTutorCard.sessions')}
                </StatItem>
                <StatItem icon={<FiGlobe className="w-4 h-4" />}>
                   {tutor.languages.slice(0, 3).join(', ')}...
                </StatItem>
            </div>
            
            {/* Actions */}
            <div className="mt-auto space-y-2">
                 <button className="w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm bg-white text-gray-800 border border-gray-200 hover:bg-[#0b6459] hover:text-white">
                    {t('tutorDetail.similarTutorCard.bookSession')} <FiCalendar className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        {t('tutorDetail.similarTutorCard.sendMessage')} <FiMessageSquare className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 hover:text-red-500 transition-colors">
                        <FiHeart className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimilarTutorCard;