import React from 'react';
import type { CouponStatus } from '../pages/DealsAndCouponsPage';
import { useTranslation } from 'react-i18next';

interface CouponStatusBadgeProps {
  status: CouponStatus;
}

const CouponStatusBadge: React.FC<CouponStatusBadgeProps> = ({ status }) => {
    const { t } = useTranslation();
    const statusStyles: Record<CouponStatus, { bg: string, text: string, dot: string }> = {
        Active: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
        Expired: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
        Inactive: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
    };

    const currentStatus = statusStyles[status];
    const statusLabels: Record<CouponStatus, string> = {
        Active: t('dashboard.tutor.dealsCoupons.status.active'),
        Expired: t('dashboard.tutor.dealsCoupons.status.expired'),
        Inactive: t('dashboard.tutor.dealsCoupons.status.inactive'),
    };

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
            <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`}></span>
            {statusLabels[status]}
        </span>
    );
};

export default CouponStatusBadge;
