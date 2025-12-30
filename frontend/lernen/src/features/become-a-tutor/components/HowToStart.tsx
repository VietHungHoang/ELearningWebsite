import React from "react";
import { FiUserPlus, FiCalendar, FiTrendingUp } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const HowToStart: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="py-16 sm:py-20 bg-[#faf8f5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <div className="flex items-center justify-center mb-4">
                        <div className="h-px w-12 bg-gray-300"></div>
                        <span className="mx-4 text-sm font-semibold text-[#065A46] tracking-wide uppercase">
                            {t('becomeTutor.howToStart.sectionLabel')}
                        </span>
                        <div className="h-px w-12 bg-gray-300"></div>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        {t('becomeTutor.howToStart.title')}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        {t('becomeTutor.howToStart.description')}
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 - Profile */}
                    <div className="flex flex-col rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: 'rgb(250, 248, 245)' }}>
                        <div className="p-6 flex-1 text-center">
                            <div className="inline-flex items-center px-3 py-1 text-[11px] font-semibold rounded-full bg-gray-100 text-gray-700 mx-auto">
                                BƯỚC 1
                            </div>
                            <div className="mt-5 w-20 h-20 rounded-full bg-[#F8F7F4] flex items-center justify-center mx-auto">
                                <FiUserPlus className="text-[#065A46]" size={40} />
                            </div>
                            <h3 className="mt-5 text-xl font-semibold text-[#065A46]">{t('becomeTutor.howToStart.steps.profile.title')}</h3>
                            <p className="mt-2 text-gray-600">
                                {t('becomeTutor.howToStart.steps.profile.description')}
                            </p>
                        </div>
                        <div className="px-6 pb-6">
                            <button 
                                onClick={() => window.location.href = '/signup?role=tutor'}
                                className="w-full rounded-lg bg-gray-100 text-gray-800 text-sm font-medium py-2.5 border border-gray-300 hover:bg-gray-200 transition-colors"
                            >
                                {t('becomeTutor.howToStart.steps.profile.button')}
                            </button>
                        </div>
                    </div>

                    {/* Card 2 - Availability */}
                    <div className="flex flex-col rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: 'rgb(250, 248, 245)' }}>
                        <div className="p-6 flex-1 text-center">
                            <div className="inline-flex items-center px-3 py-1 text-[11px] font-semibold rounded-full bg-gray-100 text-gray-700 mx-auto">
                                BƯỚC 2
                            </div>
                            <div className="mt-5 w-20 h-20 rounded-full bg-[#F8F7F4] flex items-center justify-center mx-auto">
                                <FiCalendar className="text-[#065A46]" size={40} />
                            </div>
                            <h3 className="mt-5 text-xl font-semibold text-[#065A46]">{t('becomeTutor.howToStart.steps.availability.title')}</h3>
                            <p className="mt-2 text-gray-600">
                                {t('becomeTutor.howToStart.steps.availability.description')}
                            </p>
                        </div>
                        <div className="px-6 pb-6">
                            <button 
                                onClick={() => window.location.href = '/signup?role=tutor'}
                                className="w-full rounded-lg bg-gray-100 text-gray-800 text-sm font-medium py-2.5 border border-gray-300 hover:bg-gray-200 transition-colors"
                            >
                                {t('becomeTutor.howToStart.steps.availability.button')}
                            </button>
                        </div>
                    </div>

                    {/* Card 3 - Earning - Emphasized */}
                    <div className="flex flex-col rounded-2xl bg-[#065A46] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="p-6 flex-1 text-center">
                            <div className="inline-flex items-center px-3 py-1 text-[11px] font-semibold rounded-full bg-white/20 text-white mx-auto">
                                BƯỚC 3
                            </div>
                            <div className="mt-5 w-20 h-20 rounded-full bg-[#054A3A] flex items-center justify-center mx-auto">
                                <FiTrendingUp className="text-white" size={40} />
                            </div>
                            <h3 className="mt-5 text-xl font-semibold">{t('becomeTutor.howToStart.steps.earning.title')}</h3>
                            <p className="mt-2 text-white/80">
                                {t('becomeTutor.howToStart.steps.earning.description')}
                            </p>
                        </div>
                        <div className="px-6 pb-6">
                            <button 
                                onClick={() => window.location.href = '/signup?role=tutor'}
                                className="w-full rounded-lg bg-orange-500 text-white text-sm font-semibold py-2.5 hover:bg-orange-600 transition-colors flex items-center justify-center"
                            >
                                {t('becomeTutor.howToStart.steps.earning.button')}
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowToStart;
