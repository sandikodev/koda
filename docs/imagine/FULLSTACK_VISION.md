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

<div align="center">

**"The synthesis of everything great in modern web development."**

This is Koda. This is the future.

</div>
