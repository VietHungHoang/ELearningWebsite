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
        <section ref={sectionRef} className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-4 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                        }`}>
                        Ready to{' '}
                        <span className="bg-gradient-to-r from-[#0b6459] via-teal-600 to-[#0b6459] bg-clip-text text-transparent">
                            Start Your Journey?
                        </span>
                    </h2>
                    <p className={`text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                        }`} style={{ animationDelay: '0.1s' }}>
                        Whether you want to learn from experts or share your knowledge, we've got you covered.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Student CTA Card */}
                    <div
                        className={`group bg-gradient-to-br from-[#0b6459] to-teal-700 rounded-2xl p-8 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                            }`}
                        style={{ animationDelay: '0.2s' }}
                    >
                        {/* Icon */}
                        <div className="mb-6">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                <FiBookOpen className="text-white text-3xl" />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-3xl font-bold text-white mb-3">
                            For Students
                        </h3>
                        <p className="text-teal-100 text-base mb-6 leading-relaxed">
                            Start learning from expert tutors today. Get personalized education tailored to your goals.
                        </p>

                        {/* Benefits */}
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center text-white text-sm">
                                <svg className="w-5 h-5 mr-2 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Free trial session • No credit card
                            </li>
                            <li className="flex items-center text-white text-sm">
                                <svg className="w-5 h-5 mr-2 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Money-back guarantee
                            </li>
                        </ul>

                        {/* CTA Button */}
                        <button
                            onClick={handleStudentSignup}
                            className="w-full px-6 py-3 bg-white text-[#0b6459] font-bold text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            Start Learning Now
                            <FiArrowRight size={18} />
                        </button>
                    </div>

                    {/* Tutor CTA Card */}
                    <div
                        className={`group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                            }`}
                        style={{ animationDelay: '0.4s' }}
                    >
                        {/* Icon */}
                        <div className="mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                                <FiUsers className="text-white text-3xl" />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-3xl font-bold text-white mb-3">
                            For Tutors
                        </h3>
                        <p className="text-gray-300 text-base mb-6 leading-relaxed">
                            Share your expertise and earn money teaching students worldwide. Set your own schedule.
                        </p>

                        {/* Benefits */}
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center text-white text-sm">
                                <svg className="w-5 h-5 mr-2 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Set your own rates • Flexible hours
                            </li>
                            <li className="flex items-center text-white text-sm">
                                <svg className="w-5 h-5 mr-2 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Global student base
                            </li>
                        </ul>

                        {/* CTA Button */}
                        <button
                            onClick={handleTutorSignup}
                            className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            Apply as Tutor
                            <FiArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Bottom message */}
                <div className={`mt-10 text-center transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                    }`} style={{ animationDelay: '0.6s' }}>
                    <p className="text-gray-600">
                        ✨ <span className="font-semibold">Join today</span> and get started in less than 2 minutes
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
