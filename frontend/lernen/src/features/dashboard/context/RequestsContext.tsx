import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface RequestsContextType {
    totalRequestsCount: number;
    setTotalRequestsCount: (count: number) => void;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [totalRequestsCount, setTotalRequestsCount] = useState<number>(0);

    return (
        <RequestsContext.Provider value={{ totalRequestsCount, setTotalRequestsCount }}>
            {children}
        </RequestsContext.Provider>
    );
};

export const useRequests = () => {
    const context = useContext(RequestsContext);
    if (context === undefined) {
        throw new Error('useRequests must be used within a RequestsProvider');
    }
    return context;
};
