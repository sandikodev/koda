## 🔌 Proxy & Lifecycle: The Zenith Gateway Synthesis

Koda adopts the **Next.js 16 Proxy-first approach** for maximum architectural clarity. Instead of hidden middleware, we use an explicit **`proxy.ts`**—the institutional gateway that intercepts every request at the edge.

### Unified `proxy.ts` (Entry Point)

The `proxy.ts` serves as the first line of intelligence, combining SvelteKit's **functional purity** with Next.js's **syntactic consistency**.

```typescript
// proxy.ts

import { handle, next, redirect, koda } from '@koda/server';

/**
 * The Zenith Gateway (Inspired by Next.js 16 Proxy)
 * - Pure Nuance: SvelteKit-style functional { event, resolve }
 * - Architectural Clarity: Explicit proxying before dispatch
 */
export default handle(async ({ event, resolve }) => {
  // 1. Edge-first Interception & ID Tracing
  const start = Date.now();
  event.locals.requestId = crypto.randomUUID();
  
  // 2. Syntactic Sugar Guards
  if (event.url.pathname.startsWith('/app') && !event.locals.session) {
    return redirect('/login');
  }

  // 3. Agnostic Resolution
  const response = await resolve(event);
  
  // 4. Institutional Hardening
  // We apply the standard chassis security headers automatically
  const securityHeaders = koda.security();
  for (const [key, value] of Object.entries(securityHeaders)) {
     response.headers.set(key, value);
  }

  // 5. Forensic Logging & Metrics
  response.headers.set('X-Proxy-Engine', 'Koda Zenith');
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);
  response.headers.set('X-Request-ID', event.locals.requestId);
  
  console.log(`${event.request.method} ${event.url.pathname} - ${Date.now() - start}ms`);

  return response;
});
```

### Route-specific "Pure" Interceptors

For individual routes, Koda maintains the clean array-based approach.

```typescript
// routes/app/settings/+page.server.ts

import { requirePermission } from '@/lib/auth';

// Pure, granular authority
export const middleware = [
  requirePermission('admin:write'),
];
```

---

## ⚡ Lifecycle Hooks orchestration

Beyond the request/response cycle, Koda provides institutional hooks for the entire server lifecycle.

```typescript
// lib/lifecycle.ts

import { onBoot, onShutdown } from '@koda/server';

onBoot(async () => {
  console.log("🛰️ Zenith Engine Booted: Connecting to specialized clusters...");
});

onShutdown(async () => {
  console.log("🛡️ Graceful shutdown initiated: Flushing audit logs...");
});
```

---
