import React, { useRef } from "react";
import { FiDollarSign, FiGlobe, FiClock, FiUsers } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useIntersectionObserver from "./useIntersectionObserver";

interface BenefitCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: string;
    isVisible: boolean;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, delay, isVisible }) => (
    <div className={`bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: delay }}>
        <div className="w-12 h-12 bg-white/20 text-white rounded-lg flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-white mt-4">{title}</h3>
        <p className="text-white/80 text-sm mt-1">{description}</p>
    </div>
);

const WhyTeach: React.FC = () => {
    const { t } = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = useIntersectionObserver(sectionRef as React.RefObject<Element>, { threshold: 0.1 });

    return (
        <section ref={sectionRef} className="py-16 sm:py-24 bg-gradient-to-br from-[#065A46] via-[#065A46] to-[#054A3A]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className={`text-4xl font-bold text-white transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                        {t('becomeTutor.whyTeach.title')}
                    </h2>
                    <p className={`mt-4 text-lg text-white/80 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0.1s" }}>
                        {t('becomeTutor.whyTeach.subtitle')}
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <BenefitCard
                        icon={<FiDollarSign size={24} />}
                        title={t('becomeTutor.whyTeach.benefits.earnings.title')}
                        description={t('becomeTutor.whyTeach.benefits.earnings.description')}
                        delay="0.1s"
                        isVisible={isVisible}
                    />
                    <BenefitCard
                        icon={<FiClock size={24} />}
                        title={t('becomeTutor.whyTeach.benefits.schedule.title')}
                        description={t('becomeTutor.whyTeach.benefits.schedule.description')}
                        delay="0.2s"
                        isVisible={isVisible}
                    />
                    <BenefitCard
                        icon={<FiGlobe size={24} />}
                        title={t('becomeTutor.whyTeach.benefits.global.title')}
                        description={t('becomeTutor.whyTeach.benefits.global.description')}
                        delay="0.3s"
                        isVisible={isVisible}
                    />
                    <BenefitCard
                        icon={<FiUsers size={24} />}
                        title={t('becomeTutor.whyTeach.benefits.community.title')}
                        description={t('becomeTutor.whyTeach.benefits.community.description')}
                        delay="0.4s"
                        isVisible={isVisible}
                    />
                </div>
            </div>
        </section>
    );
};

export default WhyTeach;
