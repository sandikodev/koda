## 🎯 Key Paradigm Synthesis

| Source Framework | What Koda Takes |
|------------------|-----------------|
| **SvelteKit** | `+page`, `+server`, `+layout` file conventions |
| **Astro** | Island rendering, Content Collections, 0KB JS default |
| **Flutter/Dart** | `.koda` declarative DSL, consistent UI primitives |
| **Hono/Elysia** | Fluent API, type-safe RPC, edge-native |
| **Laravel** | CLI scaffolding, security automation, auditing |
| **Qwik** | Resumable hydration option |

---

## 🌐 Deployment Targets

```bash
# Native Bun (Recommended)
koda deploy --target=bun

# Deno Deploy
koda deploy --target=deno

# Vercel Edge
koda deploy --target=vercel

# Cloudflare Workers
koda deploy --target=cloudflare

# Self-hosted Docker
koda deploy --target=docker

# Web3 (4EVERLAND/IPFS)
koda deploy --target=web3
```

---

## 🔐 Authentication & Authorization

### `lib/auth.ts`

```typescript
import { koda } from '@koda/server';
import type { MiddlewareHandler } from '@koda/server';

// Session-based auth middleware
export const requireAuth: MiddlewareHandler = async (c, next) => {
  const session = await koda.session.get(c);
  
  if (!session?.userId) {
    return c.redirect('/login');
  }
  
  c.set('user', session.user);
  await next();
};

// Role-based access control
export const requireRole = (role: string): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.get('user');
    
    if (!user?.roles?.includes(role)) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    
    await next();
  };
};
```

### `routes/api/auth/+server.ts`

```typescript
import { koda, type RouteHandler } from '@koda/server';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const POST: RouteHandler = async (c) => {
  const data = LoginSchema.parse(await c.req.json());
  
  const user = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  });
  
  if (!user || !await verifyPassword(data.password, user.passwordHash)) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  
  // Create session
  await koda.session.create(c, { userId: user.id, user });
  
  return c.json({ success: true, user: koda.protect(user) });
};

export const DELETE: RouteHandler = async (c) => {
  await koda.session.destroy(c);
  return c.json({ success: true });
};
```

---

### 🔒 Deep Dive: Sovereign Security Protocols

Why did we call it "Institutional"? Because Koda applies **Banking-Grade Security** by default, not as an afterthought.

1.  **Encrypted Session Stores**: `koda.session.create()` doesn't just set a cookie. It encrypts the session payload using `AES-256-GCM` before it ever leaves the server.
2.  **Auto-CSRF (Double-Submit)**: Every mutation request automatically checks for a `X-CSRF-Token` header that matches the encrypted cookie. No middleware configuration required.
3.  **PII Redaction**: The Koda logger automatically detects and masks fields like `password`, `creditCard`, `jti`, and `ssn` in your logs.

```typescript
// How Koda sees your logs internally:
koda.log.info("User Login", { email: "user@example.com", password: "password123" });
// Output: [INFO] User Login { email: "user@example.com", password: "[REDACTED]" }
```

> **The Insight**: You don't configure security in Koda; you inherit it. This is the **Fortress Principle**.

---

## 🗄️ Database Integration

### `lib/db.ts` (Drizzle ORM)

```typescript
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';

// Auto-detect: Bun SQLite for dev, Turso for production
const sqlite = koda.env.isDev 
  ? new Database('local.db')
  : createClient({ url: process.env.TURSO_URL });

export const db = drizzle(sqlite, { schema });
```

### `lib/schema.ts`

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name'),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content'),
  authorId: integer('author_id').references(() => users.id),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
});
```

---

## 🛡️ Error Handling & DX

### `routes/+error.koda`

```koda
// Custom error page

import @koda/ui;

Screen ErrorPage {
  props: { error, statusCode };

  ZenithStage {
    Column {
      align: center;
      gap: lg;
      
      Text(statusCode, style: Styles.Display);
      Text(error.message, style: Styles.Body);
      
      Button("Go Home", href: "/");
    }
  }
}
```

### Server Error Boundary

```typescript
// lib/errorHandler.ts

import { useErrorDX } from '@koda/dx';

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (error) {
    // In development: rich error diagnostics with source code
    if (koda.env.isDev) {
      const dx = useErrorDX(error, c.req.url);
      return c.html(dx.render());
    }
    
    // In production: sanitized error response
    console.error('[Koda Error]', error);
    return c.json({ 
      error: 'Internal Server Error',
      requestId: c.get('requestId'),
    }, 500);
  }
};
```

---

## 📝 TypeScript Integration

### Type-Safe Data Flow

```typescript
// routes/blog/[slug]/+page.server.ts

import type { PageServerLoad, PageProps } from '@koda/server';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: { name: string };
}

export const load: PageServerLoad<BlogPost> = async ({ params }) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, params.slug),
    with: { author: true },
  });
  
  if (!post) throw new KodaError(404, 'Post not found');
  
  return post;
};
```

```koda
// routes/blog/[slug]/+page.koda

import @koda/ui;

Screen BlogPost {
  // Type-safe props from server loader
  props: { data: BlogPost };

  Article {
    Text(data.title, style: Styles.H1);
    Text("by " + data.author.name, style: Styles.Caption);
    
    Markdown {
      content: data.content;
    }
  }
}
```

---

## 🔧 Environment Variables

### `.env`

```bash
# Runtime
NODE_ENV=development
KODA_MODE=fullstack

# Database
DATABASE_URL=file:./local.db
TURSO_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token

# Auth
SESSION_SECRET=your-super-secret-key
JWT_SECRET=another-secret

# External APIs
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
```

### Type-Safe Env Access

```typescript
// lib/env.ts

import { z } from 'zod';

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);
```

---

## 🧪 Testing

### Unit Tests

```typescript
// tests/api/users.test.ts

import { describe, it, expect } from 'bun:test';
import { app } from '@/routes/api/users/+server';

describe('Users API', () => {
  it('should create a user', async () => {
    const res = await app.request('/api/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', name: 'Test' }),
    });
    
    expect(res.status).toBe(201);
    const user = await res.json();
    expect(user.email).toBe('test@example.com');
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/auth.spec.ts

import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('[name=email]', 'user@example.com');
  await page.fill('[name=password]', 'password123');
  await page.click('button[type=submit]');
  
  await expect(page).toHaveURL('/app/dashboard');
});
```

### CLI Testing Command

```bash
# Run all tests
koda test

# Run unit tests only
koda test --unit

# Run E2E tests
koda test --e2e

# Watch mode
koda test --watch
```

---

