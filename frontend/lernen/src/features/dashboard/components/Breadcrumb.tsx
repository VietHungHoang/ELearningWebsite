import React from 'react';
import { HiChevronRight } from 'react-icons/hi';

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
    isActive?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
    return (
        <nav className={`flex items-center space-x-2 text-sm ${className}`}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <HiChevronRight className="w-4 h-4 text-gray-400" />}
                    <button
                        onClick={item.onClick}
                        disabled={!item.onClick}
                        className={`${
                            item.isActive
                                ? 'text-gray-800 font-medium'
                                : item.onClick
                                    ? 'text-gray-500 hover:text-gray-700 cursor-pointer'
                                    : 'text-gray-500 cursor-default'
                        }`}
                    >
                        {item.label}
                    </button>
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;