// import React, { useRef } from 'react';
// import HomepageTutorCard, { HomepageTutor } from './HomepageTutorCard';
// import type { AppPage } from '../../../App';
// import useIntersectionObserver from './useIntersectionObserver';

// interface TopTutorsProps {
//     navigateToApp: (page: AppPage) => void;
// }

// const mockTutors: HomepageTutor[] = [
//     { id: 1, name: 'Cynthia Hunter', avatar: 'https://picsum.photos/seed/cynthia/128/128', subject: 'Mathematics', rating: 5.0, price: 40.00 },
//     { id: 2, name: 'Steven Ford', avatar: 'https://picsum.photos/seed/steven/128/128', subject: 'Physics', rating: 4.8, price: 35.00 },
//     { id: 3, name: 'Antony Clara', avatar: 'https://picsum.photos/seed/antonyC/128/128', subject: 'Literature', rating: 4.9, price: 38.00 },
//     { id: 4, name: 'Arianne Kearns', avatar: 'https://picsum.photos/seed/arianne/128/128', subject: 'History', rating: 4.7, price: 30.00 },
// ];

// const TopTutors: React.FC<TopTutorsProps> = ({ navigateToApp }) => {
//     const sectionRef = useRef<HTMLElement>(null);
//     const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

//     return (
//         <section ref={sectionRef} className="py-16 sm:py-24 bg-[#F8F7F4]">
//             <div className="container mx-auto px-4">
//                  <div className="text-center mb-12">
//                     <h2 className={`text-4xl font-bold text-gray-800 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>Meet Our Top Tutors</h2>
//                     <p className={`mt-4 text-lg text-gray-600 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>Connect with highly-rated tutors for personalized learning.</p>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//                     {mockTutors.map((tutor, index) => (
//                         <div key={tutor.id} className={`transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${0.2 + index * 0.1}s`}}>
//                             <HomepageTutorCard tutor={tutor} />
//                         </div>
//                     ))}
//                 </div>
//                  <div className={`mt-12 text-center transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
//                     <button onClick={() => navigateToApp('findTutors')} className="px-8 py-3 border border-gray-300 text-gray-800 font-bold rounded-lg hover:bg-white transition-colors">
//                         View All Tutors
//                     </button>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default TopTutors;