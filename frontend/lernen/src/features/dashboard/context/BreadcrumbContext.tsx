import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
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

// Optional version that doesn't throw - useful for pages that can be used both inside and outside Dashboard
export const useBreadcrumbOptional = () => {
    const context = useContext(BreadcrumbContext);
    return context;
};

interface BreadcrumbProviderProps {
    children: ReactNode;
}

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({ children }) => {
    const [breadcrumb, setBreadcrumbState] = useState<BreadcrumbItem[]>([]);

    // Memoize setBreadcrumb to prevent infinite re-renders
    const setBreadcrumb = useCallback((items: BreadcrumbItem[]) => {
        setBreadcrumbState(items);
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        breadcrumb,
        setBreadcrumb
    }), [breadcrumb, setBreadcrumb]);

    return (
        <BreadcrumbContext.Provider value={contextValue}>
            {children}
        </BreadcrumbContext.Provider>
    );
};