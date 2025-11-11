
import React, { useRef, useState, useEffect } from 'react';
import type { AppPage } from '../../../../App';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { Course } from './CourseCard';
import CourseCard from './CourseCard';

// Enhanced mock data with categories
const mockCourses: Course[] = [
    {
        id: 1,
        image: 'https://picsum.photos/seed/course1/400/225',
        title: 'Mastering Algebra: A Comprehensive Guide',
        lessons: 24,
        students: 120,
        price: 99.99,
        category: 'Mathematics',
        categoryColor: 'bg-blue-500',
    },
    {
        id: 2,
        image: 'https://picsum.photos/seed/course2/400/225',
        title: 'Introduction to Physics: From Motion to Magnetism',
        lessons: 32,
        students: 85,
        price: 119.99,
        category: 'Science',
        categoryColor: 'bg-green-500',
    },
    {
        id: 3,
        image: 'https://picsum.photos/seed/course3/400/225',
        title: 'Creative Writing Workshop: Unleash Your Inner Author',
        lessons: 18,
        students: 250,
        price: 79.99,
        category: 'Writing',
        categoryColor: 'bg-purple-500',
    },
    {
        id: 4,
        image: 'https://picsum.photos/seed/course4/400/225',
        title: 'Digital Art Fundamentals with Procreate',
        lessons: 20,
        students: 180,
        price: 89.99,
        category: 'Art',
        categoryColor: 'bg-red-500',
    }
];

// Mock tutor for the course card
const mockTutor = {
    name: 'Cynthia Hunter',
    avatar: 'https://picsum.photos/seed/cynthia/96/96',
};

const CoursesSection: React.FC = () => {
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
                {mockCourses.map(course => (
                    <div key={course.id} className="flex-shrink-0 w-80">
                        <CourseCard course={course} tutor={mockTutor} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesSection;
