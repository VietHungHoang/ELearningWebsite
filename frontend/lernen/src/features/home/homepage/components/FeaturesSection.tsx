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
        className={`group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
        style={{ animationDelay: delay }}
    >
        {/* Icon with gradient background */}
        <div className="relative mb-3">
            <div className={`w-12 h-12 rounded-lg ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white text-lg">
                    {icon}
                </div>
            </div>
            {/* Number badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                {index + 1}
            </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#0b6459] transition-colors">
            {title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-xs">
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
            title: 'Personalized Learning Path',
            description: 'Get customized learning plans tailored to your goals and pace. Your tutor adapts teaching methods to match your learning style.',
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
        <section ref={sectionRef} className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-4 items-start mb-10">
                    {/* Left: Image - Compact Design */}
                    <div className={`relative transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                        }`}>
                        <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0b6459] via-teal-700 to-[#0b6459] border-2 border-[#0b6459]/20 ring-1 ring-[#0b6459]/10">
                            {/* Decorative background patterns */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 right-0 w-56 h-56 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                            </div>
                            
                            {/* Grid pattern overlay */}
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                                backgroundSize: '30px 30px'
                            }}></div>
                            
                            {/* Main content */}
                            <div className="relative z-10 flex flex-col items-center justify-center p-6">
                                {/* Icon with glow effect - Smaller */}
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#0b6459] to-teal-600 rounded-2xl blur-lg opacity-50 scale-110"></div>
                                    <div className="relative w-28 h-28 bg-gradient-to-br from-[#0b6459] via-teal-600 to-emerald-500 rounded-2xl flex items-center justify-center border-2 border-white/30 transform hover:scale-105 transition-transform duration-300">
                                        <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Floating decorative elements - Smaller */}
                                <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                
                                <div className="absolute bottom-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                
                                {/* Title */}
                                <h3 className="text-lg font-bold text-white mb-1.5 text-center">Expert Tutoring Platform</h3>
                                <p className="text-xs text-white/90 text-center max-w-xs mb-4">Connect with verified tutors for personalized 1-on-1 learning</p>
                                
                                {/* Stats badges - Updated content */}
                                <div className="flex gap-2 mt-2">
                                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 ring-1 ring-white/20">
                                        <span className="text-xs font-bold text-white">500+ Tutors</span>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 ring-1 ring-white/20">
                                        <span className="text-xs font-bold text-white">24/7 Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Header */}
                    <div>
                        <div className={`inline-block mb-3 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                            }`} style={{ animationDelay: '0.1s' }}>
                            <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-100">
                                ✨ Why Choose Lernen
                            </span>
                        </div>
                        <h2 className={`text-3xl md:text-4xl font-bold text-gray-800 mb-3 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                            }`} style={{ animationDelay: '0.2s' }}>
                            Everything You Need to
                            <br />
                            <span className="bg-gradient-to-r from-[#0b6459] via-teal-600 to-[#0b6459] bg-clip-text text-transparent">
                                Succeed in Learning
                            </span>
                        </h2>
                        <p className={`text-base text-gray-600 leading-relaxed transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                            }`} style={{ animationDelay: '0.3s' }}>
                            Discover our comprehensive suite of features designed to make your learning journey smooth, effective, and enjoyable.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
