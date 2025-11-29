import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUserGroup, HiBookOpen, HiPencil, HiEye } from 'react-icons/hi';
import CourseStatusBadge from './CourseStatusBadge';

export type CourseStatus = 'Published' | 'Draft';

export interface TutorCourse {
    id: number;
    title: string;
    image: string;
    studentCount: number;
    totalLessons: number;
    price: number;
    status: CourseStatus;
}

interface TutorCourseCardProps {
    course: TutorCourse;
}

const TutorCourseCard: React.FC<TutorCourseCardProps> = ({ course }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate('/dashboard/create-course', { state: { courseId: course.id } });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden group flex flex-col h-full border border-gray-100">
            <div className="relative aspect-video">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 leading-tight line-clamp-2 flex-grow pr-2 group-hover:text-[#0b6459] transition-colors">
                        {course.title}
                    </h3>
                    <CourseStatusBadge status={course.status} />
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 my-4 py-3 border-y border-gray-100">
                    <span className="flex items-center gap-2">
                        <HiUserGroup className="w-4 h-4" /> {course.studentCount} Students
                    </span>
                    <span className="flex items-center gap-2">
                        <HiBookOpen className="w-4 h-4" /> {course.totalLessons} Lessons
                    </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <p className="text-xl font-bold text-gray-800">${course.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={handleEdit}
                            className="p-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                         >
                            <HiPencil className="w-4 h-4" />
                        </button>
                         <button 
                            className="p-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <HiEye className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorCourseCard;