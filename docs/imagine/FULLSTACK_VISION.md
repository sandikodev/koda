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
---

## 🧠 State Management

### Client State (Zustand-like)

```typescript
// lib/stores/cart.ts

import { createStore } from '@koda/core/state';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  total: () => number;
}

export const useCart = createStore<CartStore>((set, get) => ({
  items: [],
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  
  total: () => get().items.reduce((sum, i) => sum + i.price, 0),
}));
```

### Server State (React Query Integration)

```typescript
// lib/queries/users.ts

import { createQuery, createMutation } from '@koda/core/query';

export const useUsers = createQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then((r) => r.json()),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

export const useCreateUser = createMutation({
  mutationFn: (data: CreateUserInput) => 
    fetch('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  onSuccess: () => {
    queryClient.invalidateQueries(['users']);
  },
});
```

---

## ⚡ Caching & Invalidation

### Route-level Caching

```typescript
// routes/blog/+page.server.ts

export const load: PageServerLoad = async () => {
  const posts = await db.query.posts.findMany();
  return posts;
};

// Cache configuration
export const config = {
  cache: {
    maxAge: 60, // 1 minute
    staleWhileRevalidate: 300, // 5 minutes
    tags: ['blog', 'posts'],
  },
};
```

### Cache Invalidation API

```typescript
// routes/api/admin/cache/+server.ts

import { koda } from '@koda/core';

export const POST: RouteHandler = async (c) => {
  const { tags } = await c.req.json();
  
  // Invalidate by tags
  await koda.cache.invalidate(tags);
  
  // Or invalidate specific paths
  await koda.cache.revalidatePath('/blog');
  
  return c.json({ success: true });
};
```

### Edge Caching (CDN-aware)

```typescript
// koda.config.ts

export default defineConfig({
  cache: {
    provider: 'cloudflare', // or 'vercel', 'fastly', 'custom'
    defaultTTL: 3600,
    
    // Per-route overrides
    routes: {
      '/api/*': { cache: false },
      '/static/*': { maxAge: 31536000 }, // 1 year
    },
  },
});
```

---

## 🔴 Real-time Features

### WebSocket Server

```typescript
// routes/ws/chat/+server.ts

import { koda, type WebSocketHandler } from '@koda/core';

export const ws: WebSocketHandler = {
  open(ws) {
    ws.subscribe('chat');
    koda.ws.broadcast('chat', { type: 'join', user: ws.data.user });
  },
  
  message(ws, message) {
    const data = JSON.parse(message);
    
    koda.ws.broadcast('chat', {
      type: 'message',
      user: ws.data.user,
      text: data.text,
      timestamp: Date.now(),
    });
  },
  
  close(ws) {
    koda.ws.broadcast('chat', { type: 'leave', user: ws.data.user });
  },
};
```

### Server-Sent Events (SSE)

```typescript
// routes/api/notifications/stream/+server.ts

import { koda, type RouteHandler } from '@koda/core';

export const GET: RouteHandler = async (c) => {
  const userId = c.get('user').id;
  
  return koda.sse(c, async (stream) => {
    // Subscribe to user's notification channel
    const unsubscribe = koda.pubsub.subscribe(`user:${userId}`, (data) => {
      stream.write({ event: 'notification', data });
    });
    
    // Keep connection alive
    const interval = setInterval(() => {
      stream.write({ event: 'ping', data: { time: Date.now() } });
    }, 30000);
    
    // Cleanup on disconnect
    stream.onClose(() => {
      clearInterval(interval);
      unsubscribe();
    });
  });
};
```

### Client Usage in `.koda`

```koda
import @koda/ui;
import { useWebSocket, useSSE } from "@koda/core/realtime";

Screen ChatRoom {
  state messages = [];
  
  effect: {
    const ws = useWebSocket("/ws/chat");
    ws.onMessage((msg) => messages.push(msg));
  };

  Column {
    ForEach(messages, (msg) => {
      ChatBubble {
        user: msg.user;
        text: msg.text;
      }
    });
    
    ChatInput {
      onSend: (text) => ws.send({ text });
    }
  }
}
```

---

## 📁 File Uploads & Storage

### Upload Handler

```typescript
// routes/api/upload/+server.ts

import { koda, type RouteHandler } from '@koda/core';

export const POST: RouteHandler = async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }
  
  // Validate file
  const validation = koda.upload.validate(file, {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  });
  
  if (!validation.ok) {
    return c.json({ error: validation.error }, 400);
  }
  
  // Upload to storage (auto-detects: local, S3, R2, etc.)
  const result = await koda.storage.upload(file, {
    folder: 'uploads',
    generateThumbnail: true,
  });
  
  return c.json({
    url: result.url,
    thumbnailUrl: result.thumbnailUrl,
    size: result.size,
  });
};
```

