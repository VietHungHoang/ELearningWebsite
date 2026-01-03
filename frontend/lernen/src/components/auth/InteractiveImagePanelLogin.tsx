import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FaPlay } from 'react-icons/fa';
import { VN } from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';

export const InteractiveImagePanelLogin: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] group">
                <img src="https://picsum.photos/seed/teacher/800/600" alt={t('auth.signup.introPanel.videoAlt')} className="w-full h-full object-cover zoom-image" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <button className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/50 transition-all duration-300 transform group-hover:scale-110 cursor-pointer">
                        <FaPlay size={28} />
                    </button>
                </div>
            </div>

            {/* Floating UI elements */}
            <div className="absolute -top-6 left-4 bg-white/50 p-3 rounded-2xl backdrop-blur-md shadow-lg flex items-center space-x-2 z-10 animate-float" style={{ animationDelay: '0.2s' }}>
                <p className="text-gray-800 font-semibold text-sm">{t('auth.signup.introPanel.registeredTutors')}</p>
                <div className="flex -space-x-3">
                    <img src="https://picsum.photos/seed/person1/32/32" alt={t('auth.signup.introPanel.tutor1')} className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src="https://picsum.photos/seed/person2/32/32" alt={t('auth.signup.introPanel.tutor2')} className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src="https://picsum.photos/seed/person3/32/32" alt={t('auth.signup.introPanel.tutor3')} className="w-8 h-8 rounded-full border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center border-2 border-white text-white font-bold text-sm">+</div>
                </div>
            </div>

            <div className="absolute -bottom-10 right-4 bg-white/80 p-3 rounded-2xl backdrop-blur-md shadow-lg flex items-center space-x-3 text-gray-800 z-10 animate-float">
                <img src="https://picsum.photos/seed/vietnamese-tutor/48/48" alt={t('auth.signup.introPanel.tutorName')} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                    <p className="font-bold">{t('auth.signup.introPanel.tutorName')}</p>
                    <p className="text-sm text-gray-600">{t('auth.signup.introPanel.tutorSubject')}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <VN className="w-4 h-3" />
                        {t('auth.signup.introPanel.tutorLocation')}
                    </p>
                </div>
                <div className="flex items-center text-orange-500 font-bold">
                    <AiFillStar />
                    <span className="ml-1 text-sm text-gray-800">{t('auth.signup.introPanel.tutorRating')}</span>
                </div>
            </div>
        </div>
    );
};