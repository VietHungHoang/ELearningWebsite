import React, { useState } from 'react';
import type { Tutor } from '../../../../types/api';

interface AboutMeSectionProps {
    tutor: Tutor;
}

const AboutMeSection: React.FC<AboutMeSectionProps> = ({ tutor }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const introduction = tutor.introduction;

    // Create truncated version if text is long
    const shouldTruncate = introduction.length > 300;
    const truncatedText = shouldTruncate ? introduction.substring(0, 300) + "..." : introduction;

    const textToShow = isExpanded ? introduction : truncatedText;

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-800">About me</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
                {textToShow}
            </p>
            {shouldTruncate && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-[#0b6459] font-semibold underline hover:text-[#084c43]"
                >
                    {isExpanded ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    );
};

export default AboutMeSection;
