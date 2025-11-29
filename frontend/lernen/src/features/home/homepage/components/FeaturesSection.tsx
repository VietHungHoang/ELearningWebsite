import React, { useRef } from 'react';
import { FiVideo, FiUsers, FiClock, FiTrendingUp, FiAward, FiCheckCircle } from 'react-icons/fi';
import useIntersectionObserver from './useIntersectionObserver';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
    delay: string;
    isVisible: boolean;
    index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient, delay, isVisible, index }) => (
    <div
        className={`group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
        style={{ animationDelay: delay }}
    >
        {/* Icon with gradient background */}
        <div className="relative mb-4">
            <div className={`w-14 h-14 rounded-xl ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white text-2xl">
                    {icon}
                </div>
            </div>
            {/* Number badge */}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
            </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#0b6459] transition-colors">
            {title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);

const FeaturesSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = useIntersectionObserver(sectionRef as React.RefObject<Element>, { threshold: 0.1 });

    const features = [
        {
            icon: <FiVideo />,
            title: 'Live Interactive Sessions',
            description: 'Connect with expert tutors in real-time through HD video sessions with interactive whiteboards and screen sharing capabilities.',
            gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
        },
        {
            icon: <FiUsers />,
            title: 'Verified Expert Tutors',
            description: 'Learn from highly qualified tutors with proven track records, extensive subject expertise, and excellent ratings.',
            gradient: 'bg-gradient-to-br from-purple-500 to-pink-600'
        },
        {
            icon: <FiClock />,
            title: 'Flexible Scheduling',
            description: 'Book sessions at times that work for you with our 24/7 platform. Study at your own pace, whenever and wherever.',
            gradient: 'bg-gradient-to-br from-teal-500 to-emerald-600'
        },
        {
            icon: <FiTrendingUp />,
            title: 'Smart Progress Tracking',
            description: 'Monitor your learning journey with detailed analytics, personalized reports, and AI-powered recommendations.',
            gradient: 'bg-gradient-to-br from-orange-500 to-red-600'
        },
        {
            icon: <FiAward />,
            title: 'Earn Certificates',
            description: 'Receive industry-recognized certificates upon course completion to showcase your achievements and boost your career.',
            gradient: 'bg-gradient-to-br from-pink-500 to-rose-600'
        },
        {
            icon: <FiCheckCircle />,
            title: 'Money-Back Guarantee',
            description: 'All sessions are quality monitored. Not satisfied? Get a full refund within 24 hours, no questions asked.',
            gradient: 'bg-gradient-to-br from-green-500 to-teal-600'
        }
    ];

    return (
        <section ref={sectionRef} className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 items-center mb-12">
                    {/* Left: Image */}
                    <div className={`transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                        }`}>
                        <img
                            src="/api/placeholder/600/500"
                            alt="Online Learning"
                            className="w-full h-auto rounded-2xl shadow-lg"
                        />
                    </div>

                    {/* Right: Header */}
                    <div>
                        <div className={`inline-block mb-4 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                            }`} style={{ animationDelay: '0.1s' }}>
                            <span className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-bold border border-teal-100">
                                ✨ Why Choose Lernen
                            </span>
                        </div>
                        <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-4 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                            }`} style={{ animationDelay: '0.2s' }}>
                            Everything You Need to
                            <br />
                            <span className="bg-gradient-to-r from-[#0b6459] via-teal-600 to-[#0b6459] bg-clip-text text-transparent">
                                Succeed in Learning
                            </span>
                        </h2>
                        <p className={`text-lg text-gray-600 leading-relaxed transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                            }`} style={{ animationDelay: '0.3s' }}>
                            Discover our comprehensive suite of features designed to make your learning journey smooth, effective, and enjoyable.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            gradient={feature.gradient}
                            delay={`${0.4 + index * 0.1}s`}
                            isVisible={isVisible}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
