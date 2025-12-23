import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiCalendar, FiUsers, FiFileText, FiFolder, FiChevronLeft, FiMessageSquare, FiSettings } from "react-icons/fi";
import ScheduleTab from "./components/ScheduleTab";
import StudentsTab from "./components/StudentsTab";
import QuizzesTab from "./components/QuizzesTab";
import MaterialsTab from "./components/MaterialsTab";
import { classService, type ClassData } from "../../../../../services/classService";
import type { Session } from "../../../../../types/class";

type DetailTab = "Schedule" | "Students" | "Quizzes" | "Materials";

const ClassDetailPage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get class data from navigation state or fetch from API
    const initialClassData = location.state?.classData as ClassData | undefined;
    
    const [classData, setClassData] = useState<ClassData | null>(initialClassData || null);
    const [activeTab, setActiveTab] = useState<DetailTab>("Schedule");
    const [isLoading, setIsLoading] = useState(!initialClassData);
    const [showUpdateScheduleModal, setShowUpdateScheduleModal] = useState(false);

    useEffect(() => {
        // If no data in state, fetch from API using classId
        if (!initialClassData && classId) {
            const loadClassData = async () => {
                setIsLoading(true);
                
                try {
                    const data = await classService.getClassDetailForPage(classId);
                    setClassData(data);
                } catch (apiError) {
                    console.warn('Using mock data due to API failure');
                    // The service already returns mock data on failure, so this shouldn't happen
                    // But keeping as fallback
                    setClassData(null);
                } finally {
                    setIsLoading(false);
                }
            };
            
            loadClassData();
        }
    }, [classId, initialClassData]);

    const handleBack = () => {
        navigate('/dashboard/my-class');
    };

    const handleOpenReschedule = (sessionDate: string) => {
        console.log('Open reschedule modal for:', sessionDate);
    };

    const handleViewPastSession = (session: any) => {
        console.log('View past session:', session);
    };

    const handleAssignQuiz = () => {
        console.log('Open assign quiz modal');
    };

    const handleViewQuizResult = (quizId: number) => {
        console.log('View quiz result for quiz:', quizId);
    };

    // Mock data for sessions - in real app this would come from API
    const upcomingSessions: Session[] = classData ? [
        {
            id: 'session-1',
            sessionDatetime: '2025-12-22T14:00:00',
            sessionType: classData.type === '1-on-1' ? 'ON_ONE_ONE' : 'GROUP',
            classInfo: {
                id: classData.id,
                title: classData.classTitle
            },
            students: classData.students.map(student => ({
                id: student.id,
                fullName: student.name,
                avatarUrl: student.avatar
            })),
            tutor: {
                id: 'tutor-1',
                fullName: 'Tutor Name',
                avatarUrl: ''
            },
            createdAt: '2025-12-20T10:00:00',
            updatedAt: '2025-12-20T10:00:00',
            notes: 'Review homework and practice speaking'
        },
        {
            id: 'session-2', 
            sessionDatetime: '2025-12-24T14:00:00',
            sessionType: classData.type === '1-on-1' ? 'ON_ONE_ONE' : 'GROUP',
            classInfo: {
                id: classData.id,
                title: classData.classTitle
            },
            students: classData.students.map(student => ({
                id: student.id,
                fullName: student.name,
                avatarUrl: student.avatar
            })),
            tutor: {
                id: 'tutor-1',
                fullName: 'Tutor Name',
                avatarUrl: ''
            },
            createdAt: '2025-12-20T10:00:00',
            updatedAt: '2025-12-20T10:00:00'
        }
    ] : [];

    const pastSessions = [
        {
            id: 3,
            date: "2025-11-18",
            time: "14:00 - 15:30",
            actualStartTime: "14:05",
            actualEndTime: "15:35",
            duration: "1h 30m",
            topic: "Getting Started with React",
            status: "completed",
            recording: true,
            participantsCount: 5,
            notes: "Students showed good understanding of React basics. Need to review component lifecycle in next session.",
            attendanceHistory: [
                { studentId: "1", studentName: "Alice Johnson", joinTime: "14:05", leaveTime: "15:35", status: "present" },
                { studentId: "2", studentName: "Bob Smith", joinTime: "14:10", leaveTime: "15:30", status: "present" },
                { studentId: "3", studentName: "Charlie Brown", joinTime: "14:00", leaveTime: "15:35", status: "present" },
                { studentId: "4", studentName: "Diana Wilson", joinTime: "14:15", leaveTime: "15:20", status: "present" },
                { studentId: "5", studentName: "Eve Davis", joinTime: "14:08", leaveTime: "15:35", status: "present" }
            ],
            absentStudents: []
        },
        {
            id: 4,
            date: "2025-11-15",
            time: "10:00 - 11:30",
            actualStartTime: "10:02",
            actualEndTime: "11:28",
            duration: "1h 26m",
            topic: "Advanced JavaScript Concepts",
            status: "completed",
            recording: true,
            participantsCount: 4,
            notes: "Covered closures and prototypes. One student had connection issues.",
            attendanceHistory: [
                { studentId: "1", studentName: "Alice Johnson", joinTime: "10:02", leaveTime: "11:28", status: "present" },
                { studentId: "2", studentName: "Bob Smith", joinTime: "10:05", leaveTime: "11:25", status: "present" },
                { studentId: "3", studentName: "Charlie Brown", joinTime: "10:00", leaveTime: "11:28", status: "present" },
                { studentId: "6", studentName: "Frank Miller", joinTime: "10:10", leaveTime: "11:28", status: "present" }
            ],
            absentStudents: [
                { studentId: "4", studentName: "Diana Wilson", reason: "Sick" },
                { studentId: "5", studentName: "Eve Davis", reason: "Family emergency" }
            ]
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b6459] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading class details...</p>
                </div>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Class not found</h2>
                    <p className="mt-2 text-gray-600">The class you're looking for doesn't exist.</p>
                    <button
                        onClick={handleBack}
                        className="mt-4 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]"
                    >
                        Back to My Classes
                    </button>
                </div>
            </div>
        );
    }



    const NavItem: React.FC<{ label: DetailTab, icon: React.ReactNode }> = ({ label, icon }) => (
        <button
            onClick={() => setActiveTab(label)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                activeTab === label
                ? 'bg-[#0b6459] text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
        >
            <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center ${activeTab === label ? 'text-white' : 'text-gray-500'}`}>
                {icon}
            </div>
            <p className={`font-bold text-sm ${activeTab === label ? 'text-white' : 'text-gray-800'}`}>{label}</p>
        </button>
    );

    return (
        <>
            {/* Main Container - Single unified block */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Header Section */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                        <button onClick={handleBack} className="mt-1 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-600">
                            <FiChevronLeft />
                        </button>
                        <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{classData?.classTitle}</h1>
                                    <div className="flex items-center gap-3 mt-2 text-sm">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${classData?.type === '1-on-1' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                            {classData?.type}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${classData?.status === 'Ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {classData?.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FiCalendar className="w-4 h-4" />
                                        <span>Mon, Wed 7:00 PM - 8:30 PM</span>
                                    </div>
                                    <button 
                                        onClick={() => setShowUpdateScheduleModal(true)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Update Class Schedule"
                                    >
                                        <FiSettings className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors text-gray-700 flex items-center gap-2">
                                        <FiMessageSquare className="w-4 h-4" />
                                        <span className="text-sm font-medium">Chat</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col lg:flex-row">
                    
                    {/* Left Sidebar Navigation */}
                    <div className="w-full lg:w-64 flex-shrink-0 p-4 border-r border-gray-100 lg:min-h-[600px]">
                        <nav className="space-y-2">
                            <NavItem label="Schedule" icon={<FiCalendar />} />
                            <NavItem label="Students" icon={<FiUsers />} />
                            <NavItem label="Quizzes" icon={<FiFileText />} />
                            <NavItem label="Materials" icon={<FiFolder />} />
                        </nav>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-grow w-full min-w-0">
                        <div className="p-4 space-y-6">
                            {classData && (
                                <>
                                    {activeTab === "Schedule" && (
                                        <ScheduleTab 
                                            upcomingSessions={upcomingSessions}
                                            pastSessions={pastSessions}
                                            onOpenReschedule={handleOpenReschedule} 
                                            onViewPastSession={handleViewPastSession} 
                                        />
                                    )}
                                    {activeTab === "Students" && (
                                        <StudentsTab classData={classData} />
                                    )}
                                    {activeTab === "Quizzes" && (
                                        <QuizzesTab classData={classData} onAssignQuiz={handleAssignQuiz} onViewQuizResult={handleViewQuizResult} />
                                    )}
                                    {activeTab === "Materials" && (
                                        <MaterialsTab classData={classData} />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Schedule Modal */}
            {showUpdateScheduleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Update Class Schedule</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
                                <div className="flex gap-2 flex-wrap">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                        <label key={day} className="flex items-center gap-2">
                                            <input type="checkbox" className="rounded" defaultChecked={day === 'Monday' || day === 'Wednesday'} />
                                            <span className="text-sm">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        defaultValue="19:00"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                    <input
                                        type="time"
                                        defaultValue="20:30"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowUpdateScheduleModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowUpdateScheduleModal(false)}
                                className="px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors"
                            >
                                Update Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClassDetailPage;
