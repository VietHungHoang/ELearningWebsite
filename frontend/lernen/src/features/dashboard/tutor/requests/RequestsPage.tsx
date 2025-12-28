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
    
    const isTutor = state.user?.role === 'tutor';
    const isStudent = state.user?.role === 'student';
    const viewMode = isTutor ? 'tutor' : 'student';
    
    // Mock data for tutor - matching the image
    const mockTutorRescheduleRequests = [
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

    // Mock data for student - requests they sent
    const mockStudentRescheduleRequests = [
        {
            id: 's1',
            type: 'Reschedule' as const,
            tutor: {
                name: 'Dr. Smith',
                avatar: 'https://i.pravatar.cc/150?img=10'
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
            id: 's2',
            type: 'Reschedule' as const,
            tutor: {
                name: 'Ms. Johnson',
                avatar: 'https://i.pravatar.cc/150?img=11'
            },
            courseTitle: 'English Conversation',
            originalSchedule: 'Every Friday, 18:00',
            proposedSchedules: [
                { day: 'Friday', time: '19:00' }
            ],
            reason: 'I would like to change the time to later in the evening if possible.',
            timestamp: '1 day ago',
            date: new Date(),
            status: 'APPROVED' as const
        },
        {
            id: 's3',
            type: 'Reschedule' as const,
            tutor: {
                name: 'Prof. Brown',
                avatar: 'https://i.pravatar.cc/150?img=15'
            },
            courseTitle: 'History of Art',
            originalSchedule: 'Thursday, 16:00',
            proposedSchedules: [
                { day: 'Thursday', time: '17:30' }
            ],
            reason: 'I need to adjust the time due to my other commitments.',
            timestamp: '2 days ago',
            date: new Date(),
            status: 'DECLINED' as const
        },
        {
            id: 's4',
            type: 'Reschedule' as const,
            tutor: {
                name: 'Dr. Wilson',
                avatar: 'https://i.pravatar.cc/150?img=16'
            },
            courseTitle: 'Computer Science',
            originalSchedule: 'Tuesday, 19:00',
            proposedSchedules: [
                { day: 'Wednesday', time: '19:00' }
            ],
            reason: 'I have a conflict on Tuesday. Can we move to Wednesday?',
            timestamp: '4 hours ago',
            date: new Date(),
            status: 'PENDING' as const
        },
        {
            id: 's5',
            type: 'Reschedule' as const,
            tutor: {
                name: 'Dr. Smith',
                avatar: 'https://i.pravatar.cc/150?img=10'
            },
            courseTitle: 'Chemistry Basics',
            originalSchedule: 'Wednesday, 15:00',
            proposedSchedules: [
                { day: 'Wednesday', time: '16:00' }
            ],
            reason: 'I need to move the class 1 hour later due to my work schedule.',
            timestamp: '3 days ago',
            date: new Date(),
            status: 'APPROVED' as const
        },
        {
            id: 's6',
            type: 'Reschedule' as const,
            tutor: {
                name: 'Ms. Johnson',
                avatar: 'https://i.pravatar.cc/150?img=11'
            },
            courseTitle: 'Mathematics Advanced',
            originalSchedule: 'Every Monday, 18:00',
            proposedSchedules: [
                { day: 'Monday', time: '19:00' }
            ],
            reason: 'I would prefer a later time slot.',
            timestamp: '5 days ago',
            date: new Date(),
            status: 'DECLINED' as const
        },
        {
            id: 's7',
            type: 'Reschedule' as const,
            tutor: {
                name: 'Prof. Brown',
                avatar: 'https://i.pravatar.cc/150?img=15'
            },
            courseTitle: 'Biology Introduction',
            originalSchedule: 'Friday, 14:00',
            proposedSchedules: [
                { day: 'Saturday', time: '10:00' }
            ],
            reason: 'I have an exam on Friday afternoon. Can we reschedule to Saturday morning?',
            timestamp: '6 hours ago',
            date: new Date(),
            status: 'PENDING' as const
        }
    ];

    const mockTutorTrialRequests = [
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

    // Mock data for student - trial requests they sent
    const mockStudentTrialRequests = [
        {
            id: 'st1',
            sessionId: 'session1',
            tutor: {
                id: 't1',
                fullName: 'Dr. Smith',
                avatarUrl: 'https://i.pravatar.cc/150?img=10'
            },
            sessionDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            message: 'I am interested in learning physics. I have some basic knowledge but want to improve my understanding of fundamental concepts.',
            status: 'PENDING' as const,
            createdAt: new Date().toISOString()
        },
        {
            id: 'st2',
            sessionId: 'session2',
            tutor: {
                id: 't2',
                fullName: 'Ms. Johnson',
                avatarUrl: 'https://i.pravatar.cc/150?img=11'
            },
            sessionDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            message: 'Hello! I would like to try a trial session for chemistry. I am a beginner.',
            status: 'APPROVED' as const,
            createdAt: new Date().toISOString()
        },
        {
            id: 'st3',
            sessionId: 'session3',
            tutor: {
                id: 't3',
                fullName: 'Prof. Brown',
                avatarUrl: 'https://i.pravatar.cc/150?img=15'
            },
            sessionDateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            message: 'I am looking for help with history. Would love to have a trial session.',
            status: 'DECLINED' as const,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'st4',
            sessionId: 'session4',
            tutor: {
                id: 't4',
                fullName: 'Dr. Wilson',
                avatarUrl: 'https://i.pravatar.cc/150?img=16'
            },
            sessionDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            message: 'Interested in learning computer science. Can we schedule a trial session?',
            status: 'PENDING' as const,
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'st5',
            sessionId: 'session5',
            tutor: {
                id: 't5',
                fullName: 'Dr. Smith',
                avatarUrl: 'https://i.pravatar.cc/150?img=10'
            },
            sessionDateTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            message: 'I need help with advanced mathematics. Looking forward to our session.',
            status: 'PENDING' as const,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'st6',
            sessionId: 'session6',
            tutor: {
                id: 't6',
                fullName: 'Ms. Johnson',
                avatarUrl: 'https://i.pravatar.cc/150?img=11'
            },
            sessionDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            message: 'I would like to try a trial session for mathematics. I am preparing for an exam.',
            status: 'APPROVED' as const,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'st7',
            sessionId: 'session7',
            tutor: {
                id: 't7',
                fullName: 'Prof. Brown',
                avatarUrl: 'https://i.pravatar.cc/150?img=15'
            },
            sessionDateTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
            message: 'Looking for a tutor to help with English conversation practice.',
            status: 'DECLINED' as const,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    // Initialize with appropriate mock data based on role
    const initialRescheduleRequests = isTutor ? mockTutorRescheduleRequests : mockStudentRescheduleRequests;
    const initialTrialRequests = isTutor ? mockTutorTrialRequests : mockStudentTrialRequests;
    
    const [rescheduleRequests, setRescheduleRequests] = useState<any[]>(initialRescheduleRequests);
    const [trialRequests, setTrialRequests] = useState<any[]>(initialTrialRequests);

    useEffect(() => {
        const titleKey = isTutor 
            ? 'dashboard.tutor.requests.title' 
            : 'dashboard.student.requests.title';
        setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: t(titleKey) }
        ]);
    }, [setBreadcrumb, t, isTutor]);

    useEffect(() => {
        const fetchRequests = async () => {
            if (state.user) {
                try {
                    if (isTutor) {
                        // Fetch trial requests for tutor
                        const trialResponse = await classService.getTrialRequests('tutor', state.user.id);
                        if (trialResponse.success && trialResponse.data && trialResponse.data.length > 0) {
                            setTrialRequests(trialResponse.data);
                        } else {
                            setTrialRequests(mockTutorTrialRequests);
                        }
                        // Use mock data for reschedule requests (API not available yet)
                        setRescheduleRequests(mockTutorRescheduleRequests);
                    } else if (isStudent) {
                        // Fetch trial requests for student
                        const trialResponse = await classService.getTrialRequests('student', state.user.id);
                        if (trialResponse.success && trialResponse.data && trialResponse.data.length > 0) {
                            setTrialRequests(trialResponse.data);
                        } else {
                            setTrialRequests(mockStudentTrialRequests);
                        }
                        // Use mock data for reschedule requests (API not available yet)
                        setRescheduleRequests(mockStudentRescheduleRequests);
                    }
                } catch (error) {
                    console.error('Failed to fetch requests:', error);
                    // Use mock data on error
                    setTrialRequests(isTutor ? mockTutorTrialRequests : mockStudentTrialRequests);
                    setRescheduleRequests(isTutor ? mockTutorRescheduleRequests : mockStudentRescheduleRequests);
                }
            } else {
                // Use mock data when user is not available (for testing)
                setTrialRequests(isTutor ? mockTutorTrialRequests : mockStudentTrialRequests);
                setRescheduleRequests(isTutor ? mockTutorRescheduleRequests : mockStudentRescheduleRequests);
            }
        };
        fetchRequests();
    }, [state.user, isTutor, isStudent]);

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

    const handleChat = (person: any) => {
        console.log('Chat with:', person);
        // TODO: Implement chat functionality
    };

    const FilterButton: React.FC<{ label: Filter; count: number; }> = ({ label, count }) => {
        const baseKey = isTutor ? 'dashboard.tutor.requests' : 'dashboard.student.requests';
        const labelKey = label === 'Reschedule Requests' 
            ? `${baseKey}.filters.reschedule` 
            : `${baseKey}.filters.trial`;
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
                            const chatPerson = isTutor ? request.student : request.tutor;
                            return (
                                <RescheduleRequestCard
                                    key={request.id}
                                    request={request as any}
                                    viewMode={viewMode}
                                    onRequestProcessed={setUpdatedRequestId}
                                    onChat={() => handleChat(chatPerson)}
                                />
                            );
                        } else {
                            const chatPerson = isTutor ? request.student : request.tutor;
                            return (
                                <TrialRequestCard
                                    key={request.id}
                                    request={request as any}
                                    viewMode={viewMode}
                                    onRequestProcessed={setUpdatedRequestId}
                                    onChat={() => handleChat(chatPerson)}
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
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {t(isTutor ? 'dashboard.tutor.requests.empty.title' : 'dashboard.student.requests.empty.title')}
                        </h3>
                        <p className="text-gray-500 text-center max-w-md">
                            {t(isTutor ? 'dashboard.tutor.requests.empty.description' : 'dashboard.student.requests.empty.description')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestsPage;