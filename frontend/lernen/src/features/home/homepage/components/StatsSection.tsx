import React, { useRef, useState, useEffect } from 'react';
import { FiUsers, FiAward, FiTrendingUp, FiStar } from 'react-icons/fi';
import useIntersectionObserver from './useIntersectionObserver';

interface StatItemProps {
    end: number;
    suffix: string;
    label: string;
    icon: React.ReactNode;
    delay: string;
    isVisible: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ end, suffix, label, icon, delay, isVisible }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isVisible && !hasAnimated) {
            setHasAnimated(true);
            const duration = 2000;
            const steps = 60;
            const increment = end / steps;
            const stepDuration = duration / steps;

            let currentCount = 0;
            const timer = setInterval(() => {
                currentCount += increment;
                if (currentCount >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(currentCount));
                }
            }, stepDuration);

            return () => clearInterval(timer);
        }
    }, [isVisible, end, hasAnimated]);

    return (
        <div
            className={`text-center transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
            style={{ animationDelay: delay }}
        >
            {/* Icon */}
            <div className="mb-3 flex justify-center">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-[#0b6459]">
                    <div className="text-2xl">
                        {icon}
                    </div>
                </div>
            </div>

            {/* Number */}
            <div className="mb-2">
                <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#0b6459] to-teal-600 bg-clip-text text-transparent">
                    {count.toLocaleString()}
                </span>
                <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0b6459] to-teal-600 bg-clip-text text-transparent">
                    {suffix}
                </span>
            </div>

            {/* Label */}
            <div className="text-lg font-bold text-gray-800">{label}</div>
        </div>
    );
};

const StatsSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = useIntersectionObserver(sectionRef as React.RefObject<Element>, { threshold: 0.2 });

    const stats = [
        {
            end: 15000,
            suffix: '+',
            label: 'Active Students',
            icon: <FiUsers />
        },
        {
            end: 500,
            suffix: '+',
            label: 'Expert Tutors',
            icon: <FiAward />
        },
        {
            end: 50000,
            suffix: '+',
            label: 'Sessions Completed',
            icon: <FiTrendingUp />
        },
        {
            end: 98,
            suffix: '%',
            label: 'Satisfaction Rate',
            icon: <FiStar />
        }
    ];

    return (
        <section ref={sectionRef} className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Stats */}
                    <div>
                        {/* Section Header */}
                        <div className="mb-12">
                            <div className={`inline-block mb-4 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                                }`}>
                                <span className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-bold border border-teal-100">
                                    📊 Our Impact
                                </span>
                            </div>
                            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-4 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                                }`} style={{ animationDelay: '0.1s' }}>
                                Trusted by{' '}
                                <span className="bg-gradient-to-r from-[#0b6459] via-teal-600 to-[#0b6459] bg-clip-text text-transparent">
                                    Thousands
                                </span>
                            </h2>
                            <p className={`text-lg text-gray-600 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                                }`} style={{ animationDelay: '0.2s' }}>
                                Join a thriving community of learners and educators achieving their goals every day
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-8">
                            {stats.map((stat, index) => (
                                <StatItem
                                    key={index}
                                    end={stat.end}
                                    suffix={stat.suffix}
                                    label={stat.label}
                                    icon={stat.icon}
                                    delay={`${0.3 + index * 0.1}s`}
                                    isVisible={isVisible}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className={`transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                        }`} style={{ animationDelay: '0.4s' }}>
                        <img
                            src="/api/placeholder/600/500"
                            alt="Success and Achievement"
                            className="w-full h-auto rounded-2xl shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
