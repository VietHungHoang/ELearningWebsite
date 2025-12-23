import React, { useMemo, useState } from 'react';
import type { Schedule, StudentInfo } from '../../my-class/MyClassPage';
import RequestStatusBadge from '../../components/RequestStatusBadge';
import type { RequestStatus } from '../../../../../types/api';
import { classService } from '../../../../../services/classService';
import Toast from '../../../../../components/ui/Toast';

export interface RescheduleRequestData {
    id: string;
    type: 'Reschedule';
    student: StudentInfo;
    tutor?: { name: string, avatar: string }; // For student view
    courseTitle: string;
    originalSchedule?: string;
    proposedSchedules: Schedule[];
    reason: string;
    timestamp: string;
    date: Date;
    status: RequestStatus;
}

interface RescheduleRequestCardProps {
    request: RescheduleRequestData;
    viewMode: 'tutor' | 'student';
    onChat?: () => void;
    onCancel?: () => void;
    onRequestProcessed?: (requestId: string) => void;
}

const RescheduleRequestCard: React.FC<RescheduleRequestCardProps> = ({ request, viewMode, onChat, onCancel, onRequestProcessed }) => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            const result = await classService.acceptRescheduleRequest(request.id);
            if (result.success) {
                setToast({ message: 'Reschedule request accepted successfully!', type: 'success' });
                onRequestProcessed?.(request.id);
            } else {
                setToast({ message: result.message || 'Failed to accept request', type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'An error occurred while accepting the request', type: 'error' });
        } finally {
            setIsAccepting(false);
        }
    };

    const handleDecline = async () => {
        setIsDeclining(true);
        try {
            // TODO: Implement decline API call
            setToast({ message: 'Reschedule request declined and student notified.', type: 'success' });
            onRequestProcessed?.(request.id);
        } catch (error) {
            setToast({ message: 'An error occurred while declining the request', type: 'error' });
        } finally {
            setIsDeclining(false);
        }
    };
    const { title, badgeClass, isRecurring } = useMemo(() => {
        const isRecurringReschedule = request.originalSchedule?.toLowerCase().includes('every');
        return {
            title: isRecurringReschedule ? 'Change Recurring Schedule' : 'One-time Reschedule',
            badgeClass: isRecurringReschedule ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800',
            isRecurring: isRecurringReschedule ?? false
        };
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
                <div className="mt-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${badgeClass}`}>{title}</span>
                </div>
            </div>

            {/* Middle section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 text-sm flex-grow">
                        {request.originalSchedule && (
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
                    </div>
                    {/* Action buttons */}
                    {viewMode === 'tutor' && (
                        <div className="flex flex-col items-center gap-2 w-28 flex-shrink-0">
                            <button 
                                onClick={handleAccept} 
                                disabled={isAccepting}
                                className="w-full py-2 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAccepting ? 'Accepting...' : 'Accept'}
                            </button>
                            <button onClick={onChat} className="w-full py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Chat</button>
                            <button 
                                onClick={handleDecline} 
                                disabled={isDeclining}
                                className="w-full py-2 text-sm font-semibold bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeclining ? 'Declining...' : 'Decline'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80">
                    <p className="text-sm text-gray-600 italic">"{request.reason}"</p>
                </div>

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

export default RescheduleRequestCard;