import React, { useState } from 'react';

const AboutMeSection: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const fullText = "Hi! I am Cynthia Hunter, a dedicated and experienced tutor with a passion for helping students excel in their academic pursuits. With expertise across a variety of subjects, including mathematics, science, and language arts, I offer a personalized approach to tutoring that addresses each student's unique learning needs. My teaching philosophy is centered on fostering a supportive and engaging learning environment where students feel encouraged to ask questions, explore new concepts, and build confidence in their abilities. I believe that every student has the potential to succeed, and my goal is to provide the tools and guidance necessary to help them reach their goals.";
    const truncatedText = "Hi! I am Cynthia Hunter, a dedicated and experienced tutor with a passion for helping students excel in their academic pursuits. With expertise across a variety of subjects, including mathematics, science, and language arts, I offer a personalized approach to tutoring that addresses each student's unique learning needs. My teaching philosophy is centered on fostering a supportive and engaging learning environment where students feel encouraged to...";

    const textToShow = isExpanded ? fullText : truncatedText;

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-800">About me</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
                {textToShow}
            </p>
             <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-[#0b6459] font-semibold underline hover:text-[#084c43]"
            >
                {isExpanded ? 'Show less' : 'Show more'}
            </button>
        </div>
    );
};

export default AboutMeSection;
