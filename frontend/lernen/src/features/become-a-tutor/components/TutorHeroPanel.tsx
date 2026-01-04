import React from 'react';
import { FiDollarSign, FiTrendingUp, FiAward, FiCheckCircle } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

export const TutorHeroPanel: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="relative w-full max-w-lg mx-auto">
            {/* Main Image Container with Gradient Background */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group border-4 border-white/20 backdrop-blur-sm bg-gradient-to-br from-[#065A46]/20 via-[#065A46]/20 to-[#054A3A]/20">
                <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80" 
                    alt="Education and growth in nature" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#065A46]/60 via-[#065A46]/20 to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-xs text-gray-600 font-medium">{t('becomeTutor.heroPanel.averageEarnings')}</p>
                                <p className="text-2xl font-bold text-[#065A46] mt-1">{t('becomeTutor.heroPanel.earningsAmount')}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg">
                                <FiTrendingUp className="text-green-600" size={16} />
                                <span className="text-xs font-bold text-green-600">+24%</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                                <FiCheckCircle className="text-green-500" size={14} />
                                <span>{t('becomeTutor.heroPanel.verified')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FiAward className="text-yellow-500" size={14} />
                                <span>{t('becomeTutor.heroPanel.topRated')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Earnings Card - Top Left */}
            <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl z-20 border border-gray-100 animate-float">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#065A46] to-[#054A3A] rounded-lg flex items-center justify-center">
                        <FiDollarSign className="text-white" size={24} />
                    </div>
                    <div>
                        <p className="text-gray-600 text-xs font-medium">{t('becomeTutor.heroPanel.setYourRate')}</p>
                        <p className="text-lg font-bold text-gray-800">{t('becomeTutor.heroPanel.rateRange')}</p>
                    </div>
                </div>
            </div>

            {/* Floating Testimonial Card - Top Right */}
            <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl z-20 border border-gray-100 max-w-[220px] animate-float" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start gap-2.5">
                    <div className="relative flex-shrink-0">
                        <img src="https://picsum.photos/seed/sarah/40/40" alt="Sarah" className="w-10 h-10 rounded-lg object-cover shadow-md border-2 border-white" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-gray-800 truncate">{t('becomeTutor.heroPanel.tutorName')}</p>
                        <p className="text-[10px] text-gray-600 truncate">{t('becomeTutor.heroPanel.tutorSubject')}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <AiFillStar size={12} className="text-orange-500" />
                            <span className="text-xs font-bold text-gray-800">{t('becomeTutor.heroPanel.tutorRating')}</span>
                            <span className="text-[10px] text-gray-500 ml-1">{t('becomeTutor.heroPanel.tutorReviews')}</span>
                        </div>
                        <p className="text-[10px] text-gray-600 mt-1 line-clamp-2">"{t('becomeTutor.heroPanel.tutorQuote')}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

