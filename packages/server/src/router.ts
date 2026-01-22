import { Hono } from 'hono';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * 🗺️ Koda Meta-Router: Discovery Engine
 * Implements filesystem-based routing +page.tsx and +server.ts conventions.
 */

export async function registerMetaRoutes(app: Hono, routesDir: string) {
    if (!(await fs.stat(routesDir).catch(() => null))) {
        return; // Routes directory does not exist
    }

    const entries = await fs.readdir(routesDir, { recursive: true, withFileTypes: true });

    for (const entry of entries) {
        if (!entry.isFile()) continue;

        const fullPath = path.join(entry.parentPath, entry.name);
        const relativePath = path.relative(routesDir, fullPath);
        const routePath = ('/' + path.dirname(relativePath)).replace(/\/$/, '') || '/';

        if (entry.name === '+server.ts') {
            const module = await import(fullPath);
            if (module.default) {
                app.route(routePath, module.default);
            }
        }

        // Handling +page.tsx will be integrated with the SSR engine
        // in the implementation of the main koda factory update.
    }
}
