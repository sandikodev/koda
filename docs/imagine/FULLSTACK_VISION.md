# 🛰️ Koda Fullstack Vision: Project Structure & Examples

> *"Imagine the perfect fullstack framework. This is what Koda looks like."*

This document describes the **ideal fullstack Koda project** structure, combining the best patterns from SvelteKit, Astro, Flutter, and Laravel.

---

## 📁 Project Structure

```
my-koda-app/
├── koda.config.ts           # Single config file (like next.config.js)
├── package.json
│
├── content/                  # 📚 Content Collections (Astro-style)
│   ├── blog/
│   │   ├── first-post.md
│   │   └── second-post.mdx
│   └── docs/
│       └── getting-started.md
│
├── routes/                   # 🛣️ File-based Routing (SvelteKit-style)
│   ├── +layout.koda         # Root layout (Zenith DSL)
│   ├── +page.koda           # Homepage (/)
│   ├── +page.server.ts      # Server-only data loader
│   │
│   ├── blog/
│   │   ├── +page.koda       # Blog listing (/blog)
│   │   └── [slug]/
│   │       ├── +page.koda   # Blog detail (/blog/:slug)
│   │       └── +page.server.ts
│   │
│   ├── app/                  # 🔒 Protected routes
│   │   ├── +layout.koda     # App shell with auth guard
│   │   ├── dashboard/
│   │   │   └── +page.tsx    # React/TSX for interactivity
│   │   └── settings/
│   │       └── +page.svelte # Svelte component (multi-engine!)
│   │
│   └── api/                  # ⚡ API Routes (Hono-native)
│       ├── users/
│       │   └── +server.ts   # GET/POST /api/users
│       ├── auth/
│       │   └── +server.ts   # Auth endpoints
│       └── webhooks/
│           └── +server.ts
│
├── lib/                      # 🧰 Shared utilities
│   ├── db.ts                # Database client (Drizzle/Prisma)
│   ├── auth.ts              # Auth logic
│   └── schemas.ts           # Zod schemas
│
├── components/               # 🎨 UI Components
│   ├── ui/                  # Project-specific "Paint"
│   │   ├── Header.koda
│   │   └── Footer.koda
│   └── islands/             # Interactive Islands
│       ├── SearchBar.tsx    # React island
│       └── Chart.svelte     # Svelte island
│
└── static/                   # 📁 Static assets
    ├── favicon.ico
    └── images/
```

---

## ⚙️ Configuration

### `koda.config.ts`

```typescript
import { defineConfig } from '@koda/core';

export default defineConfig({
  // Runtime detection is automatic, but can be overridden
  runtime: 'auto', // 'bun' | 'deno' | 'edge' | 'auto'
  
  // Frontend engine configuration
  engines: {
    default: 'zenith', // .koda files
    react: { hydration: 'full' },
    svelte: { hydration: 'compiled' },
    qwik: { hydration: 'resumable' },
  },
  
  // Security posture (applied globally)
  security: {
    rateLimit: { windowMs: 60_000, limit: 100 },
    csp: { defaultSrc: ["'self'"] },
    sanitize: true,
  },
  
  // SEO defaults
  seo: {
    siteName: 'My Koda App',
    defaultImage: '/og-image.png',
  },
  
  // Content collections
  content: {
    collections: ['blog', 'docs'],
  },
});
```

---

## 🎨 Zenith DSL Examples

### `routes/+layout.koda`

```koda
// Root layout for the entire app

import @koda/ui;
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

Layout Root {
  ZenithStage {
    Header {}
    
    Slot {
      // Child pages render here
    }
    
    Footer {}
  }
}
```

### `routes/+page.koda`

```koda
// Homepage (/)

import @koda/ui;

Screen Home {
  meta: {
    title: "Welcome to My App";
    description: "Built with Koda Zenith";
  };

  Layout.Bento {
    columns: 3;
    gap: lg;
    
    GradientCard {
      span: 2;
      variant: primary;
      
      content: Column {
        Text("Welcome to the Future", style: Styles.H1);
        Text("Powered by Koda Zenith", style: Styles.Subtitle);
        Button("Get Started", href: "/app/dashboard");
      };
    }
    
    BentoCard {
      title: "Fast";
      icon: Icons.Zap;
      description: "Runs native on Bun/Deno";
    }
    
    BentoCard {
      title: "Secure";
      icon: Icons.Shield;
      description: "Enterprise-grade by default";
    }
  }
}
```

---

## 🖥️ Server-Side Data Loading

### `routes/+page.server.ts`

```typescript
// Server-side data loader for homepage

import type { PageServerLoad } from '@koda/core';
import { db } from '@/lib/db';

export const load: PageServerLoad = async ({ request }) => {
  const stats = await db.query.stats.findFirst();
  
  return {
    stats,
    timestamp: Date.now(),
  };
};
```

---

## ⚡ API Routes (Hono-native)

### `routes/api/users/+server.ts`

```typescript
// API Route: /api/users

import { koda, type RouteHandler } from '@koda/core';

export const GET: RouteHandler = async (c) => {
  const users = await db.select().from(usersTable);
  return c.json(koda.protect(users));
};

export const POST: RouteHandler = async (c) => {
  const data = await c.req.json();
  const validated = UserSchema.parse(data);
  
  const user = await db.insert(usersTable).values(validated);
  return c.json(user, 201);
};
```

