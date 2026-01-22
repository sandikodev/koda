/**
 * Koda Core: Environment Awareness Engine 🛰️
 * Part of Phase 5: Deployment Orchestration
 */

export type KodaRuntime = 'bun' | 'edge' | 'node' | 'deno' | 'unknown';

export interface KodaEnv {
    runtime: KodaRuntime;
    isDev: boolean;
    isFullstack: boolean;
}

/**
 * Detects the current runtime environment for Koda Core.
 * Ensures the 'Agnostic Engine' promise by providing runtime-safe abstractions.
 */
export const getKodaEnv = (): KodaEnv => {
    let runtime: KodaRuntime = 'unknown';

    if (typeof Deno !== 'undefined') {
        runtime = 'deno';
    } else if (typeof Bun !== 'undefined') {
        runtime = 'bun';
    } else if (typeof EdgeRuntime !== 'undefined') {
        runtime = 'edge';
    } else if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        runtime = 'node';
    }

    return {
        runtime,
        isDev: process.env.NODE_ENV === 'development',
        // Logic for Fullstack vs API-only will be refined in asset orchestration
        isFullstack: process.env.KODA_MODE === 'fullstack' || !!process.env.VITE,
    };
};

declare global {
    var Bun: any;
    var Deno: any;
    var EdgeRuntime: any;
}
