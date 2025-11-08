// import React, { useRef } from 'react';
// import { QuoteIcon } from './icons/QuoteIcon';
// import TestimonialCard, { Testimonial } from './TestimonialCard';
// import useIntersectionObserver from './useIntersectionObserver';

// const mockTestimonials: Testimonial[] = [
//     {
//         id: 1,
//         quote: "Lernen has been a game-changer for my studies. My tutor is incredibly supportive and knowledgeable. I've seen a huge improvement in my grades!",
//         name: 'Sarah Chapman',
//         role: 'University Student',
//         avatar: 'https://picsum.photos/seed/sarah/80/80',
//     },
//     {
//         id: 2,
//         quote: "The flexibility of scheduling and the quality of tutors are top-notch. I can finally learn at my own pace with experts who truly care.",
//         name: 'Michael B.',
//         role: 'High School Student',
//         avatar: 'https://picsum.photos/seed/michael/80/80',
//     },
//     {
//         id: 3,
//         quote: "I love the platform! It's so easy to use, and finding a course that fit my needs was a breeze. Highly recommended for anyone looking to upskill.",
//         name: 'Jessica L.',
//         role: 'Working Professional',
//         avatar: 'https://picsum.photos/seed/jessica/80/80',
//     },
// ];

// const Testimonials: React.FC = () => {
//     const sectionRef = useRef<HTMLElement>(null);
//     const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

//     return (
//         <section ref={sectionRef} className="bg-white py-16 sm:py-24">
//             <div className="container mx-auto px-4">
//                  <div className="text-center mb-12">
//                     <h2 className={`text-4xl font-bold text-gray-800 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>What Our Students Say</h2>
//                     <p className={`mt-4 text-lg text-gray-600 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>Real stories from students who have achieved their goals with Lernen.</p>
//                 </div>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {mockTestimonials.map((t, index) => (
//                         <div key={t.id} className={`transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${0.2 + index * 0.15}s`}}>
//                             <TestimonialCard testimonial={t} />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Testimonials;