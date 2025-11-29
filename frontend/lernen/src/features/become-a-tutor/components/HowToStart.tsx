import React from "react";
import { FiUserPlus, FiCalendar, FiTrendingUp } from "react-icons/fi";

const StepCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
}> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center">
        <div className="bg-[#f9f3eb] w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-110">
            <div className="w-10 h-10 text-[#0b6459]">{icon}</div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mt-6">{title}</h3>
        <p className="text-gray-600 mt-2 max-w-xs">{description}</p>
    </div>
);

const HowToStart: React.FC = () => {
    return (
        <section className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-gray-800">
                    Start in Just a Few Minutes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
                    <StepCard
                        icon={<FiUserPlus size={40} />}
                        title="1. Create Your Profile"
                        description="Complete our simple application to showcase your skills and qualifications."
                    />
                    <StepCard
                        icon={<FiCalendar size={40} />}
                        title="2. Set Your Availability"
                        description="You decide when and how often you want to teach. Total flexibility."
                    />
                    <StepCard
                        icon={<FiTrendingUp size={40} />}
                        title="3. Start Earning"
                        description="Once approved, students can book sessions and you can start earning."
                    />
                </div>
            </div>
        </section>
    );
};

export default HowToStart;
