import React from "react";
import type { ClassData } from "../../pages/MyClassPage";
import { FiClock, FiCalendar, FiVideo } from "react-icons/fi";

interface ScheduleTabProps {
    classData: ClassData;
    onOpenReschedule: (sessionDate: string) => void;
    onViewPastSession: (session: any) => void;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ classData, onOpenReschedule, onViewPastSession }) => {
    // Mock data for demonstration
    const upcomingSessions = [
        {
            id: 1,
            date: "2025-11-25",
            time: "14:00 - 15:30",
            topic: "Introduction to React Hooks",
            status: "scheduled"
        },
        {
            id: 2,
            date: "2025-11-27",
            time: "14:00 - 15:30",
            topic: "State Management with Redux",
            status: "scheduled"
        }
    ];

    const pastSessions = [
        {
            id: 3,
            date: "2025-11-18",
            time: "14:00 - 15:30",
            topic: "Getting Started with React",
            status: "completed",
            recording: true
        }
    ];

    return (
        <div className="space-y-6">
            {/* Recurring Schedule Info */}
            {classData.schedules && classData.schedules.length > 0 && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-teal-100 rounded-lg text-teal-700">
                            <FiCalendar className="w-5 h-5" />
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-bold text-gray-800 mb-2">Recurring Schedule</h3>
                            <div className="flex flex-wrap gap-2">
                                {classData.schedules.map((schedule, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-teal-300 rounded-full text-sm"
                                    >
                                        <FiClock className="w-3.5 h-3.5 text-teal-600" />
                                        <span className="font-semibold text-gray-700">{schedule.day}</span>
                                        <span className="text-gray-500">{schedule.time}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upcoming Sessions */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Sessions</h3>
                <div className="space-y-3">
                    {upcomingSessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-teal-300 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-bold text-gray-700">{session.date}</span>
                                        <span className="text-sm text-gray-500">{session.time}</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-800">{session.topic}</h4>
                                </div>
                                <button
                                    onClick={() => onOpenReschedule(session.date)}
                                    className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                                >
                                    Reschedule
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Past Sessions */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Past Sessions</h3>
                <div className="space-y-3">
                    {pastSessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-bold text-gray-700">{session.date}</span>
                                        <span className="text-sm text-gray-500">{session.time}</span>
                                        {session.recording && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                                                <FiVideo className="w-3 h-3" />
                                                Recording Available
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="font-semibold text-gray-800">{session.topic}</h4>
                                </div>
                                <button
                                    onClick={() => onViewPastSession(session)}
                                    className="px-3 py-1.5 text-sm bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScheduleTab;
