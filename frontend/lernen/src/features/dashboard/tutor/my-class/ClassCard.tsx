import React from "react";
import type { ClassData } from "./components/EditClassModal";
import { FiCalendar, FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";

type Schedule = { day: string; time: string };

// Helper to determine the next session date from a recurring schedule
const getNextSessionDetail = (
    schedules: Schedule[]
): { fullDate: string; time: string; isUrgent: boolean } => {
    if (!schedules || schedules.length === 0) {
        return { fullDate: "No upcoming session", time: "", isUrgent: false };
    }

    // Using a fixed "now" for predictable demo output: Monday, Oct 20, 2025 at 9:00 AM UTC
    const today = new Date("2025-10-20T09:00:00Z");
    const upcomingSessions: Date[] = [];

    // Map day names to day indices (Sunday=0, Monday=1, etc.)
    const dayMap: { [key: string]: number } = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };

    for (let i = 0; i < 14; i++) {
        // Check next 2 weeks
        const checkDate = new Date(today);
        checkDate.setUTCDate(today.getUTCDate() + i);
        const checkDayIndex = checkDate.getUTCDay();

        for (const schedule of schedules) {
            const scheduleDayIndex = dayMap[schedule.day];
            if (scheduleDayIndex !== undefined && scheduleDayIndex === checkDayIndex) {
                const [time, period] = schedule.time.split(" ");
                let [hours, minutes] = time.split(":").map(Number);
                if (period === "PM" && hours < 12) hours += 12;
                if (period === "AM" && hours === 12) hours = 0;

                const sessionDateTime = new Date(
                    Date.UTC(
                        checkDate.getUTCFullYear(),
                        checkDate.getUTCMonth(),
                        checkDate.getUTCDate(),
                        hours,
                        minutes
                    )
                );

                if (sessionDateTime >= today) {
                    upcomingSessions.push(sessionDateTime);
                }
            }
        }
    }

    if (upcomingSessions.length === 0)
        return { fullDate: "No upcoming session", time: "", isUrgent: false };

    upcomingSessions.sort((a, b) => a.getTime() - b.getTime());
    const nextSession = upcomingSessions[0];

    const todayStartOfDay = new Date(today);
    todayStartOfDay.setUTCHours(0, 0, 0, 0);
    const diffDays = Math.floor(
        (nextSession.getTime() - todayStartOfDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    const fullDateStr = nextSession.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
    const timeStr = nextSession.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    });

    return {
        fullDate: fullDateStr,
        time: timeStr,
        isUrgent: diffDays <= 1,
    };
};

interface ClassCardProps {
    classData: ClassData;
    onViewDetails: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, onViewDetails }) => {
    const { fullDate, time, isUrgent } = getNextSessionDetail(classData.schedules);
    const progressPercentage = Math.min(
        100,
        Math.round((classData.completedSessions / classData.totalSessions) * 100)
    );

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full transition-all duration-350 hover:-translate-y-0.5 hover:scale-100.5 hover:shadow-lg hover:shadow-[#0b6459]/20">
            {/* Header: Type and Title */}
            <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                    <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${classData.type === "1-on-1"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                    >
                        {classData.type}
                    </span>
                    {classData.status === "Completed" && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                            Completed
                        </span>
                    )}
                </div>
                <h3 className="font-bold text-lg text-gray-800 line-clamp-2 h-14 group-hover:text-[#0b6459] transition-colors">
                    {classData.classTitle}
                </h3>
            </div>

            {/* Data Grid */}
            <div className="space-y-3 mb-6">
                {/* Row 1: Students */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 flex-shrink-0">
                        <FiUsers size={14} />
                    </div>
                    <span className="font-medium truncate">
                        {classData.type === "1-on-1"
                            ? classData.students[0].name
                            : `${classData.students.length} Students`}
                    </span>
                </div>

                {/* Row 2: Start Date */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 flex-shrink-0">
                        <FiCalendar size={14} />
                    </div>
                    <span>
                        Started:{" "}
                        <span className="font-semibold text-gray-700">{classData.startDate}</span>
                    </span>
                </div>

                {/* Row 3: Progress */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 flex-shrink-0">
                                <FiCheckCircle size={14} />
                            </div>
                            <span>Progress:</span>
                        </div>
                        <span className="font-semibold text-gray-700">
                            {classData.completedSessions}/{classData.totalSessions} Sessions
                        </span>
                    </div>
                    <div
                        className="w-full bg-gray-100 rounded-full h-1.5 ml-8"
                        style={{ width: "calc(100% - 2rem)" }}
                    >
                        <div
                            className={`h-1.5 rounded-full ${classData.status === "Completed" ? "bg-green-500" : "bg-[#0b6459]"
                                }`}
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Row 4: Next Session (Highlighted) */}
                {classData.status !== "Completed" && (
                    <div
                        className={`flex items-start gap-3 text-sm p-2 rounded-lg mt-2 ${isUrgent
                                ? "bg-orange-50 border border-orange-100"
                                : "bg-gray-50 border border-gray-100"
                            }`}
                    >
                        <div
                            className={`w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 ${isUrgent
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                        >
                            <FiClock size={14} />
                        </div>
                        <div>
                            <p
                                className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${isUrgent ? "text-orange-700" : "text-gray-500"
                                    }`}
                            >
                                Next Session
                            </p>
                            <p className="font-semibold text-gray-800">
                                {fullDate} <span className="mx-1 text-gray-400">•</span> {time}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onViewDetails}
                    className="flex-1 bg-[#0b6459] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#084c43] transition-colors"
                >
                    View Details
                </button>
                <button
                    onClick={() => alert('Chat feature coming soon')}
                    className="w-10 border border-gray-300 text-gray-500 py-2.5 rounded-lg text-sm hover:bg-gray-100 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                >
                    <BsChatDots size={16} />
                </button>
            </div>
        </div>
    );
};

export default ClassCard;
