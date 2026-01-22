import { createRoot } from 'react-dom/client';
import React, { useEffect, useState } from 'react';
import type { Engine } from './index';
import type { Signal } from '@koda/signals';

/**
 * ⚛️ React Hook to consume Koda Signals
 */
export function useSignal<T>(signal: Signal<T>): T {
    const [value, setValue] = useState(signal.value);

    useEffect(() => {
        return signal.subscribe((newValue) => setValue(newValue));
    }, [signal]);

    return value;
}

/**
 * ⚛️ React Engine Adapter for Zenith Islands
 */
export const reactEngine: Engine = {
    name: 'react',
    mount: async (container, componentPath, props) => {
        // Dynamic import of the component
        // Note: This relies on the bundler (Vite/swc) correctly resolving the path.
        const module = await import(/* @vite-ignore */ componentPath);
        const Component = module.default || module;

        const root = createRoot(container);
        root.render(React.createElement(Component, props));

        return () => {
            root.unmount();
        };
    }
};
