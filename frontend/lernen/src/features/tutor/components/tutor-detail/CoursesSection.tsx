
import React, { useRef, useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import CourseCard from './CourseCard';
import type { Course, Tutor } from '../../../../types/api';

interface CoursesSectionProps {
  courses: Course[];
  tutor: Tutor;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, tutor }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollability = () => {
        const el = scrollContainerRef.current;
        if (el) {
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1); // -1 for precision
        }
    };

    useEffect(() => {
        checkScrollability();
        const el = scrollContainerRef.current;
        el?.addEventListener('scroll', checkScrollability);
        window.addEventListener('resize', checkScrollability);
        return () => {
            el?.removeEventListener('scroll', checkScrollability);
            window.removeEventListener('resize', checkScrollability);
        };
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => scroll('left')} 
                        disabled={!canScrollLeft}
                        className="p-2 rounded-full bg-white border border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    >
                        <FiChevronLeft />
                    </button>
                    <button 
                        onClick={() => scroll('right')} 
                        disabled={!canScrollRight}
                        className="p-2 rounded-full bg-white border border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    >
                        <FiChevronRight />
                    </button>
                </div>
            </div>

            <div ref={scrollContainerRef} className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {courses.map(course => (
                    <div key={course.id} className="flex-shrink-0 w-70">
                        <CourseCard course={course} tutor={tutor} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesSection;
