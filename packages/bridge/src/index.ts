/**
 * 🌉 Koda Engine Bridge: The Universal Orchestrator
 * Part of the Zenith "Islands" architecture.
 */

export interface Engine {
    name: string;
    mount: (container: HTMLElement, componentPath: string, props: any) => Promise<() => void>;
}

export class EngineBridge {
    private engines: Map<string, Engine> = new Map();

    register(engine: Engine) {
        this.engines.set(engine.name, engine);
    }

    async mountIsland(container: HTMLElement, engineName: string, componentPath: string, props: any) {
        const engine = this.engines.get(engineName);
        if (!engine) {
            throw new Error(`Engine Bridge Error: Engine "${engineName}" not registered.`);
        }

        return await engine.mount(container, componentPath, props);
    }
}

export const kodaBridge = new EngineBridge();

export * from './Provider';
export * from './Island';
export { reactEngine } from './react';
export { svelteEngine } from './svelte';
export { qwikEngine } from './qwik';
