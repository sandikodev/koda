import React, { createContext, useContext, ReactNode } from 'react';
import { kodaBridge, type EngineBridge } from './index';

interface KodaContextType {
    bridge: EngineBridge;
}

const KodaContext = createContext<KodaContextType | null>(null);

/**
 * 🌉 KodaProvider: The Hydration & State Anchor
 * Wraps the application to provide bridge access and shared signal context.
 */
export const KodaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <KodaContext.Provider value={{ bridge: kodaBridge }}>
            {children}
        </KodaContext.Provider>
    );
};

export const useKoda = () => {
    const context = useContext(KodaContext);
    if (!context) {
        throw new Error('useKoda must be used within a KodaProvider');
    }
    return context;
};