### Storage Configuration

```typescript
// koda.config.ts

export default defineConfig({
  storage: {
    // Development: local filesystem
    dev: {
      driver: 'local',
      basePath: './uploads',
    },
    
    // Production: Cloudflare R2
    prod: {
      driver: 'r2',
      bucket: 'my-app-uploads',
      publicUrl: 'https://cdn.myapp.com',
    },
    
    // Image optimization
    images: {
      optimize: true,
      formats: ['webp', 'avif'],
      sizes: [320, 640, 1280, 1920],
    },
  },
});
```

### Client Upload Component

```koda
import @koda/ui;
import { useUpload } from "@koda/core/storage";

Screen ProfileSettings {
  state avatarUrl = user.avatarUrl;
  
  Column {
    Avatar {
      src: avatarUrl;
      size: xl;
    }
    
    FileInput {
      accept: "image/*";
      onSelect: async (file) => {
        const { url } = await useUpload(file);
        avatarUrl = url;
      };
      
      UploadZone {
        icon: Icons.Camera;
        text: "Change Avatar";
      }
    }
  }
}
```

---

## ⏰ Background Jobs & Queues

### Job Definition

```typescript
// jobs/sendEmail.ts

import { defineJob } from '@koda/core/jobs';

export const sendEmailJob = defineJob({
  name: 'send-email',
  
  async handler({ to, subject, template, data }) {
    const html = await renderTemplate(template, data);
    
    await emailClient.send({
      to,
      subject,
      html,
    });
  },
  
  // Retry configuration
  retry: {
    attempts: 3,
    backoff: 'exponential',
  },
});
```

### Scheduling & Dispatch

```typescript
// routes/api/users/+server.ts

import { sendEmailJob } from '@/jobs/sendEmail';

export const POST: RouteHandler = async (c) => {
  const user = await createUser(data);
  
  // Dispatch background job
  await sendEmailJob.dispatch({
    to: user.email,
    subject: 'Welcome!',
    template: 'welcome',
    data: { name: user.name },
  });
  
  return c.json(user, 201);
};
```

### Scheduled Jobs (Cron)

```typescript
// jobs/dailyDigest.ts

import { defineCron } from '@koda/core/jobs';

export const dailyDigest = defineCron({
  name: 'daily-digest',
  schedule: '0 9 * * *', // 9 AM daily
  
  async handler() {
    const users = await db.query.users.findMany();
    
    for (const user of users) {
      await sendEmailJob.dispatch({
        to: user.email,
        subject: 'Your Daily Digest',
        template: 'digest',
        data: await getUserDigestData(user.id),
      });
    }
  },
});
```

### Queue Dashboard

```bash
# View job queue status
koda jobs status

# Retry failed jobs
koda jobs retry --failed

# Clear completed jobs
koda jobs clear --completed
```

---

## 📧 Email Integration

### Email Configuration

```typescript
// koda.config.ts

export default defineConfig({
  email: {
    provider: 'resend', // or 'sendgrid', 'postmark', 'ses'
    from: 'hello@myapp.com',
    replyTo: 'support@myapp.com',
  },
});
```

### Email Templates

```typescript
// emails/welcome.tsx

import { Email, Section, Text, Button } from '@koda/core/email';

interface WelcomeEmailProps {
  name: string;
  verifyUrl: string;
}

export function WelcomeEmail({ name, verifyUrl }: WelcomeEmailProps) {
  return (
    <Email subject="Welcome to MyApp!">
      <Section>
        <Text>Hi {name},</Text>
        <Text>Thanks for signing up! Please verify your email:</Text>
        <Button href={verifyUrl}>Verify Email</Button>
      </Section>
    </Email>
  );
}
```

### Sending Emails

```typescript
import { koda } from '@koda/core';
import { WelcomeEmail } from '@/emails/welcome';

await koda.email.send({
  to: user.email,
  react: <WelcomeEmail name={user.name} verifyUrl={url} />,
});
```

---

## 💳 Payment Integration

### Stripe Setup

```typescript
// lib/payments.ts

import { createPaymentProvider } from '@koda/core/payments';

export const payments = createPaymentProvider({
  provider: 'stripe',
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
});
```

### Checkout Session

```typescript
// routes/api/checkout/+server.ts

import { payments } from '@/lib/payments';

export const POST: RouteHandler = async (c) => {
  const { priceId, userId } = await c.req.json();
  
  const session = await payments.createCheckout({
    priceId,
    customerId: userId,
    successUrl: '/checkout/success',
    cancelUrl: '/checkout/cancel',
  });
  
  return c.json({ url: session.url });
};
```

### Webhook Handler

```typescript
// routes/api/webhooks/stripe/+server.ts

import { payments } from '@/lib/payments';

export const POST: RouteHandler = async (c) => {
  const event = await payments.constructWebhookEvent(c);
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data);
      break;
    case 'invoice.paid':
      await handleInvoicePaid(event.data);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data);
      break;
  }
  
  return c.json({ received: true });
};
```

### Subscription Management

```koda
import @koda/ui;
import { useSubscription } from "@koda/core/payments";

Screen BillingSettings {
  state subscription = useSubscription();

  Column {
    Card {
      title: "Current Plan";
      
      content: Column {
        Text(subscription.planName, style: Styles.H2);
        Text("$" + subscription.price + "/month", style: Styles.Body);
        Text("Next billing: " + subscription.nextBillingDate);
      };
      
      actions: Row {
        Button("Change Plan", onClick: openPlanModal);
        Button("Cancel", variant: danger, onClick: cancelSubscription);
      };
    }
    
    Card {
      title: "Payment Method";
      content: PaymentMethodDisplay { card: subscription.card };
      actions: Button("Update", onClick: openPaymentModal);
    }
    
    Card {
      title: "Billing History";
      content: InvoiceList { invoices: subscription.invoices };
    }
  }
}
```

---

## 📊 Analytics & Monitoring

### Built-in Analytics

```typescript
// koda.config.ts

export default defineConfig({
  analytics: {
    // Server-side analytics (privacy-first)
    provider: 'koda', // or 'plausible', 'umami', 'posthog'
    
    // Track these events automatically
    autoTrack: ['pageview', 'click', 'form_submit'],
    
    // Custom events
    events: ['purchase', 'signup', 'upgrade'],
  },
});
```

### Custom Event Tracking

```typescript
// lib/analytics.ts

import { koda } from '@koda/core';

// Track custom events
koda.analytics.track('purchase', {
  productId: product.id,
  amount: order.total,
  currency: 'USD',
});

// Track page views with custom data
koda.analytics.page('/product/:id', {
  productName: product.name,
  category: product.category,
});
```

### Error Monitoring (Sentry-like)

```typescript
// koda.config.ts

export default defineConfig({
  monitoring: {
    errors: {
      provider: 'sentry', // or 'koda', 'bugsnag'
      dsn: process.env.SENTRY_DSN,
      
      // Sample rate for performance monitoring
      tracesSampleRate: 0.1,
    },
    
    // Health checks
    healthCheck: {
      path: '/api/health',
      checks: ['database', 'redis', 'external-api'],
    },
  },
});
```

### Performance Monitoring

```typescript
// Automatic performance tracking
export const load: PageServerLoad = async ({ params }) => {
  // This is automatically traced
  const data = await koda.trace('db.query', () => 
    db.query.posts.findFirst({ where: eq(posts.slug, params.slug) })
  );
  
  return data;
};
```

### Dashboard Metrics

```typescript
// routes/api/admin/metrics/+server.ts

import { koda } from '@koda/core';

export const GET: RouteHandler = async (c) => {
  const metrics = await koda.metrics.get({
    range: '24h',
    metrics: [
      'requests_total',
      'response_time_p95',
      'error_rate',
      'active_users',
    ],
  });
  
  return c.json(metrics);
};
```

---

## 🚀 Performance Optimization

### Code Splitting & Lazy Loading

```koda
import @koda/ui;
import { lazy } from "@koda/core";

// Lazy load heavy components
const HeavyChart = lazy(() => import("@/components/HeavyChart"));
const DataTable = lazy(() => import("@/components/DataTable"));

Screen Dashboard {
  Suspense {
    fallback: Skeleton { height: 300 };
    
    HeavyChart { data: chartData }
  }
  
  Suspense {
    fallback: TableSkeleton { rows: 10 };
    
    DataTable { data: tableData }
  }
}
```

### Prefetching

```koda
import @koda/ui;

Screen ProductList {
  ForEach(products, (product) => {
    // Prefetch product page on hover
    Link {
      href: "/product/" + product.id;
      prefetch: hover; // or 'visible', 'intent', 'render'
      
      ProductCard { product: product }
    }
  });
}
```

### Image Optimization

```koda
import @koda/ui;

Screen Gallery {
  // Automatic optimization with lazy loading
  Image {
    src: photo.url;
    width: 800;
    height: 600;
    
    // Auto-generate srcset for responsive images
    sizes: "(max-width: 640px) 100vw, 800px";
    
    // Blur placeholder while loading
    placeholder: blur;
    blurDataURL: photo.blurHash;
    
    // Priority loading for above-the-fold images
    priority: true;
  }
}
```

### Bundle Optimization

```typescript
// koda.config.ts

export default defineConfig({
  build: {
    // Automatic code splitting
    splitting: true,
    
    // Tree-shaking
    treeShaking: true,
    
    // Minification
    minify: 'esbuild', // or 'terser'
    
    // Manual chunks for optimization
    manualChunks: {
      'vendor-react': ['react', 'react-dom'],
      'vendor-charts': ['recharts', 'd3'],
    },
    
    // Analyze bundle size
    analyze: process.env.ANALYZE === 'true',
  },
});
```

---

## 📱 PWA & Offline Support

### PWA Configuration

```typescript
// koda.config.ts

export default defineConfig({
  pwa: {
    name: 'My App',
    shortName: 'MyApp',
    description: 'A modern web application',
    startUrl: '/',
    display: 'standalone',
    
    // Icons (auto-generated from source)
    icon: './static/icon.png',
    
    // Theme colors
    themeColor: '#4F46E5',
    backgroundColor: '#0F172A',
    
    // Workbox strategies
    workbox: {
      // Cache static assets
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: { cacheName: 'images' },
        },
        {
          urlPattern: /^https:\/\/api\./,
          handler: 'NetworkFirst',
          options: { cacheName: 'api' },
        },
      ],
    },
  },
});
```

### Offline Fallback Page

```koda
// routes/+offline.koda

import @koda/ui;

Screen OfflinePage {
  ZenithStage {
    Column {
      align: center;
      gap: lg;
      
      Icon(Icons.WifiOff, size: 64, color: "slate-400");
      Text("You're Offline", style: Styles.H1);
      Text("Check your connection and try again", style: Styles.Body);
      
      Button("Retry", onClick: () => location.reload());
    }
  }
}
```

### Service Worker Hooks

```typescript
// service-worker.ts

import { precacheAndRoute, cleanupOutdatedCaches } from '@koda/core/sw';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cleanup old caches
cleanupOutdatedCaches();

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncPendingForms());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      data: data.url,
    })
  );
});
```

---

## 🔍 Search & Filtering

### Full-Text Search Setup

```typescript
// koda.config.ts

export default defineConfig({
  search: {
    provider: 'meilisearch', // or 'algolia', 'typesense', 'sqlite-fts5'
    host: process.env.MEILISEARCH_HOST,
    apiKey: process.env.MEILISEARCH_KEY,
    
    // Index configuration
    indexes: {
      products: {
        searchableAttributes: ['name', 'description', 'tags'],
        filterableAttributes: ['category', 'price', 'inStock'],
        sortableAttributes: ['price', 'createdAt'],
      },
    },
  },
});
```

### Search API

```typescript
// routes/api/search/+server.ts

import { koda } from '@koda/core';

export const GET: RouteHandler = async (c) => {
  const { q, category, minPrice, maxPrice, page } = c.req.query();
  
  const results = await koda.search('products', {
    query: q,
    filters: {
      category: category,
      price: { $gte: minPrice, $lte: maxPrice },
    },
    sort: ['price:asc'],
    page: parseInt(page) || 1,
    hitsPerPage: 20,
  });
  
  return c.json(results);
};
```

### Search UI Component

```koda
import @koda/ui;
import { useSearch } from "@koda/core/search";

Screen SearchPage {
  state query = "";
  state filters = { category: null, priceRange: [0, 1000] };
  
  const results = useSearch("products", query, filters);

  Row {
    // Filters sidebar
    Sidebar {
      SearchFilters {
        categories: categories;
        priceRange: filters.priceRange;
        onChange: (f) => filters = f;
      }
    }
    
    // Results
    Column {
      SearchInput {
        value: query;
        onChange: (v) => query = v;
        placeholder: "Search products...";
      }
      
      if (results.loading) {
        SearchSkeleton { count: 10 }
      } else {
        ResponsiveGrid {
          columns: 3;
          
          ForEach(results.hits, (product) => {
            ProductCard {
              product: product;
              highlight: results.highlights[product.id];
            }
          });
        }
        
        Pagination {
          page: results.page;
          totalPages: results.totalPages;
          onChange: (p) => results.goToPage(p);
        }
      }
    }
  }
}
```

---

## 📝 Forms & Validation

### Form Definition

```typescript
// lib/schemas/contact.ts

import { z } from 'zod';
import { createForm } from '@koda/core/forms';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.enum(['general', 'support', 'sales']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  attachments: z.array(z.file()).optional(),
});

export const contactForm = createForm(ContactSchema);
```

### Form Actions

```typescript
// routes/contact/+page.server.ts

import { contactForm } from '@/lib/schemas/contact';

export const actions = {
  default: async ({ request }) => {
    const result = await contactForm.validate(request);
    
    if (!result.success) {
      return { errors: result.errors };
    }
    
    await sendContactEmail(result.data);
    
    return { success: true };
  },
};
```

### Form UI in `.koda`

```koda
import @koda/ui;
import { useForm } from "@koda/core/forms";

Screen ContactPage {
  const form = useForm(contactForm);

  Form {
    action: "?/default";
    
    Field {
      name: "name";
      label: "Your Name";
      error: form.errors.name;
      
      Input {
        type: text;
        placeholder: "John Doe";
      }
    }
    
    Field {
      name: "email";
      label: "Email Address";
      error: form.errors.email;
      
      Input {
        type: email;
        placeholder: "john@example.com";
      }
    }
    
    Field {
      name: "subject";
      label: "Subject";
      
      Select {
        options: [
          { value: "general", label: "General Inquiry" },
          { value: "support", label: "Support" },
          { value: "sales", label: "Sales" },
        ];
      }
    }
    
    Field {
      name: "message";
      label: "Message";
      error: form.errors.message;
      
      Textarea {
        rows: 5;
        placeholder: "Your message...";
      }
    }
    
    Button {
      type: submit;
      loading: form.isSubmitting;
      
      "Send Message"
    }
  }
}
```

### Multi-Step Forms

```koda
import @koda/ui;
import { useMultiStepForm } from "@koda/core/forms";

Screen CheckoutFlow {
  const wizard = useMultiStepForm([
    { id: "shipping", title: "Shipping" },
    { id: "payment", title: "Payment" },
    { id: "review", title: "Review" },
  ]);

  Column {
    // Progress indicator
    StepIndicator {
      steps: wizard.steps;
      currentStep: wizard.currentStep;
    }
    
    // Step content
    Switch(wizard.currentStep) {
      case "shipping":
        ShippingForm { onNext: wizard.next }
      case "payment":
        PaymentForm { onNext: wizard.next, onBack: wizard.back }
      case "review":
        ReviewOrder { onSubmit: wizard.submit, onBack: wizard.back }
    }
  }
}
```

---

## 🔔 Notifications

### Push Notification Setup

```typescript
// koda.config.ts

export default defineConfig({
  notifications: {
    push: {
      provider: 'web-push', // or 'firebase', 'onesignal'
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
    },
    
    // In-app notifications
    inApp: {
      persist: true, // Store in database
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  },
});
```

### Sending Notifications

```typescript
// lib/notifications.ts

import { koda } from '@koda/core';

// Send push notification
await koda.notifications.push({
  userId: user.id,
  title: 'New message!',
  body: 'You have a new message from John',
  icon: '/icon.png',
  url: '/messages/123',
});

// Send in-app notification
await koda.notifications.create({
  userId: user.id,
  type: 'order_shipped',
  title: 'Your order has shipped!',
  data: { orderId: order.id, trackingUrl: order.trackingUrl },
});

// Bulk notifications
await koda.notifications.broadcast({
  topic: 'announcements',
  title: 'New Feature Released!',
  body: 'Check out our new dashboard...',
});
```

### Notification UI

```koda
import @koda/ui;
import { useNotifications } from "@koda/core/notifications";

Screen NotificationsPanel {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  Column {
    Row {
      justify: between;
      
      Text("Notifications", style: Styles.H2);
      
      if (unreadCount > 0) {
        Button("Mark all as read", variant: ghost, onClick: markAllAsRead);
      }
    }
    
    if (notifications.length === 0) {
      EmptyState {
        icon: Icons.Bell;
        title: "No notifications";
        description: "You're all caught up!";
      }
    } else {
      ForEach(notifications, (notif) => {
        NotificationItem {
          notification: notif;
          onRead: () => markAsRead(notif.id);
        }
      });
    }
  }
}
```

---

## 🏗️ Admin CRUD Scaffolding

### Generate Admin Module

