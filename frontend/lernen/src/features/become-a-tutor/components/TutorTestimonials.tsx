import React from "react";
import type { Testimonial } from "./TestimonialCard";
import TestimonialCard from "./TestimonialCard";

const mockTutorTestimonials: Testimonial[] = [
    {
        id: 1,
        quote: "Teaching on Lernen has been an incredibly rewarding experience. The platform is seamless and allows me to focus on what I love: teaching.",
        name: "Cynthia H.",
        role: "Mathematics Tutor",
        avatar: "https://picsum.photos/seed/cynthia/80/80",
    },
    {
        id: 2,
        quote: "I love the flexibility. I can set my own hours and teach from anywhere in the world. It's the perfect way to share my passion for physics.",
        name: "Steven F.",
        role: "Physics Tutor",
        avatar: "https://picsum.photos/seed/steven/80/80",
    },
    {
        id: 3,
        quote: "The community of tutors and the support from the Lernen team are fantastic. I've grown so much as an educator since I joined.",
        name: "Arianne K.",
        role: "History Tutor",
        avatar: "https://picsum.photos/seed/arianne/80/80",
    },
];

const TutorTestimonials: React.FC = () => {
    return (
        <section className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800">
                        Hear From Our Tutors
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        See what other educators are saying about their
                        experience on Lernen.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {mockTutorTestimonials.map((t) => (
                        <TestimonialCard key={t.id} testimonial={t} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TutorTestimonials;
