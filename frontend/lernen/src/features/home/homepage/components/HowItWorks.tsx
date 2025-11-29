import React, { useRef } from 'react';
import useIntersectionObserver from './useIntersectionObserver';
import { SearchUserIcon } from './icons/SearchUserIcon';
import { BookCalendarIcon } from './icons/BookCalendarIcon';
import { OnlineLearningIcon } from './icons/OnlineLearningIcon';

const StepCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center">
        <div className="bg-[#f9f3eb] w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-110">
            <div className="w-10 h-10 text-[#0b6459]">
                {icon}
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mt-6">{title}</h3>
        <p className="text-gray-600 mt-2 max-w-xs">{description}</p>
    </div>
);

const HowItWorks: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = useIntersectionObserver(sectionRef as React.RefObject<Element>, { threshold: 0.1 });

    return (
        <section ref={sectionRef} className="bg-white py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className={`text-4xl font-bold text-gray-800 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>How Lernen Works</h2>
                <p className={`mt-4 text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>A simple three-step guide to starting your personalized learning journey with us.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
                    <div className={`transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                        <StepCard 
                            icon={<SearchUserIcon />} 
                            title="1. Find Your Tutor" 
                            description="Browse profiles, read reviews, and find the perfect tutor for your needs." 
                        />
                    </div>
                    <div className={`transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
                        <StepCard 
                            icon={<BookCalendarIcon />} 
                            title="2. Book a Session" 
                            description="Schedule a session at a time that works for you with our easy booking system." 
                        />
                    </div>
                    <div className={`transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                        <StepCard 
                            icon={<OnlineLearningIcon />} 
                            title="3. Start Learning" 
                            description="Connect with your tutor in our virtual classroom and achieve your goals." 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;