import React from 'react';
import { useTranslation } from 'react-i18next';
import { InteractiveImagePanel } from './InteractiveImagePanel';


const IntroducePanel: React.FC = () => {
    const { t } = useTranslation();
    
    return (
        <div className="bg-[#065A46] text-white p-4 rounded-2xl flex flex-col justify-around relative">
            <div className="mb-8">
                <InteractiveImagePanel />
            </div>

            <div className="flex items-center gap-4 mt-8">
                {/* Circular badge with text */}
                <div className="relative w-24 h-24 flex-shrink-0">
                    {/* Outermost ring - lighter green bg with white border (static) */}
                    <div className="absolute inset-0 rounded-full bg-[#3d8b7d] border-2 border-white/40"></div>

                    {/* Inner white circle */}
                    <div className="absolute inset-2 rounded-full bg-white border-2 border-[#065A46]"></div>

                    {/* Rotating text */}
                    <svg viewBox="0 0 100 100" className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-spin-slow">
                        <defs>
                            <path id="circlePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                        </defs>
                        <text className="text-[11px] uppercase tracking-[0.15em] fill-[#065A46] font-semibold">
                            <textPath href="#circlePath" startOffset="0%">
                                {t('home.introPanel.rotatingText')} •
                            </textPath>
                        </text>
                    </svg>

                    {/* Center star icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-7 h-7 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                        </svg>
                    </div>
                </div>

                <p className="text-base text-gray-200 italic">{t('home.introPanel.description')}</p>
            </div>
        </div>
    );
};
export default IntroducePanel;