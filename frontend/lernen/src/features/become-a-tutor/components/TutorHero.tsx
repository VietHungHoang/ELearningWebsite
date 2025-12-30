import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import useIntersectionObserver from "./useIntersectionObserver";
import { TutorHeroPanel } from "./TutorHeroPanel";

const TutorHero: React.FC = () => {
    const { t } = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = useIntersectionObserver(sectionRef as React.RefObject<Element>, { threshold: 0.1 });

    return (
        <section ref={sectionRef} className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column */}
                <div className="text-center lg:text-left">
                    <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 leading-tight transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                        <span className="text-[#065A46]">
                            {t('becomeTutor.hero.title')}
                        </span>{' '}
                        <br />
                        <span className="text-gray-700 text-3xl sm:text-3xl md:text-4xl">{t('becomeTutor.hero.subtitle')}</span>
                    </h1>
                    <p
                        className={`mt-4 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                        style={{ animationDelay: "0.2s" }}
                    >
                        {t('becomeTutor.hero.description')}
                    </p>
                    <div
                        className={`mt-8 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                        style={{ animationDelay: "0.4s" }}
                    >
                        <button
                            onClick={() => window.location.href = '/signup?role=tutor'}
                            className="px-8 py-4 bg-[#065A46] text-white font-bold rounded-lg transition-colors btn-scale text-lg"
                        >
                            {t('becomeTutor.hero.ctaButton')}
                        </button>
                    </div>
                </div>

                {/* Right Column - Interactive Panel */}
                <div
                    className={`relative flex items-center justify-center transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: "0.3s" }}
                >
                    <TutorHeroPanel />
                </div>
            </div>
        </section>
    );
};

export default TutorHero;
