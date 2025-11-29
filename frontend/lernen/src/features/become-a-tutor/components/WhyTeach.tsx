import React from "react";
import { FiDollarSign, FiGlobe, FiClock, FiUsers } from "react-icons/fi";

const BenefitCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
}> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
        <div className="w-12 h-12 bg-green-100 text-[#0b6459] rounded-lg flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mt-4">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
    </div>
);

const WhyTeach: React.FC = () => {
    return (
        <section className="py-16 sm:py-24 bg-[#F8F7F4]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800">
                        Why Teach with Lernen?
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Join a platform that values your expertise and supports
                        your growth.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <BenefitCard
                        icon={<FiDollarSign size={24} />}
                        title="Competitive Earnings"
                        description="Set your own hourly rate and get paid securely for every session you teach."
                    />
                    <BenefitCard
                        icon={<FiClock size={24} />}
                        title="Flexible Schedule"
                        description="Teach whenever you want, from wherever you are. You are in control of your calendar."
                    />
                    <BenefitCard
                        icon={<FiGlobe size={24} />}
                        title="Global Student Base"
                        description="Connect with and inspire eager learners from all around the world."
                    />
                    <BenefitCard
                        icon={<FiUsers size={24} />}
                        title="Supportive Community"
                        description="Get access to resources, tools, and a community of fellow tutors to help you succeed."
                    />
                </div>
            </div>
        </section>
    );
};

export default WhyTeach;
