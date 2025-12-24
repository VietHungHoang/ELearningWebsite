import React, { useRef } from "react";
import { FiUserPlus, FiCalendar, FiTrendingUp } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useIntersectionObserver from "./useIntersectionObserver";

interface StepCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: string;
    isVisible: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ icon, title, description, delay, isVisible }) => (
    <div className={`flex flex-col items-center text-center transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: delay }}>
        <div className="bg-[#f9f3eb] w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-110">
            <div className="w-10 h-10 text-[#0b6459]">{icon}</div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mt-6">{title}</h3>
        <p className="text-gray-600 mt-2 max-w-xs">{description}</p>
    </div>
);

const HowToStart: React.FC = () => {
    const { t } = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = useIntersectionObserver(sectionRef as React.RefObject<Element>, { threshold: 0.1 });

    return (
        <section ref={sectionRef} className="bg-white py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className={`text-4xl font-bold text-gray-800 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    {t('becomeTutor.howToStart.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
                    <StepCard
                        icon={<FiUserPlus size={40} />}
                        title={t('becomeTutor.howToStart.steps.profile.title')}
                        description={t('becomeTutor.howToStart.steps.profile.description')}
                        delay="0.1s"
                        isVisible={isVisible}
                    />
                    <StepCard
                        icon={<FiCalendar size={40} />}
                        title={t('becomeTutor.howToStart.steps.availability.title')}
                        description={t('becomeTutor.howToStart.steps.availability.description')}
                        delay="0.2s"
                        isVisible={isVisible}
                    />
                    <StepCard
                        icon={<FiTrendingUp size={40} />}
                        title={t('becomeTutor.howToStart.steps.earning.title')}
                        description={t('becomeTutor.howToStart.steps.earning.description')}
                        delay="0.3s"
                        isVisible={isVisible}
                    />
                </div>
            </div>
        </section>
    );
};

export default HowToStart;
