import React from 'react';
import type { AppPage } from '../../../../App';
import { FiPlay, FiUsers } from 'react-icons/fi';

export interface Course {
    id: number;
    image: string;
    title: string;
    lessons: number;
    students: number;
    price: number;
    category: string;
    categoryColor: string;
}

interface CourseCardProps {
    course: Course;
    tutor: { name: string; avatar: string; };
}

const CourseCard: React.FC<CourseCardProps> = ({ course, tutor }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full group interactive-card">
            <div className="relative aspect-video overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover zoom-image" />
                <div className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white rounded-md ${course.categoryColor}`}>
                    {course.category}
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                    <img src={tutor.avatar} alt={tutor.name} className="w-6 h-6 rounded-full"/>
                    <span className="text-sm font-medium text-gray-600">{tutor.name}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 leading-tight flex-grow group-hover:text-[#0b6459] transition-colors">
                    {course.title}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-gray-500 border-y border-gray-100 my-4 py-3">
                    <span className="flex items-center gap-2">
                        <FiPlay /> {course.lessons} Lessons
                    </span>
                    <span className="flex items-center gap-2">
                        <FiUsers /> {course.students} Students
                    </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <p className="text-2xl font-bold text-gray-800">${course.price.toFixed(2)}</p>
                    <button 
                        className="text-sm font-semibold text-white bg-[#0b6459] rounded-lg px-5 py-2.5 hover:bg-[#084c43] transition-colors btn-scale"
                    >
                        View Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;