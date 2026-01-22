import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * 🛰️ Koda Flight Recorder (Black Box)
 * Universal request context tracing and forensic diagnostic data.
 */

export interface FlightContext {
    requestId: string;
    startTime: number;
    metadata: Record<string, any>;
}

const storage = new AsyncLocalStorage<FlightContext>();

export const kodaContext = {
    /**
     * Run a function within a flight context.
     */
    run<T>(ctx: FlightContext, fn: () => T): T {
        return storage.run(ctx, fn);
    },

    /**
     * Get the current flight context.
     */
    current(): FlightContext | undefined {
        return storage.getStore();
    },

    /**
     * Forensic Logging helper
     */
    log(message: string, data?: any) {
        const ctx = this.current();
        const ts = Date.now();
        const prefix = ctx ? `[${ctx.requestId}] [+${ts - ctx.startTime}ms]` : `[INTERNAL]`;
        console.log(`${prefix} ${message}`, data || '');
    }
};
