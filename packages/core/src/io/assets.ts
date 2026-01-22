import { serveStatic } from 'hono/serve-static';
import type { Context, MiddlewareHandler } from 'hono';
import { getKodaEnv } from './env';

/**
 * Koda Core: Asset Orchestration Engine 🚀
 * Part of Phase 5: Deployment Orchestration
 */

/**
 * Provides conditional static asset serving based on the detected runtime.
 * Implements the 'Agnostic Engine' goal of handling assets for both Bun and Edge.
 */
export const kodaStatic = (options: {
    path?: string;
    root?: string;
    rewriteRequestPath?: (path: string) => string;
} = {}): MiddlewareHandler => {
    const env = getKodaEnv();

    // If not in fullstack mode, the static middleware is a no-op
    if (!env.isFullstack) {
        return async (c, next) => await next();
    }

    // Runtime-aware serving
    // Runtime-aware serving
    if (env.runtime === 'bun') {
        // Bun-specific optimized serving can be added here if needed
        // For now, we fallback to Hono's default which is highly optimized
        return serveStatic(options as any);
    }

    if (env.runtime === 'deno') {
        // Deno uses the standard adapter as well
        return serveStatic(options as any);
    }

    // Default to standard Hono static serving for Edge/Node
    return serveStatic(options as any);
};

/**
 * Koda-specific asset handler for a cleaner developer experience.
 */
export const assetDispatcher = async (c: Context, next: () => Promise<void>) => {
    const env = getKodaEnv();

    // Custom logic for pre-fetching or asset validation can be added here
    // while maintaining the 'Zenith Synthesis' performance standards.

    await next();
};
