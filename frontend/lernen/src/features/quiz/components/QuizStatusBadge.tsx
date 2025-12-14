import React from 'react';

export type QuizStatus = 'Published' | 'Draft' | 'Active' | 'Archived';

interface QuizStatusBadgeProps {
  status: QuizStatus;
}

const QuizStatusBadge: React.FC<QuizStatusBadgeProps> = ({ status }) => {
    const statusStyles: Record<QuizStatus, { bg: string, text: string, dot: string }> = {
        Published: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
        Active: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
        Draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
        Archived: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
    };

    const currentStatus = statusStyles[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`}></span>
            {status}
        </span>
    );
};

export default QuizStatusBadge;