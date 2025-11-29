import React, { useMemo } from 'react';
import type { Schedule, StudentInfo } from '../pages/MyClassPage';
import type { RequestStatus } from './RequestStatusBadge';
import RequestStatusBadge from './RequestStatusBadge';

export interface RequestData {
    id: string;
    type: 'Booking' | 'Reschedule' | 'Trial' | 'Lobby Creation';
    student: StudentInfo;
    tutor?: { name: string, avatar: string }; // For student view
    courseTitle: string;
    originalSchedule?: string; 
    proposedSchedules: Schedule[];
    reason: string;
    timestamp: string;
    date: Date;
    maxStudents?: number;
    status: RequestStatus;
}

interface RequestCardProps {
    request: RequestData;
    viewMode: 'tutor' | 'student';
    onAccept?: () => void;
    onDecline?: () => void;
    onChat?: () => void;
    onCancel?: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, viewMode, onAccept, onDecline, onChat, onCancel }) => {
    
    const { title, badgeClass, isRecurring } = useMemo(() => {
        switch (request.type) {
            case 'Booking':
                return { title: 'New Booking Request', badgeClass: 'bg-blue-100 text-blue-800', isRecurring: true };
            case 'Trial':
                return { title: 'Trial Session Request', badgeClass: 'bg-green-100 text-green-800', isRecurring: false };
            case 'Lobby Creation':
                return { title: 'New Lobby Request', badgeClass: 'bg-indigo-100 text-indigo-800', isRecurring: false };
            case 'Reschedule':
                const isRecurringReschedule = request.originalSchedule?.toLowerCase().includes('every');
                return {
                    title: isRecurringReschedule ? 'Change Recurring Schedule' : 'One-time Reschedule',
                    badgeClass: isRecurringReschedule ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800',
                    isRecurring: isRecurringReschedule ?? false
                };
            default:
                return { title: null, badgeClass: '', isRecurring: false };
        }
    }, [request]);

    const CardHeader = () => {
        if (viewMode === 'tutor') {
            return (
                <div className="flex items-center gap-4">
                    <img src={request.student.avatar} alt={request.student.name} className="w-12 h-12 rounded-full" />
                    <div>
                        <p className="font-bold text-gray-800">{request.student.name}</p>
                        <p className="text-sm text-gray-500">{request.courseTitle}</p>
                    </div>
                </div>
            );
        }
        // Student view
        return (
             <div className="flex items-center gap-4">
                {request.tutor?.avatar && <img src={request.tutor.avatar} alt={request.tutor.name} className="w-12 h-12 rounded-full" />}
                <div>
                    <p className="text-sm text-gray-500">Sent to:</p>
                    <p className="font-bold text-gray-800">{request.tutor?.name}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
            {/* Top section */}
            <div>
                <div className="flex items-start justify-between gap-4">
                    <CardHeader />
                    <p className="text-xs text-gray-400 flex-shrink-0">{request.timestamp}</p>
                </div>
                {title && (
                    <div className="mt-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${badgeClass}`}>{title}</span>
                    </div>
                )}
            </div>

            {/* Middle section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 text-sm flex-grow">
                        {(request.type === 'Booking' || request.type === 'Reschedule' || request.type === 'Trial') && (
                            <>
                                {request.type === 'Reschedule' && request.originalSchedule && (
                                    <div>
                                        <p className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Original</p>
                                        <div className={`mt-1 inline-block text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md font-medium ${isRecurring ? 'w-full text-center' : 'w-auto'}`}>
                                            {request.originalSchedule}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Proposed</p>
                                    {isRecurring ? (
                                        <div className="mt-1 text-gray-800 bg-green-50 px-3 py-2 rounded-md font-medium border border-green-200 w-full text-center">
                                            {request.proposedSchedules.map(s => `Every ${s.day} at ${s.time}`).join(', ')}
                                        </div>
                                    ) : (
                                        <div className="mt-1 inline-block text-green-800 bg-green-50 px-3 py-1.5 rounded-md font-medium border border-green-200">
                                            {`${request.proposedSchedules[0].day}, ${request.proposedSchedules[0].time}`}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {request.type === 'Lobby Creation' && (
                             <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Time Frame</p>
                                    <div className="mt-1 inline-block text-gray-800 bg-gray-100 px-3 py-1.5 rounded-md font-medium">
                                        {request.proposedSchedules[0].time}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Max Students</p>
                                    <p className="font-bold text-gray-800">{request.maxStudents}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Action buttons */}
                    {viewMode === 'tutor' && (
                        <div className="flex flex-col items-center gap-2 w-28 flex-shrink-0">
                            <button onClick={onAccept} className="w-full py-2 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43]">Accept</button>
                            <button onClick={onChat} className="w-full py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Chat</button>
                            <button onClick={onDecline} className="w-full py-2 text-sm font-semibold bg-red-50 text-red-700 rounded-lg hover:bg-red-100">Decline</button>
                        </div>
                    )}
                </div>
                
                {request.reason && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80">
                        <p className="text-sm text-gray-600 italic">"{request.reason}"</p>
                    </div>
                )}

                {viewMode === 'student' && (
                    <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                        <RequestStatusBadge status={request.status} />
                        {request.status === 'Pending' && (
                            <button onClick={onCancel} className="text-sm font-semibold text-red-600 hover:underline">
                                Cancel Request
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestCard;