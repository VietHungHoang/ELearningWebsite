import React, { useRef } from "react";
import type { Testimonial } from "./TestimonialCard";
import TestimonialCard from "./TestimonialCard";
import { useTranslation } from "react-i18next";
import useIntersectionObserver from "./useIntersectionObserver";

const TutorTestimonials: React.FC = () => {
    const { t } = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = useIntersectionObserver(sectionRef as React.RefObject<Element>, { threshold: 0.1 });

    const testimonials: Testimonial[] = [
        {
            id: 1,
            quote: t('becomeTutor.testimonials.items.0.quote'),
            name: t('becomeTutor.testimonials.items.0.name'),
            role: t('becomeTutor.testimonials.items.0.role'),
            avatar: "https://picsum.photos/seed/cynthia/80/80",
        },
        {
            id: 2,
            quote: t('becomeTutor.testimonials.items.1.quote'),
            name: t('becomeTutor.testimonials.items.1.name'),
            role: t('becomeTutor.testimonials.items.1.role'),
            avatar: "https://picsum.photos/seed/steven/80/80",
        },
        {
            id: 3,
            quote: t('becomeTutor.testimonials.items.2.quote'),
            name: t('becomeTutor.testimonials.items.2.name'),
            role: t('becomeTutor.testimonials.items.2.role'),
            avatar: "https://picsum.photos/seed/arianne/80/80",
        },
    ];

    return (
        <section ref={sectionRef} className="bg-[#faf8f5] py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className={`text-4xl font-bold text-gray-800 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                        {t('becomeTutor.testimonials.title')}
                    </h2>
                    <p className={`mt-4 text-lg text-gray-600 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: "0.1s" }}>
                        {t('becomeTutor.testimonials.subtitle')}
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className={`transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                        >
                            <TestimonialCard testimonial={testimonial} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TutorTestimonials;
