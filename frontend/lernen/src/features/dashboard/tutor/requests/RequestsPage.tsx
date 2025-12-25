import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from '../../../../components/ui/Toast';
import RescheduleRequestCard from './components/RescheduleRequestCard';
import TrialRequestCard from './components/TrialRequestCard';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { useRequests } from '../../context/RequestsContext';
import { classService } from '../../../../services/classService';
import { useAuth } from '../../../../context/AuthContext';

type Filter = 'Reschedule Requests' | 'Trial Requests';

const RequestsPage: React.FC = () => {
    const { state } = useAuth();
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState<Filter>('Reschedule Requests');
    const [updatedRequestId, setUpdatedRequestId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const { setBreadcrumb } = useBreadcrumb();
    const { setTotalRequestsCount } = useRequests();
    
    // Mock data for testing UI - matching the image
    const mockRescheduleRequests = [
        {
            id: '1',
            type: 'Reschedule' as const,
            student: {
                id: 's1',
                name: 'Nguyễn Văn A',
                avatar: 'https://i.pravatar.cc/150?img=1'
            },
            courseTitle: 'Advanced Mathematics',
            originalSchedule: 'Monday, 19:00',
            proposedSchedules: [
                { day: 'Wednesday', time: '20:00' }
            ],
            reason: 'I have a family event on Monday evening. Could we please reschedule to Wednesday?',
            timestamp: '2 hours ago',
            date: new Date(),
            status: 'PENDING' as const
        },
        {
            id: '2',
            type: 'Reschedule' as const,
            student: {
                id: 's2',
                name: 'Trần Thị B',
                avatar: 'https://i.pravatar.cc/150?img=2'
            },
            courseTitle: 'English Conversation',
            originalSchedule: 'Every Friday, 18:00',
            proposedSchedules: [
                { day: 'Friday', time: '19:00' },
                { day: 'Saturday', time: '10:00' }
            ],
            reason: 'I would like to change the time to later in the evening or Saturday morning if possible.',
            timestamp: '5 hours ago',
            date: new Date(),
            status: 'PENDING' as const
        },
        {
            id: '3',
            type: 'Reschedule' as const,
            student: {
                id: 's3',
                name: 'Lê Văn C',
                avatar: 'https://i.pravatar.cc/150?img=5'
            },
            courseTitle: 'Physics Fundamentals',
            originalSchedule: 'Tuesday, 17:00',
            proposedSchedules: [
                { day: 'Thursday', time: '17:00' }
            ],
            reason: 'I have a conflict with another class on Tuesday. Can we move to Thursday?',
            timestamp: '1 day ago',
            date: new Date(),
            status: 'PENDING' as const
        }
    ];

    const mockTrialRequests = [
        {
            id: 't1',
            sessionId: 'session1',
            student: {
                id: 's4',
                fullName: 'Phạm Thị D',
                avatarUrl: 'https://i.pravatar.cc/150?img=4'
            },
            sessionDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
            message: 'I am interested in learning physics. I have some basic knowledge but want to improve my understanding of fundamental concepts. Looking forward to our trial session!',
            status: 'PENDING' as const,
            createdAt: new Date().toISOString()
        },
        {
            id: 't2',
            sessionId: 'session2',
            student: {
                id: 's5',
                fullName: 'Hoàng Văn E',
                avatarUrl: 'https://i.pravatar.cc/150?img=6'
            },
            sessionDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
            message: 'Hello! I would like to try a trial session for chemistry. I am a beginner and want to see if your teaching style fits my learning needs.',
            status: 'PENDING' as const,
            createdAt: new Date().toISOString()
        },
        {
            id: 't3',
            sessionId: 'session3',
            student: {
                id: 's6',
                fullName: 'Nguyễn Thị F',
                avatarUrl: 'https://i.pravatar.cc/150?img=7'
            },
            sessionDateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
            message: 'I am looking for a tutor to help me with biology. Would love to have a trial session to see if we are a good match.',
            status: 'PENDING' as const,
            createdAt: new Date().toISOString()
        },
        {
            id: 't4',
            sessionId: 'session4',
            student: {
                id: 's7',
                fullName: 'Trần Văn G',
                avatarUrl: 'https://i.pravatar.cc/150?img=8'
            },
            sessionDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
            message: 'Interested in learning computer science. Can we schedule a trial session?',
            status: 'PENDING' as const,
            createdAt: new Date().toISOString()
        }
    ];

    const [rescheduleRequests, setRescheduleRequests] = useState<any[]>(mockRescheduleRequests);
    const [trialRequests, setTrialRequests] = useState<any[]>(mockTrialRequests);

    useEffect(() => {
        setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: t('dashboard.tutor.requests.title') }
        ]);
    }, [setBreadcrumb, t]);

    useEffect(() => {
        const fetchRequests = async () => {
            if (state.user) {
                try {
                    // Fetch trial requests
                    const trialResponse = await classService.getTrialRequests('tutor', state.user.id);
                    if (trialResponse.success && trialResponse.data && trialResponse.data.length > 0) {
                        setTrialRequests(trialResponse.data);
                    } else {
                        // Use mock data if API returns empty or fails
                        setTrialRequests(mockTrialRequests);
                    }

                    // Fetch reschedule requests - TODO: Replace with actual API endpoint when available
                    // For now, use mock data
                    // const rescheduleResponse = await classService.getRescheduleRequests('tutor', state.user.id);
                    // if (rescheduleResponse.success && rescheduleResponse.data) {
                    //     setRescheduleRequests(rescheduleResponse.data);
                    // } else {
                    //     setRescheduleRequests(mockRescheduleRequests);
                    // }
                    setRescheduleRequests(mockRescheduleRequests);
                } catch (error) {
                    console.error('Failed to fetch requests:', error);
                    // Use mock data on error
                    setTrialRequests(mockTrialRequests);
                    setRescheduleRequests(mockRescheduleRequests);
                }
            } else {
                // Use mock data when user is not available (for testing)
                setTrialRequests(mockTrialRequests);
                setRescheduleRequests(mockRescheduleRequests);
            }
        };
        fetchRequests();
    }, [state.user]);

    const currentRequests = useMemo(() => {
        switch (activeFilter) {
            case 'Reschedule Requests':
                return rescheduleRequests;
            case 'Trial Requests':
                return trialRequests;
        }
    }, [activeFilter, rescheduleRequests, trialRequests]);

    // Watch for updated request ID and remove it from both lists
    useEffect(() => {
        if (updatedRequestId) {
            setRescheduleRequests(prev => prev.filter(r => r.id !== updatedRequestId));
            setTrialRequests(prev => prev.filter(r => r.id !== updatedRequestId));
            setUpdatedRequestId(null); // Reset after processing
        }
    }, [updatedRequestId]);

    // Update total requests count for sidebar
    useEffect(() => {
        const pendingRescheduleCount = rescheduleRequests.filter(r => r.status === 'PENDING').length;
        const pendingTrialCount = trialRequests.filter(r => r.status === 'PENDING').length;
        const totalCount = pendingRescheduleCount + pendingTrialCount;
        setTotalRequestsCount(totalCount);
    }, [rescheduleRequests, trialRequests, setTotalRequestsCount]);

    const handleChatWithStudent = (student: any) => {
        console.log('Chat with student:', student);
        // TODO: Implement chat functionality
    };

    const FilterButton: React.FC<{ label: Filter; count: number; }> = ({ label, count }) => {
        const labelKey = label === 'Reschedule Requests' 
            ? 'dashboard.tutor.requests.filters.reschedule' 
            : 'dashboard.tutor.requests.filters.trial';
        return (
            <button
                onClick={() => setActiveFilter(label)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    activeFilter === label ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-white/50'
                }`}
            >
                {t(labelKey)}
                {count > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{count}</span>}
            </button>
        );
    };
    
    return (
        <div className="mx-auto">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="mt-6">
                <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center flex-wrap">
                    <FilterButton label="Reschedule Requests" count={rescheduleRequests.length} />
                    <FilterButton label="Trial Requests" count={trialRequests.length} />
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentRequests.length > 0 ? (
                    currentRequests.map(request => {
                        if (activeFilter === 'Reschedule Requests') {
                            return (
                                <RescheduleRequestCard
                                    key={request.id}
                                    request={request as any}
                                    viewMode="tutor"
                                    onRequestProcessed={setUpdatedRequestId}
                                    onChat={() => handleChatWithStudent(request.student)}
                                />
                            );
                        } else {
                            return (
                                <TrialRequestCard
                                    key={request.id}
                                    request={request as any} // Type assertion needed due to different interfaces
                                    viewMode="tutor"
                                    onRequestProcessed={setUpdatedRequestId}
                                    onChat={() => handleChatWithStudent(request.student)}
                                />
                            );
                        }
                    })
                ) : (
                    <div className="col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-20">
                        <div className="mb-6">
                            <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{t('dashboard.tutor.requests.empty.title')}</h3>
                        <p className="text-gray-500 text-center max-w-md">{t('dashboard.tutor.requests.empty.description')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestsPage;