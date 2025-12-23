import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiPlus } from 'react-icons/hi';
import type { TutorCourse } from '../components/TutorCourseCard';
import TutorCourseCard from '../components/TutorCourseCard';
import { useBreadcrumb } from '../../context/BreadcrumbContext';

const mockTutorCourses: TutorCourse[] = [
    {
        id: 1,
        title: 'Time Management Mastery: Boost Your Productivity',
        image: 'https://picsum.photos/seed/grid1/400/225',
        studentCount: 120,
        totalLessons: 27,
        price: 132.00,
        status: 'Published'
    },
    {
        id: 2,
        title: 'Decision-Making Mastery: Make Better Choices',
        image: 'https://picsum.photos/seed/grid2/400/225',
        studentCount: 85,
        totalLessons: 9,
        price: 398.52,
        status: 'Published'
    },
    {
        id: 3,
        title: 'Beginner\'s Guide to Python Programming',
        image: 'https://picsum.photos/seed/python/400/225',
        studentCount: 0,
        totalLessons: 15,
        price: 99.00,
        status: 'Draft'
    },
    {
        id: 4,
        title: 'Advanced Productivity Hacks for Creatives',
        image: 'https://picsum.photos/seed/grid4/400/225',
        studentCount: 45,
        totalLessons: 27,
        price: 180.00,
        status: 'Published'
    },
];

type FilterTab = 'All' | 'Published' | 'Draft';

const MyCoursesPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<FilterTab>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'My Courses' }
        ]);
    }, [setBreadcrumb]);

    const handleCreateCourse = () => {
        navigate('/dashboard/create-course');
    };

    const filteredCourses = useMemo(() => {
        return mockTutorCourses
            .filter(course => {
                if (activeTab === 'All') return true;
                return course.status === activeTab;
            })
            .filter(course => 
                course.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [activeTab, searchTerm]);

    const TabButton: React.FC<{ label: FilterTab }> = ({ label }) => (
        <button
            onClick={() => setActiveTab(label)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === label ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-white/50'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
                    <p className="text-gray-600 mt-1">Manage all your courses in one place.</p>
                </div>
                <button 
                    onClick={handleCreateCourse}
                    className="flex items-center gap-2 bg-[#0b6459] text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-[#084c43] transition-colors"
                >
                    <HiPlus className="w-5 h-5" />
                    <span>Create New Course</span>
                </button>
            </div>


            {/* Filters */}
            <div className="flex justify-between items-center mt-6">
                <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center">
                    <TabButton label="All" />
                    <TabButton label="Published" />
                    <TabButton label="Draft" />
                </div>
                <div className="relative w-full max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiSearch className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search my courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0b6459]"
                    />
                </div>
            </div>

            {/* Course Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                    <TutorCourseCard key={course.id} course={course} />
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div className="text-center py-20 col-span-full bg-white rounded-lg mt-8 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800">No Courses Found</h3>
                    <p className="text-gray-500 mt-2">No courses match your current filters.</p>
                </div>
            )}
        </div>
    );
};

export default MyCoursesPage;