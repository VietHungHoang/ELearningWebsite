import React from 'react';
import type { PayoutStatus } from '../pages/PayoutsPage';

interface PayoutStatusBadgeProps {
  status: PayoutStatus;
}

const PayoutStatusBadge: React.FC<PayoutStatusBadgeProps> = ({ status }) => {
    const statusStyles: Record<PayoutStatus, { bg: string, text: string, dot: string }> = {
        Completed: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
        Processing: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
        Failed: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    };

    const currentStatus = statusStyles[status];

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
            <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`}></span>
            {status}
        </span>
    );
};

export default PayoutStatusBadge;