```bash
# Generate complete CRUD for a model
koda generate admin users --model=User

# This creates:
# - routes/admin/users/+page.koda (list)
# - routes/admin/users/[id]/+page.koda (detail)
# - routes/admin/users/[id]/edit/+page.koda (edit form)
# - routes/admin/users/new/+page.koda (create form)
# - routes/api/admin/users/+server.ts (API endpoints)
```

### Admin Layout

```koda
// routes/admin/+layout.koda

import @koda/ui;
import { requireRole } from "@/lib/auth";

Layout AdminLayout {
  guard: requireRole("admin");

  Row {
    // Sidebar navigation
    AdminSidebar {
      items: [
        { href: "/admin", icon: Icons.Home, label: "Dashboard" },
        { href: "/admin/users", icon: Icons.Users, label: "Users" },
        { href: "/admin/products", icon: Icons.Package, label: "Products" },
        { href: "/admin/orders", icon: Icons.ShoppingCart, label: "Orders" },
        { href: "/admin/settings", icon: Icons.Settings, label: "Settings" },
      ];
    }
    
    // Main content
    Column {
      flex: 1;
      
      AdminHeader {}
      
      Main {
        padding: lg;
        
        Slot {}
      }
    }
  }
}
```

### Data Table Component

```koda
// routes/admin/users/+page.koda

import @koda/ui;
import { useDataTable } from "@koda/core/admin";

Screen UsersList {
  props: { data: users };
  
  const table = useDataTable(users, {
    columns: [
      { key: "name", label: "Name", sortable: true },
      { key: "email", label: "Email", sortable: true },
      { key: "role", label: "Role", filterable: true },
      { key: "createdAt", label: "Created", sortable: true, format: "date" },
      { key: "actions", label: "", render: (row) => ActionMenu({ row }) },
    ],
    searchable: ["name", "email"],
    selectable: true,
  });

  Column {
    PageHeader {
      title: "Users";
      actions: [
        Button("Export", icon: Icons.Download, onClick: table.export),
        Button("Add User", icon: Icons.Plus, href: "/admin/users/new"),
      ];
    }
    
    Card {
      DataTableToolbar {
        table: table;
        filters: [
          { key: "role", label: "Role", options: roles },
        ];
      }
      
      DataTable { table: table }
      
      DataTablePagination { table: table }
    }
    
    // Bulk actions
    if (table.selectedRows.length > 0) {
      BulkActionBar {
        selected: table.selectedRows.length;
        actions: [
          { label: "Delete", icon: Icons.Trash, onClick: table.bulkDelete },
          { label: "Export", icon: Icons.Download, onClick: table.bulkExport },
        ];
      }
    }
  }
}
```

---

## 📖 API Documentation (OpenAPI)

### Auto-Generate OpenAPI Spec

```typescript
// routes/api/+docs.ts

import { generateOpenAPI } from '@koda/core/openapi';

export const openapi = generateOpenAPI({
  info: {
    title: 'My App API',
    version: '1.0.0',
    description: 'API documentation for My App',
  },
  servers: [
    { url: 'https://api.myapp.com', description: 'Production' },
    { url: 'http://localhost:3000', description: 'Development' },
  ],
});
```

### Route Documentation

```typescript
// routes/api/users/+server.ts

import { koda, type RouteHandler } from '@koda/core';
import { z } from 'zod';

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users
 */
export const GET: RouteHandler = async (c) => {
  // ...
};

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created
 */
export const POST: RouteHandler = async (c) => {
  // ...
};
```

### Swagger UI

```bash
# Access API documentation at:
# Development: http://localhost:3000/api/docs
# Production: https://api.myapp.com/docs
```

---

## 🗃️ Database Migrations & Seeding

### Migration Commands

```bash
# Generate migration from schema changes
koda db generate

# Apply migrations
koda db migrate

# Rollback last migration
koda db rollback

# Reset database (dangerous!)
koda db reset --force

# View migration status
koda db status
```

### Migration Files

```typescript
// migrations/001_create_users.ts

import { sql } from '@koda/core/db';

export async function up(db) {
  await db.run(sql`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await db.run(sql`
    CREATE INDEX idx_users_email ON users(email)
  `);
}

export async function down(db) {
  await db.run(sql`DROP TABLE users`);
}
```

### Database Seeding

```typescript
// seeds/users.ts

import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { faker } from '@faker-js/faker';

