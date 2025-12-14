import React from 'react';
import type { AppPage } from '../../../../App';
import { FiPlay, FiUsers, FiClock, FiStar } from 'react-icons/fi';
import type { Course, Tutor } from '../../../../types/api';

interface CourseCardProps {
    course: Course;
    tutor: Tutor;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, tutor }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full group interactive-card">
            <div className="relative aspect-[5/3] overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base font-bold text-gray-800 leading-tight mb-2 group-hover:text-[#0b6459] transition-colors">
                    {course.title}
                </h3>
                
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600">{tutor.name}</span>
                </div>
                
                <div className="grid grid-cols-2 text-sm gap-1 text-gray-500 my-3 py-1">
                    <span className="flex items-center gap-2">
                        <FiPlay /> {course.lessons} Lessons
                    </span>
                    <span className="flex items-center gap-2">
                        <FiClock /> {course.duration}
                    </span>
                    <span className="flex items-center gap-2">
                        <FiUsers /> {course.students} Students
                    </span>
                    <span className="flex items-center gap-2">
                        <FiStar /> {course.review} Review
                    </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <p className="text-xl font-bold text-gray-800">${course.price.toFixed(2)}</p>
                    <button 
                        className="text-sm font-semibold text-white bg-[#0b6459] rounded-lg px-3 py-2 hover:bg-[#084c43] transition-colors btn-scale"
                    >
                        View Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;