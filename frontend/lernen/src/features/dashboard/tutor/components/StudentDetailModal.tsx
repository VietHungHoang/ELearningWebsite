import React, { useState, useEffect } from 'react';
import { HiX, HiChat, HiCalendar, HiCheckCircle, HiClock, HiAcademicCap, HiTrendingUp, HiAnnotation, HiPhone } from 'react-icons/hi';
import StudentStatusBadge from './StudentStatusBadge';
import EnrollmentTypeBadge from './EnrollmentTypeBadge';
import type { Student } from '../../../../types/api';

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
}

type TabType = 'overview' | 'schedule' | 'progress' | 'notes';

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [tutorNotes, setTutorNotes] = useState('Great progress this month! Very engaged in class discussions.');

  useEffect(() => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Mock data - replace with real API data
  const mockData = {
    stats: {
      sessionsCompleted: 8,
      totalSessions: 10,
      sessionsRemaining: 2,
      completionRate: 80,
      attendanceRate: 95,
      lastSessionDate: '2025-11-18',
    },
    contact: {
      phone: '+84 912 345 678',
      joinedDate: student.registeredDate,
    },
    class: {
      name: 'Math Advanced A1',
      instructor: 'You',
      schedule: 'Mon, Wed, Fri - 3:00 PM',
    },
    payment: {
      status: 'Paid',
      nextDueDate: '2025-12-01',
      totalPaid: '$240',
    },
    upcomingSessions: [
      { id: 1, date: '2025-11-22', time: '15:00', duration: '60 min', topic: 'Calculus Introduction' },
      { id: 2, date: '2025-11-24', time: '15:00', duration: '60 min', topic: 'Derivatives Practice' },
      { id: 3, date: '2025-11-26', time: '15:00', duration: '60 min', topic: 'Integration Basics' },
    ],
    sessionHistory: [
      { id: 1, date: '2025-11-18', duration: '60 min', attendance: 'Present', topic: 'Quadratic Equations' },
      { id: 2, date: '2025-11-15', duration: '60 min', attendance: 'Present', topic: 'Linear Functions' },
      { id: 3, date: '2025-11-13', duration: '60 min', attendance: 'Late (10 min)', topic: 'Polynomials' },
      { id: 4, date: '2025-11-11', duration: '60 min', attendance: 'Present', topic: 'Factoring Review' },
    ],
    courses: [
      { title: 'Advanced Mathematics', progress: 75, type: '1-on-1' as const },
      { title: 'Physics Workshop', progress: 60, type: 'Group' as const },
      { title: 'Chemistry Fundamentals', progress: 90, type: 'Trial' as const },
    ],
    performance: {
      testScores: [85, 92, 88, 95, 90],
      homeworkCompletion: 95,
      averageScore: 90,
    },
    strengths: ['Problem Solving', 'Quick Learner', 'Consistent Attendance'],
    weaknesses: ['Needs more practice with word problems'],
    communications: [
      { id: 1, date: '2025-11-19', type: 'Message', content: 'Discussed upcoming exam preparation' },
      { id: 2, date: '2025-11-10', type: 'Email', content: 'Sent homework assignment guidelines' },
      { id: 3, date: '2025-11-05', type: 'Message', content: 'Scheduled extra tutoring session' },
    ],
  };

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

  const TabButton: React.FC<{ tab: TabType; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === tab
          ? 'bg-[#0b6459] text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'bg-black/50 opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
      role="dialog" aria-modal="true"
    >
      <style>{`
        @keyframes modal-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-modal-in { animation: modal-in 0.3s ease-out forwards; }
        @keyframes modal-out { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
        .animate-modal-out { animation: modal-out 0.3s ease-in forwards; }
      `}</style>
      <div className={`bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col ${isOpen ? 'animate-modal-in' : 'animate-modal-out'}`}>
        {/* Header with Student Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <img src={student.avatarUrl} alt={student.name} className="w-16 h-16 rounded-full" />
            <div>
              <h2 className="font-bold text-xl text-gray-800">{student.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <StudentStatusBadge status={student.status} />
                <div className="flex gap-1">
                  {student.enrollmentTypes.map(type => (
                    <EnrollmentTypeBadge key={type} type={type} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleClose} className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 px-6 pt-4 border-b border-gray-100">
          <TabButton tab="overview" icon={<HiAcademicCap className="w-4 h-4" />} label="Overview" />
          <TabButton tab="schedule" icon={<HiCalendar className="w-4 h-4" />} label="Schedule" />
          <TabButton tab="progress" icon={<HiTrendingUp className="w-4 h-4" />} label="Progress" />
          <TabButton tab="notes" icon={<HiAnnotation className="w-4 h-4" />} label="Notes" />
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={<HiCheckCircle className="w-5 h-5 text-green-600" />}
                  label="Sessions Completed"
                  value={`${mockData.stats.sessionsCompleted}/${mockData.stats.totalSessions}`}
                  color="bg-green-100"
                  subtext={`${mockData.stats.completionRate}% complete`}
                />
                <StatCard
                  icon={<HiClock className="w-5 h-5 text-orange-600" />}
                  label="Sessions Remaining"
                  value={mockData.stats.sessionsRemaining}
                  color="bg-orange-100"
                />
                <StatCard
                  icon={<HiCheckCircle className="w-5 h-5 text-blue-600" />}
                  label="Attendance Rate"
                  value={`${mockData.stats.attendanceRate}%`}
                  color="bg-blue-100"
                />
                <StatCard
                  icon={<HiCalendar className="w-5 h-5 text-purple-600" />}
                  label="Last Session"
                  value={mockData.stats.lastSessionDate}
                  color="bg-purple-100"
                />
              </div>

              {/* Contact & Class Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <HiPhone className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Email</p>
                      <p className="text-gray-800 font-semibold">{student.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Phone</p>
                      <p className="text-gray-800 font-semibold">{mockData.contact.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Joined Date</p>
                      <p className="text-gray-800 font-semibold">{mockData.contact.joinedDate}</p>
                    </div>
                  </div>
                </div>

                {/* Class Assignment */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <HiAcademicCap className="w-5 h-5" />
                    Class Assignment
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Class Name</p>
                      <p className="text-gray-800 font-semibold">{mockData.class.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Instructor</p>
                      <p className="text-gray-800 font-semibold">{mockData.class.instructor}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Schedule</p>
                      <p className="text-gray-800 font-semibold">{mockData.class.schedule}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Payment Status</h3>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <p className="text-sm font-semibold text-gray-700">Status: <span className="text-green-700">{mockData.payment.status}</span></p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Total Paid:</span> <span className="font-bold text-gray-800">{mockData.payment.totalPaid}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Next Due:</span> <span className="font-bold text-gray-800">{mockData.payment.nextDueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* Upcoming Sessions */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HiCalendar className="w-5 h-5 text-[#0b6459]" />
                  Upcoming Sessions
                </h3>
                <div className="space-y-3">
                  {mockData.upcomingSessions.map((session) => (
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
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-gray-800">Overall Attendance</h4>
                  <span className="text-2xl font-bold text-green-600">{mockData.stats.attendanceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${mockData.stats.attendanceRate}%` }}
                  />
                </div>
              </div>

              {/* Session History */}
              <div>
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
                      {mockData.sessionHistory.map((session) => (
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
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HiTrendingUp className="w-5 h-5 text-[#0b6459]" />
                  Course Progress
                </h3>
                <div className="space-y-4">
                  {mockData.courses.map((course, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
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
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-800 mb-3">Average Test Score</h4>
                  <p className="text-4xl font-bold text-blue-600">{mockData.performance.averageScore}%</p>
                  <p className="text-sm text-gray-600 mt-2">Based on {mockData.performance.testScores.length} tests</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-800 mb-3">Homework Completion</h4>
                  <p className="text-4xl font-bold text-green-600">{mockData.performance.homeworkCompletion}%</p>
                  <p className="text-sm text-gray-600 mt-2">Excellent completion rate</p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="font-bold text-green-700 mb-3">💪 Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockData.strengths.map((strength, index) => (
                      <span key={index} className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="font-bold text-orange-700 mb-3">📈 Areas for Improvement</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockData.weaknesses.map((weakness, index) => (
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
              <div>
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
              <div>
                <h3 className="font-bold text-gray-800 mb-4">Communication History</h3>
                <div className="space-y-3">
                  {mockData.communications.map((comm) => (
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
              <div className="bg-gradient-to-r from-[#0b6459]/10 to-teal-50 border border-[#0b6459]/30 rounded-xl p-5">
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

        {/* Footer */}
        <div className="flex justify-between items-center gap-3 p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] transition-colors text-sm font-semibold">
              <HiChat className="w-4 h-4" />
              Message
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold">
              <HiCalendar className="w-4 h-4" />
              Schedule
            </button>
          </div>
          <button onClick={handleClose} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
