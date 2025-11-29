import React, { useRef } from 'react';
import { FiArrowRight, FiBookOpen, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useIntersectionObserver from './useIntersectionObserver';

const CTASection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();
    const isVisible = useIntersectionObserver(sectionRef as React.RefObject<Element>, { threshold: 0.3 });

    const handleStudentSignup = () => {
        navigate('/auth?tab=signup&role=student');
    };

    const handleTutorSignup = () => {
        navigate('/auth?tab=signup&role=tutor');
    };

    return (
        <section ref={sectionRef} className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className={`text-3xl md:text-4xl font-bold text-gray-800 mb-3 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                        }`}>
                        Ready to{' '}
                        <span className="bg-gradient-to-r from-[#0b6459] via-teal-600 to-[#0b6459] bg-clip-text text-transparent">
                            Start Your Journey?
                        </span>
                    </h2>
                    <p className={`text-base text-gray-600 max-w-2xl mx-auto transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                        }`} style={{ animationDelay: '0.1s' }}>
                        Whether you want to learn from experts or share your knowledge, we've got you covered.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Student CTA Card */}
                    <div
                        className={`group bg-gradient-to-br from-[#0b6459] to-teal-700 rounded-xl p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                            }`}
                        style={{ animationDelay: '0.2s' }}
                    >
                        {/* Icon */}
                        <div className="mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <FiBookOpen className="text-white text-2xl" />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold text-white mb-2">
                            For Students
                        </h3>
                        <p className="text-teal-100 text-sm mb-4 leading-relaxed">
                            Start learning from expert tutors today. Get personalized education tailored to your goals.
                        </p>

                        {/* Benefits */}
                        <ul className="space-y-1.5 mb-4">
                            <li className="flex items-center text-white text-xs">
                                <svg className="w-4 h-4 mr-1.5 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Free trial session • No credit card
                            </li>
                            <li className="flex items-center text-white text-xs">
                                <svg className="w-4 h-4 mr-1.5 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Money-back guarantee
                            </li>
                        </ul>

                        {/* CTA Button */}
                        <button
                            onClick={handleStudentSignup}
                            className="w-full px-5 py-2.5 bg-white text-[#0b6459] font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            Start Learning Now
                            <FiArrowRight size={16} />
                        </button>
                    </div>

                    {/* Tutor CTA Card */}
                    <div
                        className={`group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                            }`}
                        style={{ animationDelay: '0.4s' }}
                    >
                        {/* Icon */}
                        <div className="mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                                <FiUsers className="text-white text-2xl" />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold text-white mb-2">
                            For Tutors
                        </h3>
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                            Share your expertise and earn money teaching students worldwide. Set your own schedule.
                        </p>

                        {/* Benefits */}
                        <ul className="space-y-1.5 mb-4">
                            <li className="flex items-center text-white text-xs">
                                <svg className="w-4 h-4 mr-1.5 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Set your own rates • Flexible hours
                            </li>
                            <li className="flex items-center text-white text-xs">
                                <svg className="w-4 h-4 mr-1.5 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Global student base
                            </li>
                        </ul>

                        {/* CTA Button */}
                        <button
                            onClick={handleTutorSignup}
                            className="w-full px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            Apply as Tutor
                            <FiArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Bottom message */}
                <div className={`mt-8 text-center transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                    }`} style={{ animationDelay: '0.6s' }}>
                    <p className="text-sm text-gray-600">
                        ✨ <span className="font-semibold">Join today</span> and get started in less than 2 minutes
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
