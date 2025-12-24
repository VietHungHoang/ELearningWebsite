import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '../components/Breadcrumb';

interface BreadcrumbContextType {
    breadcrumb: BreadcrumbItem[];
    setBreadcrumb: (items: BreadcrumbItem[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const useBreadcrumb = () => {
    const context = useContext(BreadcrumbContext);
    if (!context) {
        throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
    }
    return context;
};

interface BreadcrumbProviderProps {
    children: ReactNode;
}

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({ children }) => {
    const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);

    return (
        <BreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};