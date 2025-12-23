import React from 'react';
import { HiChevronRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
    label: string;
    path?: string;
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
                    {item.path ? (
                        <Link
                            to={item.path}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : item.onClick ? (
                        <button
                            onClick={item.onClick}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span className={`${index === items.length - 1 ? 'text-black font-medium' : 'text-gray-500'}`}>
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;