// import React, { useRef } from 'react';
// import CourseCard, { Course } from './CourseCard';
// import type { AppPage } from '../../../App';
// import useIntersectionObserver from './useIntersectionObserver';

// interface PopularCoursesProps {
//     navigateToApp: (page: AppPage) => void;
// }

// const mockCourses: Course[] = [
//     {
//         id: 1,
//         image: 'https://picsum.photos/seed/course1/400/225',
//         title: 'Mastering Algebra: A Comprehensive Guide',
//         lessons: 24,
//         students: 120,
//         price: 99.99,
//         category: 'Mathematics',
//         categoryColor: 'bg-blue-500',
//     },
//     {
//         id: 2,
//         image: 'https://picsum.photos/seed/course2/400/225',
//         title: 'Introduction to Physics: Motion to Magnetism',
//         lessons: 32,
//         students: 85,
//         price: 119.99,
//         category: 'Science',
//         categoryColor: 'bg-green-500',
//     },
//     {
//         id: 3,
//         image: 'https://picsum.photos/seed/course3/400/225',
//         title: 'Creative Writing Workshop: Unleash Your Inner Author',
//         lessons: 18,
//         students: 250,
//         price: 79.99,
//         category: 'Writing',
//         categoryColor: 'bg-purple-500',
//     },
// ];

// const mockTutor = {
//     name: 'Cynthia Hunter',
//     avatar: 'https://picsum.photos/seed/cynthia/96/96',
// };

// const PopularCourses: React.FC<PopularCoursesProps> = ({ navigateToApp }) => {
//     const sectionRef = useRef<HTMLElement>(null);
//     const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

//     return (
//         <section ref={sectionRef} className="bg-white py-16 sm:py-24">
//             <div className="container mx-auto px-4">
//                 <div className="text-center mb-12">
//                     <h2 className={`text-4xl font-bold text-gray-800 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>Explore Popular Courses</h2>
//                     <p className={`mt-4 text-lg text-gray-600 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>Discover our most sought-after courses, designed to help you excel.</p>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {mockCourses.map((course, index) => (
//                          <div key={course.id} className={`transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${0.2 + index * 0.1}s`}}>
//                             <CourseCard course={course} tutor={mockTutor} navigateToApp={navigateToApp} />
//                         </div>
//                     ))}
//                 </div>
//                 <div className={`mt-12 text-center transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
//                     <button onClick={() => navigateToApp('findCourses')} className="px-8 py-3 bg-[#0b6459] text-white font-bold rounded-lg transition-colors btn-scale">
//                         View All Courses
//                     </button>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default PopularCourses;