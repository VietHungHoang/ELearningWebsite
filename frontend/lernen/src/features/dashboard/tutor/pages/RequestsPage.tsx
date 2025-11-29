import React, { useState, useMemo } from 'react';
import type { RequestData } from '../components/RequestCard';
import Toast from '../../../../components/ui/Toast';
import DeclineRequestModal from '../components/DeclineRequestModal';
import RequestCard from '../components/RequestCard';

type Filter = 'All Requests' | 'Booking Requests' | 'Reschedule Requests' | 'Trial Requests' | 'Lobby Requests';

const RequestsPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<Filter>('All Requests');
    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
    const [requestToDecline, setRequestToDecline] = useState<RequestData | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    
    // Mock data - replace with actual data fetching
    const [bookingRequests, setBookingRequests] = useState<RequestData[]>([]);
    const [rescheduleRequests, setRescheduleRequests] = useState<RequestData[]>([]);
    const [trialRequests, setTrialRequests] = useState<RequestData[]>([]);
    const [lobbyRequests, setLobbyRequests] = useState<RequestData[]>([]);

    const currentRequests = useMemo(() => {
        switch (activeFilter) {
            case 'Booking Requests':
                return bookingRequests;
            case 'Reschedule Requests':
                return rescheduleRequests;
            case 'Trial Requests':
                return trialRequests;
            case 'Lobby Requests':
                return lobbyRequests;
            case 'All Requests':
            default:
                return [...bookingRequests, ...rescheduleRequests, ...trialRequests, ...lobbyRequests]
                    .sort((a, b) => b.date.getTime() - a.date.getTime());
        }
    }, [activeFilter, bookingRequests, rescheduleRequests, trialRequests, lobbyRequests]);

    const handleAccept = (requestId: string) => {
        // This logic works for all filters because it updates the source arrays
        setBookingRequests(prev => prev.filter(r => r.id !== requestId));
        setRescheduleRequests(prev => prev.filter(r => r.id !== requestId));
        setTrialRequests(prev => prev.filter(r => r.id !== requestId));
        setLobbyRequests(prev => prev.filter(r => r.id !== requestId));
        setToast({ message: 'Request accepted successfully!', type: 'success' });
    };

    const openDeclineModal = (request: RequestData) => {
        setRequestToDecline(request);
        setIsDeclineModalOpen(true);
    };

    const handleDecline = (reason: string) => {
        if (!requestToDecline) return;
        console.log(`Declining request ${requestToDecline.id} with reason: ${reason}`);

        // This logic also works for all filters
        setBookingRequests(prev => prev.filter(r => r.id !== requestToDecline.id));
        setRescheduleRequests(prev => prev.filter(r => r.id !== requestToDecline.id));
        setTrialRequests(prev => prev.filter(r => r.id !== requestToDecline.id));
        setLobbyRequests(prev => prev.filter(r => r.id !== requestToDecline.id));
        
        setIsDeclineModalOpen(false);
        setRequestToDecline(null);
        setToast({ message: 'Request declined and student notified.', type: 'success' });
    };

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
    
    const totalRequests = bookingRequests.length + rescheduleRequests.length + trialRequests.length + lobbyRequests.length;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <DeclineRequestModal 
                isOpen={isDeclineModalOpen}
                onClose={() => setIsDeclineModalOpen(false)}
                onConfirm={handleDecline}
                requestType={requestToDecline?.type || 'Request'}
            />

            <h1 className="text-3xl font-bold text-gray-800">Requests</h1>
            
            <div className="mt-6">
                <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center flex-wrap">
                    <FilterButton label="All Requests" count={totalRequests} />
                    <FilterButton label="Booking Requests" count={bookingRequests.length} />
                    <FilterButton label="Reschedule Requests" count={rescheduleRequests.length} />
                    <FilterButton label="Trial Requests" count={trialRequests.length} />
                    <FilterButton label="Lobby Requests" count={lobbyRequests.length} />
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentRequests.length > 0 ? (
                    currentRequests.map(request => (
                        <RequestCard 
                            key={request.id}
                            request={request}
                            viewMode="tutor"
                            onAccept={() => handleAccept(request.id)}
                            onDecline={() => openDeclineModal(request)}
                            onChat={() => handleChatWithStudent(request.student)}
                        />
                    ))
                ) : (
                    <div className="col-span-1 lg:col-span-2 xl:col-span-3 text-center py-20 bg-white rounded-lg">
                        <h3 className="text-lg font-bold text-gray-800">No Pending Requests</h3>
                        <p className="text-gray-500 mt-2">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestsPage;