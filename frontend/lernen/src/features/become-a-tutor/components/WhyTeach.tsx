import React, { useRef } from "react";
import { FiDollarSign, FiGlobe, FiClock, FiUsers } from "react-icons/fi";
import useIntersectionObserver from "./useIntersectionObserver";

interface BenefitCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: string;
    isVisible: boolean;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, delay, isVisible }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: delay }}>
        <div className="w-12 h-12 bg-green-100 text-[#0b6459] rounded-lg flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mt-4">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
    </div>
);

const WhyTeach: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = useIntersectionObserver(sectionRef as React.RefObject<Element>, { threshold: 0.1 });

    return (
        <section ref={sectionRef} className="py-16 sm:py-24 bg-[#F8F7F4]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className={`text-4xl font-bold text-gray-800 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                        Why Teach with Lernen?
                    </h2>
                    <p className={`mt-4 text-lg text-gray-600 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0.1s" }}>
                        Join a platform that values your expertise and supports
                        your growth.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <BenefitCard
                        icon={<FiDollarSign size={24} />}
                        title="Competitive Earnings"
                        description="Set your own hourly rate and get paid securely for every session you teach."
                        delay="0.1s"
                        isVisible={isVisible}
                    />
                    <BenefitCard
                        icon={<FiClock size={24} />}
                        title="Flexible Schedule"
                        description="Teach whenever you want, from wherever you are. You are in control of your calendar."
                        delay="0.2s"
                        isVisible={isVisible}
                    />
                    <BenefitCard
                        icon={<FiGlobe size={24} />}
                        title="Global Student Base"
                        description="Connect with and inspire eager learners from all around the world."
                        delay="0.3s"
                        isVisible={isVisible}
                    />
                    <BenefitCard
                        icon={<FiUsers size={24} />}
                        title="Supportive Community"
                        description="Get access to resources, tools, and a community of fellow tutors to help you succeed."
                        delay="0.4s"
                        isVisible={isVisible}
                    />
                </div>
            </div>
        </section>
    );
};

export default WhyTeach;
