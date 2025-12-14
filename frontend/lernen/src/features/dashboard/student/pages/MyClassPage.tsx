import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch } from 'react-icons/hi';
import Breadcrumb from '../../components/Breadcrumb';
import { classService, type ClassFilters } from '../../../../services/classService';
import type { Class } from '../../../../types/api';
import { useAuth } from '../../../../context/AuthContext';
import ClassCard from '../components/my-class/ClassCard';

// --- TYPE DEFINITIONS ---
export type ClassType = '1-on-1' | 'Group';
export type ClassStatus = 'Ongoing' | 'Completed';

export interface StudentInfo {
    id: string;
    name: string;
    avatar: string;
}

export interface Schedule {
    day: string; // e.g., 'Monday'
    time: string; // e.g., '10:00 AM'
}

export interface ClassData {
    id: string;
    courseTitle: string;
    students: StudentInfo[];
    type: ClassType;
    status: ClassStatus;
    schedules: Schedule[];
    startDate: string;
    completedSessions: number;
    totalSessions: number;
    // Detailed data for the modal
    quizzes: { id: string; title: string; status: 'Completed' | 'Pending' }[];
    materials: { id: string; name: string; type: 'PDF' | 'Video' | 'ZIP'; date: string }[];
}


// --- MOCK DATA ---
const mockClasses: ClassData[] = [
    { 
        id: '550e8400-e29b-41d4-a716-446655440100', 
        courseTitle: 'Advanced Calculus II: A Deep Dive into Multivariable Functions and Vector Analysis', 
        students: [{ id: '550e8400-e29b-41d4-a716-446655440000', name: 'Sarah Chapman', avatar: 'https://picsum.photos/seed/sarah/48/48' }],
        type: '1-on-1', 
        status: 'Ongoing',
        schedules: [
            { day: 'Monday', time: '10:00 AM' },
            { day: 'Wednesday', time: '2:00 PM' }
        ],
        startDate: 'Oct 1, 2025',
        completedSessions: 8,
        totalSessions: 12,
        quizzes: [
            { id: '550e8400-e29b-41d4-a716-446655440200', title: 'Mid-term Exam', status: 'Completed' },
            { id: '550e8400-e29b-41d4-a716-446655440201', title: 'Final Exam', status: 'Pending' }
        ],
        materials: [
            { id: '550e8400-e29b-41d4-a716-446655440300', name: 'Chapter_3_Notes.pdf', type: 'PDF', date: '2025-10-15' },
            { id: '550e8400-e29b-41d4-a716-446655440301', name: 'Lecture_Recording_W4.mp4', type: 'Video', date: '2025-10-22' }
        ]
    },
    { 
        id: '550e8400-e29b-41d4-a716-446655440101', 
        courseTitle: 'Intro to Creative Writing', 
        students: [
            { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Ann Coleman', avatar: 'https://picsum.photos/seed/ann/48/48' },
            { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Judy Dixon', avatar: 'https://picsum.photos/seed/judy/48/48' },
            { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Michael Brown', avatar: 'https://picsum.photos/seed/michael/48/48' },
        ],
        type: 'Group', 
        status: 'Ongoing',
        schedules: [
            { day: 'Wednesday', time: '02:00 PM' },
            { day: 'Friday', time: '10:00 AM' }
        ],
        startDate: 'Sep 15, 2025',
        completedSessions: 6,
        totalSessions: 10,
        quizzes: [],
        materials: [{ id: '550e8400-e29b-41d4-a716-446655440302', name: 'Project_Brief.pdf', type: 'PDF', date: '2025-10-10' }]
    },
    { 
        id: '550e8400-e29b-41d4-a716-446655440102', 
        courseTitle: 'Physics 101 Review', 
        students: [{ id: '550e8400-e29b-41d4-a716-446655440004', name: 'David Wilson', avatar: 'https://picsum.photos/seed/david/48/48' }],
        type: '1-on-1', 
        status: 'Completed',
        schedules: [
            { day: 'Friday', time: '04:00 PM' },
            { day: 'Saturday', time: '11:00 AM' }
        ],
        startDate: 'Aug 20, 2025',
        completedSessions: 15,
        totalSessions: 15,
        quizzes: [{ id: '550e8400-e29b-41d4-a716-446655440203', title: 'Final Physics Quiz', status: 'Completed' }],
        materials: []
    },
];

type FilterTab = 'Ongoing Classes' | 'Completed Classes';

// --- MAIN COMPONENT ---
const MyClassPage: React.FC = () => {
    const { state } = useAuth();
    const navigate = useNavigate();
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<FilterTab>('Ongoing Classes');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch classes data
    useEffect(() => {
        const fetchClasses = async () => {
            if (!state.user?.id) return;

            try {
                setLoading(true);
                setError(null);

                const filters: ClassFilters = {
                    page: currentPage,
                    limit: itemsPerPage
                };

                const tutorId = state.user.id;
                const response = await classService.getClassesByTutorId(tutorId, filters);

                if (response.success) {
                    // Convert API response to component format
                    const convertedClasses: ClassData[] = response.data.content.map(classItem => ({
                        id: classItem.id,
                        courseTitle: classItem.courseTitle,
                        students: classItem.students,
                        type: classItem.type,
                        status: classItem.status,
                        schedules: classItem.schedules,
                        startDate: classItem.startDate,
                        completedSessions: classItem.completedSessions,
                        totalSessions: classItem.totalSessions,
                        quizzes: classItem.quizzes,
                        materials: classItem.materials
                    }));
                    
                    setClasses(convertedClasses);
                    setTotalElements(response.data.totalElements);
                } else {
                    setError(response.message || 'Failed to fetch classes');
                }
            } catch (err) {
                setError('Failed to fetch classes');
                console.error('Error fetching classes:', err);
                
                // Fallback to mock data if API fails
                setClasses(mockClasses);
                setTotalElements(mockClasses.length);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [state.user?.id, currentPage]);

    const handleViewDetails = (classData: ClassData) => {
        // Navigate to class detail page with class data in state
        navigate(`/dashboard/my-class/${classData.id}`, { 
            state: { classData } 
        });
    };

    const filteredClasses = useMemo(() => {
        const statusFilter = activeTab === 'Ongoing Classes' ? 'Ongoing' : 'Completed';
        return classes
            .filter(c => c.status === statusFilter)
            .filter(c =>
                c.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.students.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
    }, [classes, activeTab, searchTerm]);
    
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
            <Breadcrumb
                items={[
                    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
                    { label: 'My Classes', isActive: true }
                ]}
                className="mb-6"
            />

            <div className="flex justify-between items-center mt-6">
                <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center">
                    <TabButton label="Ongoing Classes" />
                    <TabButton label="Completed Classes" />
                </div>
                 <div className="relative w-full max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiSearch className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by class or student..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0b6459]"
                    />
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b6459] mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading classes...</p>
                    </div>
                ) : error ? (
                    <div className="col-span-full text-center py-20">
                        <h3 className="text-lg font-bold text-red-600">Error Loading Classes</h3>
                        <p className="text-gray-500 mt-2">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredClasses.length > 0 ? (
                    filteredClasses.map(classData => (
                        <ClassCard key={classData.id} classData={classData} onViewDetails={() => handleViewDetails(classData)} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-white rounded-lg">
                        <h3 className="text-lg font-bold text-gray-800">No Classes Found</h3>
                        <p className="text-gray-500 mt-2">There are no classes that match your current filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyClassPage;