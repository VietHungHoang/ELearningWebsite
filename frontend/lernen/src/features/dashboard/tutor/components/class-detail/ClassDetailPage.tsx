import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiCalendar, FiUsers, FiFileText, FiFolder, FiChevronLeft, FiMessageSquare, FiSettings } from "react-icons/fi";
import BirdLoading from "../../../../../components/ui/BirdLoading";
import ScheduleTab from "./components/ScheduleTab";
import StudentsTab from "./components/StudentsTab";
import QuizzesTab from "./components/QuizzesTab";
import MaterialsTab from "./components/MaterialsTab";
import { classService, type ClassData } from "../../../../../services/classService";
import type { Session } from "../../../../../types/class";
import { useTranslation } from "react-i18next";
import { convertUtcTimeToLocal, convertUtcDateTimeToLocal } from "../../../../../utils/scheduleHelpers";
import { useAuth } from "../../../../../context/AuthContext";

type DetailTab = "Schedule" | "Students" | "Quizzes" | "Materials";

const ClassDetailPage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const { state } = useAuth();

    // Helper function to check if title is null or "null" string
    const isTitleNull = (title: string | null | undefined): boolean => {
        return !title || title === 'null' || title.trim() === '';
    };

    // Helper function to get day name
    const getDayName = (dayOfWeek: number): string => {
        const isVietnamese = i18n.language === 'vi';
        if (isVietnamese) {
            const vietnameseDays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
            // dayOfWeek from API: 1=Monday, 2=Tuesday, ..., 7=Sunday
            return vietnameseDays[dayOfWeek === 7 ? 0 : dayOfWeek - 1] || 'Unknown';
        } else {
            const englishDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return englishDays[dayOfWeek === 7 ? 0 : dayOfWeek - 1] || 'Unknown';
        }
    };

    // Helper function to format time to 12-hour format
    const formatTime12Hour = (time24: string): string => {
        try {
            const [hours, minutes] = time24.split(':').map(Number);
            const period = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours % 12 || 12;
            return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
        } catch {
            return time24;
        }
    };

    // Helper function to format schedule display
    const formatScheduleDisplay = (schedules: Array<{ dayOfWeek?: number; day?: string; time: string }> | undefined): string => {
        if (!schedules || schedules.length === 0) {
            return '';
        }

        // Group schedules by time
        const timeGroups = new Map<string, string[]>();
        schedules.forEach(schedule => {
            const localTime = convertUtcTimeToLocal(schedule.time);
            const timeKey = localTime;
            if (!timeGroups.has(timeKey)) {
                timeGroups.set(timeKey, []);
            }
            // Use dayOfWeek if available, otherwise use day string
            const dayName = schedule.dayOfWeek !== undefined
                ? getDayName(schedule.dayOfWeek)
                : schedule.day || '';
            timeGroups.get(timeKey)!.push(dayName);
        });

        // Format: if all schedules have the same time, show "Mon, Wed 7:00 PM"
        // If different times, show "Mon 7:00 PM, Wed 8:00 PM"
        if (timeGroups.size === 1) {
            const time = Array.from(timeGroups.keys())[0];
            const formattedTime = formatTime12Hour(time);
            const dayNames = Array.from(timeGroups.values())[0].join(', ');
            return `${dayNames} ${formattedTime}`;
        } else {
            // Multiple times - format each group
            const parts: string[] = [];
            timeGroups.forEach((days, time) => {
                const formattedTime = formatTime12Hour(time);
                const dayNames = days.join(', ');
                parts.push(`${dayNames} ${formattedTime}`);
            });
            return parts.join(', ');
        }
    };

    // Get class data from navigation state or fetch from API
    const initialClassData = location.state?.classData as ClassData | undefined;

    const [classData, setClassData] = useState<ClassData | null>(initialClassData || null);
    const [activeTab, setActiveTab] = useState<DetailTab>("Schedule");
    const [isLoading, setIsLoading] = useState(!initialClassData);
    const [showUpdateScheduleModal, setShowUpdateScheduleModal] = useState(false);

    const fetchClassData = async () => {
        if (!classId) return;
        setIsLoading(true);

        try {
            const response = await classService.getClassDetail(classId);
            if (response.success && response.data) {
                // Transform ClassDetailResponse to ClassData format
                const apiData = response.data;
                const transformedData: ClassData = {
                    id: apiData.id,
                    classTitle: apiData.title,
                    tutor: apiData.tutor ? {
                        id: apiData.tutor.id,
                        fullName: apiData.tutor.fullName,
                        avatarUrl: apiData.tutor.avatarUrl
                    } : null,
                    students: apiData.students.map(s => ({
                        id: s.id,
                        name: s.fullName,
                        avatar: s.avatarUrl || '',
                        email: undefined
                    })),
                    type: apiData.type === 'ONE_ON_ONE' ? '1-on-1' : 'Group',
                    status: apiData.status === 'ONGOING' ? 'Ongoing' :
                        apiData.status === 'OPENING' ? 'Opening' : 'Completed',
                    schedules: apiData.schedules.map(s => ({
                        dayOfWeek: s.dayOfWeek,
                        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][s.dayOfWeek % 7],
                        time: s.time
                    })),
                    startDate: apiData.createdAt,
                    completedSessions: apiData.completedSessions,
                    totalSessions: apiData.totalSessions,
                    sessions: apiData.sessions?.map(s => ({
                        id: s.id,
                        sessionNumber: s.sessionNumber,
                        title: s.title,
                        startTime: convertUtcDateTimeToLocal(s.startTime),
                        endTime: convertUtcDateTimeToLocal(s.endTime),
                        meetingLink: s.meetingLink,
                        status: s.status,
                        participantsCount: s.participantsCount
                    })) || [],
                    quizzes: [], // Will be populated from separate API or tabs
                    materials: apiData.materials?.map(m => ({
                        id: m.id,
                        name: m.name,
                        type: m.type as 'PDF' | 'Video' | 'ZIP',
                        date: m.uploadDate,
                        s3Url: m.s3Url,
                        fileSize: m.fileSize
                    })) || [],
                    subject: undefined,
                    category: undefined,
                    tuitionFee: apiData.pricePerHour,
                    description: apiData.description,
                    maxStudents: apiData.maxStudents
                };
                setClassData(transformedData);
            } else {
                console.warn('API returned unsuccessful response');
                if (initialClassData) setClassData(initialClassData);
                else setClassData(null);
            }
        } catch (apiError) {
            console.error('Failed to fetch class detail:', apiError);
            if (initialClassData) setClassData(initialClassData);
            else setClassData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClassData();
    }, [classId]);


    const handleBack = () => {
        navigate('/dashboard/my-class');
    };

    const handleOpenReschedule = (sessionDate: string) => {
        console.log('Open reschedule modal for:', sessionDate);
    };

    const handleViewPastSession = (session: any) => {
        console.log('View past session:', session);
    };

    const handleViewQuizResult = (quizId: number) => {
        console.log('View quiz result for quiz:', quizId);
    };

    // Map sessions from API to Session format and split into upcoming and past
    const now = new Date();
    const mappedSessions: Session[] = classData?.sessions?.map(session => {
        const classTitle = !isTitleNull(classData.classTitle)
            ? (classData.classTitle || '')
            : (state.user?.role === 'student'
                ? (classData.tutor?.fullName || '')
                : (classData.students.length > 0 ? classData.students[0].name : ''));

        return {
            id: session.id,
            sessionDatetime: session.startTime, // Already converted to local timezone
            sessionType: classData.type === '1-on-1' ? 'ONE_ON_ONE' : 'GROUP',
            classInfo: {
                id: classData.id,
                title: classTitle
            },
            students: classData.students.map(student => ({
                id: student.id,
                fullName: student.name,
                avatarUrl: student.avatar
            })),
            tutor: classData.tutor ? {
                id: classData.tutor.id,
                fullName: classData.tutor.fullName,
                avatarUrl: classData.tutor.avatarUrl || ''
            } : {
                id: '',
                fullName: '',
                avatarUrl: ''
            },
            createdAt: classData.startDate,
            updatedAt: classData.startDate,
            meetingUrl: session.meetingLink, // Keep for backward compatibility
            meetingLink: session.meetingLink,
            notes: session.title
        };
    }) || [];

    // Split sessions into upcoming and past based on startTime
    const upcomingSessions = mappedSessions.filter(session => {
        const sessionDate = new Date(session.sessionDatetime);
        return sessionDate >= now;
    }).sort((a, b) => {
        return new Date(a.sessionDatetime).getTime() - new Date(b.sessionDatetime).getTime();
    });

    // Map past sessions to format expected by ScheduleTab
    const pastSessions = classData?.sessions
        ?.filter(session => {
            const sessionDate = new Date(convertUtcDateTimeToLocal(session.startTime));
            return sessionDate < now;
        })
        .map(session => {
            const startTime = new Date(convertUtcDateTimeToLocal(session.startTime));
            const endTime = new Date(convertUtcDateTimeToLocal(session.endTime));
            const durationMs = endTime.getTime() - startTime.getTime();
            const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
            const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

            // Format date
            const dateStr = startTime.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            // Format time
            const startTimeStr = startTime.toLocaleTimeString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            const endTimeStr = endTime.toLocaleTimeString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            // Format duration
            const durationStr = durationHours > 0
                ? `${durationHours}h ${durationMinutes}m`
                : `${durationMinutes}m`;

            // Generate a numeric id from string id for toggleExpand
            const numericId = session.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

            return {
                id: numericId,
                sessionId: session.id, // Keep original id
                date: dateStr,
                time: `${startTimeStr} - ${endTimeStr}`,
                actualStartTime: startTimeStr,
                actualEndTime: endTimeStr,
                duration: durationStr,
                topic: session.title,
                status: session.status.toLowerCase(),
                recording: false, // Not provided by API
                participantsCount: session.participantsCount,
                notes: session.title,
                attendanceHistory: [], // Not provided by API
                absentStudents: [] // Not provided by API
            };
        })
        .sort((a, b) => {
            // Sort by date descending (most recent first)
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }) || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <BirdLoading
                    title={t('dashboard.tutor.myClass.detail.loading')}
                    size="md"
                />
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{t('dashboard.tutor.myClass.detail.notFound.title')}</h2>
                    <p className="mt-2 text-gray-600">{t('dashboard.tutor.myClass.detail.notFound.description')}</p>
                    <button
                        onClick={handleBack}
                        className="mt-4 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]"
                    >
                        {t('dashboard.tutor.myClass.detail.notFound.backButton')}
                    </button>
                </div>
            </div>
        );
    }



    const getTabLabel = (tab: DetailTab): string => {
        const tabKey = tab.toLowerCase() as 'schedule' | 'students' | 'quizzes' | 'materials';
        return t(`dashboard.tutor.myClass.detail.tabs.${tabKey}`);
    };

    const NavItem: React.FC<{ label: DetailTab, icon: React.ReactNode }> = ({ label, icon }) => (
        <button
            onClick={() => setActiveTab(label)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${activeTab === label
                ? 'bg-[#0b6459] text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
                }`}
        >
            <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center ${activeTab === label ? 'text-white' : 'text-gray-500'}`}>
                {icon}
            </div>
            <p className={`font-bold text-sm ${activeTab === label ? 'text-white' : 'text-gray-800'}`}>{getTabLabel(label)}</p>
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
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        {!isTitleNull(classData?.classTitle)
                                            ? (classData?.classTitle || '')
                                            : (state.user?.role === 'student'
                                                ? (classData?.tutor?.fullName || '-')
                                                : (classData?.students.length > 0 ? classData.students[0].name : '-'))}
                                    </h1>
                                    <div className="flex items-center gap-3 mt-2 text-sm">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${classData?.type === '1-on-1' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                            {classData?.type === '1-on-1'
                                                ? t('dashboard.tutor.myClass.classTypes.oneOnOne')
                                                : t('dashboard.tutor.myClass.classTypes.group')}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${classData?.status === 'Ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {classData?.status === 'Ongoing'
                                                ? t('dashboard.tutor.myClass.detail.statusLabels.ongoing')
                                                : classData?.status === 'Opening'
                                                    ? t('dashboard.tutor.myClass.detail.statusLabels.opening')
                                                    : t('dashboard.tutor.myClass.detail.statusLabels.completed')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FiCalendar className="w-4 h-4" />
                                        <span>{formatScheduleDisplay(classData?.schedules)}</span>
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
                                        <span className="text-sm font-medium">{t('dashboard.tutor.myClass.detail.chat')}</span>
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
                                        <QuizzesTab onViewQuizResult={handleViewQuizResult} />
                                    )}
                                    {activeTab === "Materials" && (
                                        <MaterialsTab classData={classData} onUpdate={fetchClassData} />
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
                        <h3 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.tutor.myClass.detail.updateSchedule.title')}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('dashboard.tutor.myClass.detail.updateSchedule.daysOfWeek')}</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('dashboard.tutor.myClass.detail.updateSchedule.startTime')}</label>
                                    <input
                                        type="time"
                                        defaultValue="19:00"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('dashboard.tutor.myClass.detail.updateSchedule.endTime')}</label>
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
                                {t('dashboard.tutor.myClass.detail.updateSchedule.cancel')}
                            </button>
                            <button
                                onClick={() => setShowUpdateScheduleModal(false)}
                                className="px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors"
                            >
                                {t('dashboard.tutor.myClass.detail.updateSchedule.update')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClassDetailPage;
