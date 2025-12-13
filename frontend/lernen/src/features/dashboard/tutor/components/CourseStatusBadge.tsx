
import React from 'react';
import type { CourseStatus } from './TutorCourseCard';

interface CourseStatusBadgeProps {
  status: CourseStatus;
}

const CourseStatusBadge: React.FC<CourseStatusBadgeProps> = ({ status }) => {
    const statusStyles: Record<CourseStatus, { bg: string, text: string, dot: string }> = {
        Published: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
        Draft: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
    };

    const currentStatus = statusStyles[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`}></span>
            {status}
        </span>
    );
};

export default CourseStatusBadge;
