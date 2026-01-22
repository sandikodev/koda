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

import type { PageServerLoad } from '@koda/server';
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

import { koda, type RouteHandler } from '@koda/server';

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

### 🧠 Deep Dive: The Universal Signal Bus

How do React and Svelte talk to each other? Koda provides a **Universal Signal Bus** (`@koda/ui/signals`) that bridges the framework gap without React Context providers or Svelte Stores.

```typescript
// lib/store.ts
import { signal } from '@koda/ui';

// A universal signal that works in ANY framework
export const searchOpen = signal(false);
```

**In React (`SearchBar.tsx`):**
```tsx
import { useSignal } from '@koda/ui/react';
import { searchOpen } from '@/lib/store';

export function SearchBar() {
  const isOpen = useSignal(searchOpen); // React reactivity
  return <button onClick={() => searchOpen.value = !isOpen}>Toggle</button>;
}
```

**In Svelte (`Overlay.svelte`):**
```svelte
<script>
  import { searchOpen } from '@/lib/store';
</script>

{#if $searchOpen} <!-- Svelte reactivity -->
  <div class="overlay">Search is Active!</div>
{/if}
```

> **The Insight**: Koda's Signal Bus abstracts the *implementation details* of reactivity. React sees a Hook, Svelte sees a Store, Vue sees a Ref. They all share the same memory address.

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
