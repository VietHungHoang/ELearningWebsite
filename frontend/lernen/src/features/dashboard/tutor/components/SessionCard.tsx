import React from 'react';
import { HiVideoCamera, HiClock, HiCalendar, HiPhone, HiChatAlt } from 'react-icons/hi';
import { format } from 'date-fns';
import type { Session } from '../types';

interface SessionCardProps {
    session: Session;
    showActions?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, showActions = true }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Rescheduled': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'Zoom': return '📹';
            case 'Meet': return '🎥';
            case 'Teams': return '💼';
            default: return '🎬';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between gap-4">
                {/* Left: Student Info */}
                <div className="flex items-start gap-4 flex-1">
                    {/* Avatar with online status */}
                    <div className="relative">
                        <img
                            src={session.studentAvatar}
                            alt={session.student}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        {session.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>

                    {/* Session Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                                <h4 className="font-bold text-gray-800 text-lg">{session.student}</h4>
                                <p className="text-sm text-gray-600 font-medium">{session.course}</p>
                                <p className="text-xs text-gray-500 mt-1">{session.topic}</p>
                            </div>
                        </div>

                        {/* Time & Duration */}
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                <HiClock className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold">{format(session.startTime, 'HH:mm')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                <HiCalendar className="w-4 h-4 text-gray-500" />
                                <span>{format(session.startTime, 'MMM dd')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs bg-gray-100 px-2 py-1 rounded-md">
                                <span className="text-gray-600">{session.duration} mins</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs bg-gray-100 px-2 py-1 rounded-md">
                                <span>{getPlatformIcon(session.platform)}</span>
                                <span className="text-gray-600">{session.platform}</span>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(session.status)}`}>
                                {session.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                {showActions && (
                    <div className="flex flex-col gap-2">
                        <button className="bg-[#0b6459] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#094d44] transition-colors duration-200 flex items-center gap-2">
                            <HiVideoCamera className="w-4 h-4" />
                            Join
                        </button>
                        <div className="flex gap-2">
                            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200" title="Call">
                                <HiPhone className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200" title="Message">
                                <HiChatAlt className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionCard;