import React, { useState } from 'react';
import { useTranslation } from "react-i18next";

interface AboutMeSectionProps {
    introduction?: string;
}

const AboutMeSection: React.FC<AboutMeSectionProps> = ({ introduction }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { t } = useTranslation();

    if (!introduction) {
        return (
            <div className="py-8">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
            </div>
        );
    }

    // Create truncated version if text is long
    const shouldTruncate = introduction.length > 300;
    const truncatedText = shouldTruncate ? introduction.substring(0, 300) + "..." : introduction;

    const textToShow = isExpanded ? introduction : truncatedText;

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-800">{t('tutorDetail.aboutMe.title')}</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
                {textToShow}
            </p>
            {shouldTruncate && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-[#0b6459] font-semibold underline hover:text-[#084c43]"
                >
                    {isExpanded ? t('tutorDetail.aboutMe.showLess') : t('tutorDetail.aboutMe.showMore')}
                </button>
            )}
        </div>
    );
};

export default AboutMeSection;
