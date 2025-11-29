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
    const hasAnimatedRef = React.useRef(false);

    useEffect(() => {
        if (isVisible && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            
            // Parse delay from string like "0.3s" to milliseconds
            const delayValue = delay.replace('s', '').trim();
            const delayMs = parseFloat(delayValue) * 1000;
            
            // Animation duration (2 seconds)
            const duration = 2000;
            const steps = 60;
            const increment = end / steps;
            const stepDuration = duration / steps;

            let timer: ReturnType<typeof setInterval> | null = null;

            // Start animation after delay
            const timeoutId = setTimeout(() => {
                let currentCount = 0;
                timer = setInterval(() => {
                    currentCount += increment;
                    if (currentCount >= end) {
                        setCount(end);
                        if (timer) {
                            clearInterval(timer);
                            timer = null;
                        }
                    } else {
                        const newCount = Math.floor(currentCount);
                        setCount(newCount);
                    }
                }, stepDuration);
            }, delayMs);

            return () => {
                clearTimeout(timeoutId);
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
            };
        }
    }, [isVisible, end, delay, label]);

    return (
        <div
            className={`text-center transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
            style={{ animationDelay: delay }}
        >
            {/* Icon */}
            <div className="mb-2 flex justify-center">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-[#0b6459]">
                    <div className="text-lg">
                        {icon}
                    </div>
                </div>
            </div>

            {/* Number */}
            <div className="mb-1.5">
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0b6459] to-teal-600 bg-clip-text text-transparent">
                    {count.toLocaleString()}
                </span>
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0b6459] to-teal-600 bg-clip-text text-transparent">
                    {suffix}
                </span>
            </div>

            {/* Label */}
            <div className="text-sm font-bold text-gray-800">{label}</div>
        </div>
    );
};

const StatsSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = useIntersectionObserver(sectionRef as React.RefObject<Element>, { 
        threshold: 0.1, // Trigger when 10% of section is visible
        rootMargin: '0px' // No margin, trigger when section enters viewport
    });


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
        <section ref={sectionRef} className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left: Stats */}
                    <div>
                        {/* Section Header */}
                        <div className="mb-8">
                            <div className={`inline-block mb-3 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                                }`}>
                                <span className="px-3 py-1.5 bg-[#0b6459]/10 text-[#0b6459] rounded-full text-xs font-bold border border-[#0b6459]/20">
                                    📊 Our Impact
                                </span>
                            </div>
                            <h2 className={`text-3xl md:text-4xl font-bold text-gray-800 mb-3 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                                }`} style={{ animationDelay: '0.1s' }}>
                                Trusted by{' '}
                                <span className="bg-gradient-to-r from-[#0b6459] via-teal-600 to-[#0b6459] bg-clip-text text-transparent">
                                    Thousands
                                </span>
                            </h2>
                            <p className={`text-base text-gray-600 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                                }`} style={{ animationDelay: '0.2s' }}>
                                Join a thriving community of learners and educators achieving their goals every day
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6">
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

                    {/* Right: Growing Community Card - Harmonized Design */}
                    <div className={`relative transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                        }`} style={{ animationDelay: '0.4s' }}>
                        <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0b6459] via-teal-700 to-[#0b6459] border-2 border-[#0b6459]/20 ring-1 ring-[#0b6459]/10">
                            {/* Decorative background patterns - Teal theme */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
                                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
                            </div>
                            
                            {/* Grid pattern overlay - Teal theme */}
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}></div>
                            
                            {/* Main content */}
                            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                                {/* Large icon with glow effect - Teal theme */}
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#0b6459] to-teal-600 rounded-3xl blur-xl opacity-50 scale-110"></div>
                                    <div className="relative w-40 h-40 bg-gradient-to-br from-[#0b6459] via-teal-600 to-emerald-500 rounded-3xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300 border-4 border-white/30 ring-2 ring-teal-200/30">
                                        <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Floating decorative elements - Teal theme */}
                                <div className="absolute top-8 left-8 w-16 h-16 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/30 ring-1 ring-white/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                
                                <div className="absolute bottom-8 right-8 w-14 h-14 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-white/30 ring-1 ring-white/20">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                
                                {/* Title */}
                                <h3 className="text-2xl font-bold text-white mb-2 text-center">Growing Community</h3>
                                <p className="text-sm text-white/90 text-center max-w-xs mb-6">Join thousands of learners worldwide</p>
                                
                                {/* Stats badges - Teal theme */}
                                <div className="flex gap-3 mt-2">
                                    <div className="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full border-2 border-white/30 ring-1 ring-white/20 transition-all hover:scale-105 hover:border-white/40">
                                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Global Reach
                                        </span>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full border-2 border-white/30 ring-1 ring-white/20 transition-all hover:scale-105 hover:border-white/40">
                                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                            Active Growth
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