---

## 🏝️ Multi-Engine Islands

### React Island: `routes/app/dashboard/+page.tsx`

```tsx
// Interactive dashboard using React hydration

import { useQuery } from '@tanstack/react-query';
import { BentoCard, ResponsiveGrid } from '@koda/ui';
import { RevenueChart } from '@/components/islands/Chart';

export default function Dashboard() {
  const { data: stats } = useQuery(['dashboard'], fetchDashboard);
  
  return (
    <ResponsiveGrid columns={3}>
      <BentoCard>
        <RevenueChart data={stats?.revenue} />
      </BentoCard>
    </ResponsiveGrid>
  );
}

// This tells Koda to use React hydration for this page
export const config = {
  engine: 'react',
};
```

### Island Component: `components/islands/SearchBar.tsx`

```tsx
// Interactive island - only this component is hydrated

import { useState } from 'react';
import { KodaIsland } from '@koda/ui';

export function SearchBar() {
  const [query, setQuery] = useState('');
  
  return (
    <KodaIsland engine="react">
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
    </KodaIsland>
  );
}
```

---

## 🚀 CLI Commands

```bash
# Create new project
koda init my-app

# Development (auto-detects Bun/Deno)
koda dev

# Build for production
koda build

# Security audit
koda audit

# Generate component
koda generate component MyCard

# Database migration
koda db migrate

# Deploy (auto-detects target)
koda deploy
```

---

## 🔄 Request Lifecycle

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │ ───▶ │ Koda Server │ ───▶ │  +page.koda │
│  (Request)  │      │   (Hono)    │      │  or .tsx    │
└─────────────┘      └──────┬──────┘      └──────┬──────┘
                            │                     │
                            ▼                     ▼
                     ┌─────────────┐      ┌─────────────┐
                     │ +page.server│      │   Render    │
                     │   (Load)    │ ───▶ │  to HTML    │
                     └─────────────┘      └──────┬──────┘
                                                 │
                                                 ▼
                     ┌─────────────────────────────────────┐
                     │          Response HTML              │
                     │  ┌─────────────────────────────────┐   │
                     │  │ Static Content (0KB JS)         │   │
                     │  └─────────────────────────────────┘   │
                     │  ┌─────────────────────────────────┐   │
                     │  │ <KodaIsland engine="react">     │   │
                     │  │   (Hydrated on client)          │   │
                     │  └─────────────────────────────────┘   │
                     └─────────────────────────────────────┘
```

---

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
import { koda } from '@koda/core';
import type { MiddlewareHandler } from '@koda/core';

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
import { koda, type RouteHandler } from '@koda/core';
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

import { useErrorDX } from '@koda/core/dx';

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

import type { PageServerLoad, PageProps } from '@koda/core';

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

## 🔌 Middleware & Hooks

### Global Middleware

```typescript
// middleware.ts (root level)

import { koda, type MiddlewareHandler } from '@koda/core';

// Applied to ALL routes
export const middleware: MiddlewareHandler[] = [
  // Request ID for tracing
  async (c, next) => {
    c.set('requestId', crypto.randomUUID());
    await next();
  },
  
  // Logging
  async (c, next) => {
    const start = Date.now();
    await next();
    console.log(`${c.req.method} ${c.req.url} - ${Date.now() - start}ms`);
  },
  
  // Security headers
  ...koda.security(),
];
```

### Route-specific Middleware

```typescript
// routes/app/+layout.server.ts

import { requireAuth } from '@/lib/auth';

// All routes under /app require authentication
export const middleware = [requireAuth];
```

### Hooks

```typescript
// hooks.server.ts

import type { Handle } from '@koda/core';

export const handle: Handle = async ({ event, resolve }) => {
  // Before request
  event.locals.startTime = Date.now();
  
  const response = await resolve(event);
  
  // After request
  response.headers.set('X-Response-Time', 
    `${Date.now() - event.locals.startTime}ms`
  );
  
  return response;
};
```

---

## 📦 Content Collections (Astro-style)

### Defining Collections

```typescript
// content/config.ts

import { defineCollection, z } from '@koda/core/content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    author: z.string(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

const docs = defineCollection({
  schema: z.object({
    title: z.string(),
    order: z.number(),
    category: z.string(),
  }),
});

export const collections = { blog, docs };
```

### Using Collections

```typescript
// routes/blog/+page.server.ts

import { getCollection } from '@koda/core/content';

export const load: PageServerLoad = async () => {
  const posts = await getCollection('blog');
  
  return {
    posts: posts
      .sort((a, b) => b.data.publishedAt - a.data.publishedAt)
      .slice(0, 10),
  };
};
```

---

## 🌍 Internationalization (i18n)

### Configuration

```typescript
// koda.config.ts

export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id', 'ja'],
    routing: 'prefix', // /en/about, /id/about
  },
});
```

### Usage in `.koda` files

```koda
import @koda/ui;
import { t } from "@koda/core/i18n";

Screen About {
  Text(t("about.title"), style: Styles.H1);
  Text(t("about.description"), style: Styles.Body);
}
```

---

<div align="center">

**"The synthesis of everything great in modern web development."**

This is Koda. This is the future.

</div>
