import React from 'react';
import { useTranslation } from 'react-i18next';
import type { RequestStatus } from '../../../../types/api';


interface RequestStatusBadgeProps {
  status: RequestStatus;
}

const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status }) => {
    const { t } = useTranslation();
    const statusStyles: Record<RequestStatus, { text: string, dot: string }> = {
        PENDING: { text: 'text-gray-700', dot: 'bg-yellow-500' },
        APPROVED: { text: 'text-gray-700', dot: 'bg-green-500' },
        DECLINED: { text: 'text-gray-700', dot: 'bg-red-500' },
    };

    const statusLabels: Record<RequestStatus, string> = {
        PENDING: t('dashboard.tutor.requests.status.pending'),
        APPROVED: t('dashboard.tutor.requests.status.approved'),
        DECLINED: t('dashboard.tutor.requests.status.declined'),
    };

    const currentStatus = statusStyles[status] || statusStyles.PENDING;

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 ${currentStatus.text}`}>
            <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`}></span>
            {statusLabels[status]}
        </span>
    );
};

export default RequestStatusBadge;