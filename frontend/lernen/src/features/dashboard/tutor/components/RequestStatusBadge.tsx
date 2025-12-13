import React from 'react';

export type RequestStatus = 'Pending' | 'Approved' | 'Declined';

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status }) => {
    const statusStyles: Record<RequestStatus, { bg: string, text: string, dot: string }> = {
        Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
        Approved: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
        Declined: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    };

    const currentStatus = statusStyles[status];

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
            <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`}></span>
            {status}
        </span>
    );
};

export default RequestStatusBadge;