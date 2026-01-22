import React, { useEffect, useRef } from 'react';
import { useKoda } from './Provider';

interface KodaIslandProps {
    engine: string;
    component: string;
    props?: any;
    className?: string;
}

/**
 * 🏝️ KodaIsland: The Cross-Framework Placeholder
 * A declarative way to insert an island (React, Svelte, Qwik) into a Zenith layout.
 */
export const KodaIsland: React.FC<KodaIslandProps> = ({ engine, component, props = {}, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { bridge } = useKoda();

    useEffect(() => {
        let unmount: (() => void) | undefined;

        if (containerRef.current) {
            bridge.mountIsland(containerRef.current, engine, component, props)
                .then(u => { unmount = u; })
                .catch(err => console.error(`Zenith Island Error [${component}]:`, err));
        }

        return () => {
            if (unmount) unmount();
        };
    }, [engine, component, JSON.stringify(props), bridge]);

    return <div ref={containerRef} className={className} data-koda-island={component} />;
};
