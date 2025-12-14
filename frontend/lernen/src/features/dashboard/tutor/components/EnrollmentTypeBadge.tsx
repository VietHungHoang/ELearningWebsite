import React from 'react';
import { HiUser, HiUserGroup, HiSparkles } from 'react-icons/hi';
import type { StudentEnrollmentType } from '../my-student/MyStudentsPage';

interface EnrollmentTypeBadgeProps {
    type: StudentEnrollmentType;
}

const EnrollmentTypeBadge: React.FC<EnrollmentTypeBadgeProps> = ({ type }) => {
    const typeStyles: Record<StudentEnrollmentType, { bg: string, text: string, icon: React.ReactNode, label: string }> = {
        '1-on-1': {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            icon: <HiUser className="w-3 h-3" />,
            label: '1-on-1'
        },
        'Group': {
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            icon: <HiUserGroup className="w-3 h-3" />,
            label: 'Group'
        },
        'Trial': {
            bg: 'bg-teal-100',
            text: 'text-teal-800',
            icon: <HiSparkles className="w-3 h-3" />,
            label: 'Trial'
        },
    };

    const currentStyle = typeStyles[type];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${currentStyle.bg} ${currentStyle.text}`}>
            <span className="w-3 h-3">{currentStyle.icon}</span>
            {currentStyle.label}
        </span>
    );
};

export default EnrollmentTypeBadge;