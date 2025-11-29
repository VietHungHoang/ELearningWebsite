import React from 'react';
import type { StudentStatus } from '../pages/MyStudentsPage';

interface StudentStatusBadgeProps {
    status: StudentStatus;
}

const StudentStatusBadge: React.FC<StudentStatusBadgeProps> = ({ status }) => {
    const statusStyles: Record<StudentStatus, { bg: string, text: string, dot: string }> = {
        Ongoing: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
        Completed: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
    };

    const currentStatus = statusStyles[status];

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
            <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`}></span>
            {status}
        </span>
    );
};

export default StudentStatusBadge;