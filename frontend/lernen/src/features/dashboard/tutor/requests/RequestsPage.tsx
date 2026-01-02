import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from '../../../../components/ui/Toast';
import BirdLoading from '../../../../components/ui/BirdLoading';
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
    const [activeFilter, setActiveFilter] = useState<Filter>('Trial Requests');
    const [updatedRequestId, setUpdatedRequestId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const { setBreadcrumb } = useBreadcrumb();
    const { setTotalRequestsCount } = useRequests();

    const isTutor = state.user?.role === 'tutor';
    const isStudent = state.user?.role === 'student';
    const viewMode = isTutor ? 'tutor' : 'student';
    
    const [loading, setLoading] = useState(true);
    const [rescheduleRequests, setRescheduleRequests] = useState<any[]>([]);
    const [trialRequests, setTrialRequests] = useState<any[]>([]);

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
            if (!state.user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                if (isTutor) {
                    // Fetch trial requests for tutor
                    const trialResponse = await classService.getTrialRequests('tutor', state.user.id);
                    if (trialResponse.success && trialResponse.data) {
                        setTrialRequests(trialResponse.data);
                    } else {
                        setTrialRequests([]);
                    }
                    // Reschedule requests API not available yet
                    setRescheduleRequests([]);
                } else if (isStudent) {
                    // Fetch trial requests for student
                    const trialResponse = await classService.getTrialRequests('student', state.user.id);
                    if (trialResponse.success && trialResponse.data) {
                        setTrialRequests(trialResponse.data);
                    } else {
                        setTrialRequests([]);
                    }
                    // Reschedule requests API not available yet
                    setRescheduleRequests([]);
                }
            } catch (error) {
                console.error('Failed to fetch requests:', error);
                setTrialRequests([]);
                setRescheduleRequests([]);
            } finally {
                setLoading(false);
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
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeFilter === label ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-white/50'
                    }`}
            >
                {t(labelKey)}
                {count > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{count}</span>}
            </button>
        );
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] w-full">
                <BirdLoading 
                    title={t('dashboard.tutor.requests.trial.loading')}
                    size="lg"
                />
            </div>
        );
    }

    return (
        <div className="px-6 py-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Page Title and Subtitle */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {t(isTutor ? 'dashboard.tutor.requests.title' : 'dashboard.student.requests.title')}
                </h1>
                <p className="text-gray-600">
                    {t(isTutor ? 'dashboard.tutor.requests.subtitle' : 'dashboard.student.requests.subtitle')}
                </p>
            </div>

            <div className="mt-6">
                <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center flex-wrap">
                    <FilterButton label="Trial Requests" count={trialRequests.length} />
                    <FilterButton label="Reschedule Requests" count={rescheduleRequests.length} />
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