export async function seed() {
  // Admin user
  await db.insert(users).values({
    email: 'admin@example.com',
    name: 'Admin User',
    passwordHash: await hashPassword('admin123'),
    role: 'admin',
  });
  
  // Generate fake users
  const fakeUsers = Array.from({ length: 100 }, () => ({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    passwordHash: await hashPassword('password'),
    role: 'user',
  }));
  
  await db.insert(users).values(fakeUsers);
}
```

```bash
# Run seeders
koda db seed

# Seed specific file
koda db seed --only=users
```

---

## 🎌 Feature Flags & A/B Testing

### Feature Flag Configuration

```typescript
// koda.config.ts

export default defineConfig({
  features: {
    provider: 'koda', // or 'launchdarkly', 'flagsmith', 'unleash'
    
    // Static flags
    flags: {
      newDashboard: {
        enabled: process.env.NODE_ENV === 'development',
      },
      darkMode: {
        enabled: true,
        percentage: 50, // 50% of users
      },
    },
  },
});
```

### Using Feature Flags

```typescript
// Server-side
import { koda } from '@koda/core';

export const load: PageServerLoad = async ({ locals }) => {
  const showNewDashboard = await koda.features.isEnabled('newDashboard', {
    userId: locals.user?.id,
  });
  
  return {
    showNewDashboard,
  };
};
```

```koda
// Client-side
import @koda/ui;
import { useFeature } from "@koda/core/features";

Screen Dashboard {
  const showNewDashboard = useFeature("newDashboard");

  if (showNewDashboard) {
    NewDashboard {}
  } else {
    LegacyDashboard {}
  }
}
```

### A/B Testing

```typescript
// lib/experiments.ts

import { defineExperiment } from '@koda/core/experiments';

export const pricingExperiment = defineExperiment({
  name: 'pricing-page-v2',
  variants: [
    { id: 'control', weight: 50 },
    { id: 'variant-a', weight: 25 },
    { id: 'variant-b', weight: 25 },
  ],
  
  // Track conversion events
  goals: ['signup', 'purchase'],
});
```

---

## 📋 Structured Logging

### Logger Configuration

```typescript
// koda.config.ts

export default defineConfig({
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    
    // JSON format for production
    format: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
    
    // Log destinations
    transports: [
      { type: 'console' },
      { type: 'file', path: './logs/app.log' },
      { type: 'loki', url: process.env.LOKI_URL }, // Grafana Loki
    ],
    
    // Sensitive data redaction
    redact: ['password', 'token', 'apiKey', 'creditCard'],
  },
});
```

### Using the Logger

```typescript
import { koda } from '@koda/core';

// Structured logging
koda.log.info('User signed up', {
  userId: user.id,
  email: user.email,
  source: 'google',
});

koda.log.warn('Rate limit approaching', {
  ip: request.ip,
  endpoint: '/api/users',
  remaining: 10,
});

koda.log.error('Payment failed', {
  orderId: order.id,
  error: error.message,
  stack: error.stack,
});

// Request-scoped logging (automatic correlation ID)
export const handler: RouteHandler = async (c) => {
  c.log.info('Processing request'); // Includes requestId automatically
};
```

---

## 🚀 CI/CD & Preview Deployments

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml

name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      
      - run: bun install
      - run: bun run lint
      - run: bun run test
      - run: bun run build
      
  preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      
      - run: bun install && bun run build
      - run: bun x koda deploy --preview
        env:
          KODA_TOKEN: ${{ secrets.KODA_TOKEN }}
      
      - name: Comment preview URL
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview deployed to: ${{ steps.deploy.outputs.url }}'
            })
  
  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      
      - run: bun install && bun run build
      - run: bun x koda deploy --prod
        env:
          KODA_TOKEN: ${{ secrets.KODA_TOKEN }}
```

### Koda Deploy Configuration

```typescript
// koda.config.ts

export default defineConfig({
  deploy: {
    // Auto-detect platform
    platform: 'auto', // or 'vercel', 'cloudflare', 'fly', 'railway'
    
    // Preview deployments
    preview: {
      enabled: true,
      expiresIn: '7d',
    },
    
    // Production settings
    production: {
      region: 'auto', // or 'us-east', 'eu-west', etc.
      minInstances: 1,
      maxInstances: 10,
      
      // Environment-specific overrides
      env: {
        DATABASE_URL: { from: 'secret', key: 'DATABASE_URL' },
      },
    },
  },
});
```

---

## 📦 Monorepo Support

### Turborepo Integration

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

### Workspaces Structure

```
apps/
├── web/              # Main web app (Koda)
├── docs/             # Documentation site (Koda)
└── admin/            # Admin dashboard (Koda)

packages/
├── ui/               # Shared UI components
├── db/               # Database schemas & client
├── auth/             # Authentication logic
├── email/            # Email templates
└── config/           # Shared configurations
```

### Shared Packages

```typescript
// packages/ui/package.json
{
  "name": "@myapp/ui",
  "exports": {
    ".": "./src/index.ts",
    "./button": "./src/button.tsx",
    "./card": "./src/card.tsx"
  }
}
```

```koda
// apps/web/routes/+page.koda

import @koda/ui;
import { Button, Card } from "@myapp/ui";

Screen Home {
  Card {
    title: "Welcome";
    
    Button { "Get Started" }
  }
}
```

---

## 🔌 CLI Plugin System

### Creating a Plugin

```typescript
// plugins/my-plugin/index.ts

import { definePlugin } from '@koda/core/plugin';

export default definePlugin({
  name: 'my-plugin',
  version: '1.0.0',
  
  // CLI commands
  commands: [
    {
      name: 'my-command',
      description: 'Does something cool',
      options: [
        { name: '--verbose', type: 'boolean' },
      ],
      async handler(options) {
        console.log('Running my command!');
      },
    },
  ],
  
  // Vite plugins
  vitePlugins: [
    myVitePlugin(),
  ],
  
  // Middleware
  middleware: [
    myMiddleware(),
  ],
  
  // Hooks
  hooks: {
    'build:before': async () => {
      console.log('Before build...');
    },
    'deploy:after': async ({ url }) => {
      console.log(`Deployed to ${url}`);
    },
  },
});
```

### Using Plugins

```typescript
// koda.config.ts

import myPlugin from './plugins/my-plugin';
import analyticsPlugin from '@koda/plugin-analytics';
import seoPlugin from '@koda/plugin-seo';

export default defineConfig({
  plugins: [
    myPlugin(),
    analyticsPlugin({ provider: 'plausible' }),
    seoPlugin({ generateSitemap: true }),
  ],
});
```

---

## 🛠️ Development Tools

### Dev Server Features

```typescript
// koda.config.ts

export default defineConfig({
  dev: {
    port: 3000,
    host: '0.0.0.0',
    
    // Hot Module Replacement
    hmr: true,
    
    // Open browser on start
    open: true,
    
    // HTTPS for local development
    https: {
      key: './certs/localhost-key.pem',
      cert: './certs/localhost.pem',
    },
    
    // Proxy external APIs
    proxy: {
      '/external-api': {
        target: 'https://api.external.com',
        changeOrigin: true,
      },
    },
    
    // Mock API responses
    mock: {
      enabled: true,
      delay: 200, // Simulate network latency
      routes: './mocks',
    },
  },
});
```

### Developer Experience

```bash
# Interactive CLI
koda

# Project health check
koda doctor

# Dependency analysis
koda deps --analyze

# Performance audit
koda lighthouse

# Type checking in watch mode
koda typecheck --watch

# Generate types from database
koda db generate-types

# Update dependencies safely
koda update --interactive
```

### VS Code Extension (Coming Soon)

- Syntax highlighting for `.koda` files
- IntelliSense for Koda components
- Go to definition
- Error diagnostics
- Snippets
- Debug configuration

---

<div align="center">

## 🎯 Summary: The Complete Developer Journey

| Phase | Koda Provides |
|-------|---------------|
| **Ideation** | CLI scaffolding, project templates |
| **Development** | Hot reload, TypeScript, DX tools |
| **UI/UX** | Zenith primitives, `.koda` DSL, multi-engine |
| **Backend** | Type-safe API, middleware, security |
| **Database** | Migrations, seeding, ORM integration |
| **Auth** | Session, JWT, OAuth, RBAC |
| **Storage** | File uploads, S3/R2, image optimization |
| **Real-time** | WebSocket, SSE, pub/sub |
| **Background** | Job queues, scheduled tasks |
| **Email** | Templates, transactional, bulk |
| **Payments** | Stripe, subscriptions, webhooks |
| **Search** | Full-text, filtering, facets |
| **Analytics** | Events, metrics, monitoring |
| **Performance** | Caching, CDN, code splitting |
| **PWA** | Offline, push notifications |
| **Testing** | Unit, integration, E2E |
| **CI/CD** | Preview deploys, zero-downtime |
| **Production** | Multi-region, auto-scaling |
| **Observability** | Logging, tracing, errors |

---

**"From `koda init` to production in minutes, not months."**

**"The synthesis of everything great in modern web development."**

This is Koda. This is the future.

Built with 💎 by the Zenith Synthesis Team

</div>
