import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiChat, HiCalendar, HiCheckCircle, HiClock, HiAcademicCap, HiTrendingUp, HiAnnotation, HiPhone } from 'react-icons/hi';
import StudentStatusBadge from '../components/StudentStatusBadge';
import EnrollmentTypeBadge from '../components/EnrollmentTypeBadge';
import type { StudentDetail } from '../../../../types/api';
import { studentService } from '../../../../services/studentService';
import Breadcrumb from '../../components/Breadcrumb';

type TabType = 'overview' | 'schedule' | 'progress' | 'notes';

const StudentDetailPage: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [tutorNotes, setTutorNotes] = useState('Great progress this month! Very engaged in class discussions.');
    const [student, setStudent] = useState<StudentDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            if (!studentId) return;

            try {
                setLoading(true);
                // Fetch student details
                const response = await studentService.getStudentDetail('1', studentId);

                if (response.success && response.data) {
                    setStudent(response.data);
                    if (response.data.tutorNotes) {
                        setTutorNotes(response.data.tutorNotes);
                    }
                }
            } catch (error) {
                console.error('Error fetching student:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [studentId]);



    const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string; subtext?: string }> =
        ({ icon, label, value, color, subtext }) => (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${color}`}>
                        {icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">{label}</p>
                        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
                        {subtext && <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>}
                    </div>
                </div>
            </div>
        );

    const NavItem: React.FC<{ tab: TabType; icon: React.ReactNode; label: string; description: string }> = ({ tab, icon, label, description }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 ${activeTab === tab
                ? 'bg-[#0b6459] text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-600'
                }`}
        >
            <div className={`mt-1 w-6 h-6 flex-shrink-0 flex items-center justify-center ${activeTab === tab ? 'text-white' : 'text-gray-500'}`}>
                {icon}
            </div>
            <div>
                <p className={`font-bold text-sm ${activeTab === tab ? 'text-white' : 'text-gray-800'}`}>{label}</p>
                <p className={`text-xs mt-0.5 ${activeTab === tab ? 'text-teal-100' : 'text-gray-500'}`}>{description}</p>
            </div>
        </button>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b6459]"></div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Not Found</h2>
                <button
                    onClick={() => navigate('/dashboard/my-students')}
                    className="px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors"
                >
                    Back to Students
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
                    { label: 'My Students', onClick: () => navigate('/dashboard/my-students') },
                    { label: student.name, isActive: true }
                ]}
                className="mb-6"
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                        <button
                            onClick={() => navigate('/dashboard/my-students')}
                            className="mt-1 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-600"
                        >
                            <HiArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <img src={student.avatarUrl} alt={student.name} className="w-16 h-16 rounded-full border-2 border-gray-100" />
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
                                        <div className="flex items-center gap-2 mt-2">
                                            <StudentStatusBadge status={student.status} />
                                            <div className="flex gap-1">
                                                {student.enrollmentTypes.map(type => (
                                                    <EnrollmentTypeBadge key={type} type={type} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors text-sm font-semibold shadow-sm">
                                        <HiChat className="w-4 h-4" />
                                        Message
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold">
                                        <HiCalendar className="w-4 h-4" />
                                        Schedule
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
                            <NavItem tab="overview" icon={<HiAcademicCap className="w-5 h-5" />} label="Overview" description="Stats & Info" />
                            <NavItem tab="schedule" icon={<HiCalendar className="w-5 h-5" />} label="Schedule" description="Sessions & History" />
                            <NavItem tab="progress" icon={<HiTrendingUp className="w-5 h-5" />} label="Progress" description="Performance & Goals" />
                            <NavItem tab="notes" icon={<HiAnnotation className="w-5 h-5" />} label="Notes" description="Private Notes & Logs" />
                        </nav>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-grow w-full min-w-0">
                        <div className="p-6 space-y-6">
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <StatCard
                                            icon={<HiCheckCircle className="w-5 h-5 text-green-600" />}
                                            label="Sessions Completed"
                                            value={`${student.stats.sessionsCompleted}/${student.stats.totalSessions}`}
                                            color="bg-green-100"
                                            subtext={`${student.stats.completionRate}% complete`}
                                        />
                                        <StatCard
                                            icon={<HiClock className="w-5 h-5 text-orange-600" />}
                                            label="Sessions Remaining"
                                            value={student.stats.sessionsRemaining}
                                            color="bg-orange-100"
                                        />
                                        <StatCard
                                            icon={<HiCheckCircle className="w-5 h-5 text-blue-600" />}
                                            label="Attendance Rate"
                                            value={`${student.stats.attendanceRate}%`}
                                            color="bg-blue-100"
                                        />
                                        <StatCard
                                            icon={<HiCalendar className="w-5 h-5 text-purple-600" />}
                                            label="Last Session"
                                            value={student.stats.lastSessionDate}
                                            color="bg-purple-100"
                                        />
                                    </div>

                                    {/* Contact & Class Info */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Contact Information */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <HiPhone className="w-5 h-5 text-gray-500" />
                                                Contact Information
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                                    <p className="text-gray-500 font-medium">Email</p>
                                                    <p className="text-gray-800 font-semibold">{student.email}</p>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                                    <p className="text-gray-500 font-medium">Phone</p>
                                                    <p className="text-gray-800 font-semibold">{student.contact.phone}</p>
                                                </div>
                                                <div className="flex justify-between">
                                                    <p className="text-gray-500 font-medium">Joined Date</p>
                                                    <p className="text-gray-800 font-semibold">{student.contact.joinedDate}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Class Assignment */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <HiAcademicCap className="w-5 h-5 text-gray-500" />
                                                Class Assignment
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                                    <p className="text-gray-500 font-medium">Class Name</p>
                                                    <p className="text-gray-800 font-semibold">{student.class.name}</p>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                                    <p className="text-gray-500 font-medium">Instructor</p>
                                                    <p className="text-gray-800 font-semibold">{student.class.instructor}</p>
                                                </div>
                                                <div className="flex justify-between">
                                                    <p className="text-gray-500 font-medium">Schedule</p>
                                                    <p className="text-gray-800 font-semibold">{student.class.schedule}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Status */}
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-sm p-6">
                                        <h3 className="font-bold text-gray-800 mb-3">Payment Status</h3>
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <p className="text-sm font-semibold text-gray-700">Status: <span className="text-green-700">{student.payment.status}</span></p>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Total Paid:</span> <span className="font-bold text-gray-800">{student.payment.totalPaid}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Next Due:</span> <span className="font-bold text-gray-800">{student.payment.nextDueDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SCHEDULE TAB */}
                            {activeTab === 'schedule' && (
                                <div className="space-y-6">
                                    {/* Upcoming Sessions */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <HiCalendar className="w-5 h-5 text-[#0b6459]" />
                                            Upcoming Sessions
                                        </h3>
                                        <div className="space-y-3">
                                            {student.upcomingSessions.map((session) => (
                                                <div key={session.id} className="bg-blue-50 border border-blue-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                                    <div className="flex flex-wrap justify-between items-start gap-2">
                                                        <div>
                                                            <p className="font-bold text-gray-800">{session.topic}</p>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {session.date} at {session.time} • {session.duration}
                                                            </p>
                                                        </div>
                                                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                                                            Scheduled
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Attendance Rate Indicator */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-bold text-gray-800">Overall Attendance</h4>
                                            <span className="text-2xl font-bold text-green-600">{student.stats.attendanceRate}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-green-500 h-3 rounded-full transition-all"
                                                style={{ width: `${student.stats.attendanceRate}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Session History */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h3 className="font-bold text-gray-800 mb-4">Session History</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 text-gray-600 font-semibold">
                                                    <tr>
                                                        <th className="p-3 text-left">Date</th>
                                                        <th className="p-3 text-left">Topic</th>
                                                        <th className="p-3 text-left">Duration</th>
                                                        <th className="p-3 text-left">Attendance</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {student.sessionHistory.map((session) => (
                                                        <tr key={session.id} className="hover:bg-gray-50">
                                                            <td className="p-3 text-gray-800 font-medium">{session.date}</td>
                                                            <td className="p-3 text-gray-700">{session.topic}</td>
                                                            <td className="p-3 text-gray-600">{session.duration}</td>
                                                            <td className="p-3">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${session.attendance === 'Present'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                                    }`}>
                                                                    {session.attendance}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PROGRESS TAB */}
                            {activeTab === 'progress' && (
                                <div className="space-y-6">
                                    {/* Course Progress */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <HiTrendingUp className="w-5 h-5 text-[#0b6459]" />
                                            Course Progress
                                        </h3>
                                        <div className="space-y-4">
                                            {student.courses.map((course, index) => (
                                                <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-gray-800">{course.title}</p>
                                                            <EnrollmentTypeBadge type={course.type} />
                                                        </div>
                                                        <span className="text-lg font-bold text-[#0b6459]">{course.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div
                                                            className="bg-[#0b6459] h-2.5 rounded-full transition-all"
                                                            style={{ width: `${course.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Performance Metrics */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-sm p-6">
                                            <h4 className="font-bold text-gray-800 mb-3">Average Test Score</h4>
                                            <p className="text-4xl font-bold text-blue-600">{student.performance.averageScore}%</p>
                                            <p className="text-sm text-gray-600 mt-2">Based on {student.performance.testScores.length} tests</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-sm p-6">
                                            <h4 className="font-bold text-gray-800 mb-3">Homework Completion</h4>
                                            <p className="text-4xl font-bold text-green-600">{student.performance.homeworkCompletion}%</p>
                                            <p className="text-sm text-gray-600 mt-2">Excellent completion rate</p>
                                        </div>
                                    </div>

                                    {/* Strengths & Weaknesses */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                            <h4 className="font-bold text-green-700 mb-3">💪 Strengths</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {student.strengths.map((strength, index) => (
                                                    <span key={index} className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                                                        {strength}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                            <h4 className="font-bold text-orange-700 mb-3">📈 Areas for Improvement</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {student.weaknesses.map((weakness, index) => (
                                                    <span key={index} className="px-3 py-1.5 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">
                                                        {weakness}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* NOTES TAB */}
                            {activeTab === 'notes' && (
                                <div className="space-y-6">
                                    {/* Tutor Notes */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <HiAnnotation className="w-5 h-5 text-[#0b6459]" />
                                            Private Tutor Notes
                                        </h3>
                                        <textarea
                                            value={tutorNotes}
                                            onChange={(e) => setTutorNotes(e.target.value)}
                                            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b6459] resize-none"
                                            placeholder="Add your private notes about this student here..."
                                        />
                                        <button className="mt-3 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors text-sm font-semibold">
                                            Save Notes
                                        </button>
                                    </div>

                                    {/* Communication History */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h3 className="font-bold text-gray-800 mb-4">Communication History</h3>
                                        <div className="space-y-3">
                                            {student.communications.map((comm) => (
                                                <div key={comm.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                                    <div className="flex justify-between items-start gap-2 mb-2">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                                            {comm.type}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{comm.date}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-700">{comm.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="bg-gradient-to-r from-[#0b6459]/10 to-teal-50 border border-[#0b6459]/30 rounded-2xl shadow-sm p-6">
                                        <h4 className="font-bold text-gray-800 mb-3">Quick Actions</h4>
                                        <div className="flex flex-wrap gap-3">
                                            <button className="flex items-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors text-sm font-semibold">
                                                <HiChat className="w-4 h-4" />
                                                Send Message
                                            </button>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold">
                                                <HiCalendar className="w-4 h-4" />
                                                Schedule Session
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-3">Last contacted: 2025-11-19</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailPage;
