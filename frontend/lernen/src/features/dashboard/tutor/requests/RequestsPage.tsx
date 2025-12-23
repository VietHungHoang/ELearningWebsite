import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../../../components/ui/Toast';
import RescheduleRequestCard from './components/RescheduleRequestCard';
import TrialRequestCard from './components/TrialRequestCard';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { classService } from '../../../../services/classService';
import { useAuth } from '../../../../context/AuthContext';

type Filter = 'Reschedule Requests' | 'Trial Requests';

const RequestsPage: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useAuth();
    const [activeFilter, setActiveFilter] = useState<Filter>('Trial Requests');
    const [updatedRequestId, setUpdatedRequestId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const { setBreadcrumb } = useBreadcrumb();
    
    // TODO: Replace with actual API data fetching
    const [rescheduleRequests, setRescheduleRequests] = useState<any[]>([]);
    const [trialRequests, setTrialRequests] = useState<any[]>([]);

    useEffect(() => {
        setBreadcrumb([
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Requests' }
        ]);
    }, [setBreadcrumb]);

    useEffect(() => {
        const fetchTrialRequests = async () => {
            if (state.user) {
                try {
                    const response = await classService.getTrialRequests('tutor', state.user.id);
                    if (response.success && response.data) {
                        setTrialRequests(response.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch trial requests:', error);
                }
            }
        };
        fetchTrialRequests();
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

    const handleChatWithStudent = (student: any) => {
        console.log('Chat with student:', student);
        // TODO: Implement chat functionality
    };

    const FilterButton: React.FC<{ label: Filter; count: number; }> = ({ label, count }) => (
        <button
            onClick={() => setActiveFilter(label)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeFilter === label ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-white/50'
            }`}
        >
            {label}
            {count > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{count}</span>}
        </button>
    );
    
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
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Pending Requests</h3>
                        <p className="text-gray-500 text-center max-w-md">You're all caught up! All requests have been processed.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestsPage;