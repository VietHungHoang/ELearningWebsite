import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { ClassData } from "./MyClassPage";
import { FiCalendar, FiUsers, FiFileText, FiFolder, FiChevronLeft } from "react-icons/fi";
import ScheduleTab from "../components/class-detail/ScheduleTab";
import StudentsTab from "../components/class-detail/StudentsTab";
import QuizzesTab from "../components/class-detail/QuizzesTab";
import MaterialsTab from "../components/class-detail/MaterialsTab";

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

    useEffect(() => {
        // If no data in state, fetch from API using classId
        if (!initialClassData && classId) {
            setIsLoading(true);
            // TODO: Replace with actual API call
            // fetchClassData(classId).then(data => {
            //     setClassData(data);
            //     setIsLoading(false);
            // });
            
            // Mock data for demonstration
            setTimeout(() => {
                setIsLoading(false);
                // If still no data, redirect back
                if (!classData) {
                    navigate('/dashboard/my-class');
                }
            }, 1000);
        }
    }, [classId, initialClassData, navigate, classData]);

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



    const NavItem: React.FC<{ label: DetailTab, icon: React.ReactNode, description: string }> = ({ label, icon, description }) => (
        <button
            onClick={() => setActiveTab(label)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                activeTab === label 
                ? 'bg-[#0b6459] text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
        >
            <div className={`mt-1 w-6 h-6 flex-shrink-0 flex items-center justify-center ${activeTab === label ? 'text-white' : 'text-gray-500'}`}>
                {icon}
            </div>
            <div>
                <p className={`font-bold text-sm ${activeTab === label ? 'text-white' : 'text-gray-800'}`}>{label}</p>
                <p className={`text-xs mt-0.5 ${activeTab === label ? 'text-teal-100' : 'text-gray-500'}`}>{description}</p>
            </div>
        </button>
    );

    return (
        <>
            {/* Main Container - Single unified block */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Header Section */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                        <button onClick={handleBack} className="mt-1 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-600">
                            <FiChevronLeft />
                        </button>
                        <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{classData?.courseTitle}</h1>
                                    <div className="flex items-center gap-3 mt-2 text-sm">
                                        <span className="text-gray-500">Class ID: <span className="font-mono text-gray-700">#{classData?.id}8492</span></span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${classData?.type === '1-on-1' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                            {classData?.type}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${classData?.status === 'Ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {classData?.status}
                                        </span>
                                    </div>
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
                            <NavItem label="Schedule" icon={<FiCalendar />} description="Sessions & Timing" />
                            <NavItem label="Students" icon={<FiUsers />} description="Roster & Progress" />
                            <NavItem label="Quizzes" icon={<FiFileText />} description="Assignments & Grades" />
                            <NavItem label="Materials" icon={<FiFolder />} description="Files & Resources" />
                        </nav>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-grow w-full min-w-0">
                        <div className="p-6 space-y-6">
                            {classData && (
                                <>
                                    {activeTab === "Schedule" && (
                                        <ScheduleTab classData={classData} onOpenReschedule={handleOpenReschedule} onViewPastSession={handleViewPastSession} />
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
        </>
    );
};

export default ClassDetailPage;
