
## 📁 The Institutional Anatomy: Codebase Structure

This structure represents a **fully mature Koda application**, showing how Functional (Simple) and Enterprise (Complex) patterns coexist in the same codebase.

```bash
my-koda-app/
├── koda.config.ts             # ⚙️ The Institutional Manifesto (Config)
├── proxy.ts                   # 🛡️ The Gateway Proxy (Next.js 16 style)
├── package.json
│
├── content/                   # 📚 The Narrative Engine (CMS)
│   ├── blog/
│   │   ├── first-post.md      # Standard Markdown
│   │   └── second-post.mdx    # Interactive MDX
│   └── docs/
│       └── intro.md
│
├── routes/                    # 🛣️ The Routing Fabric (SvelteKit-style)
│   ├── +layout.koda          # 🎨 Root Institutional Layout
│   ├── +page.koda            # Landing Page (Zenith DSL)
│   ├── +page.server.ts       # Server-only Data Loader
│   │
│   ├── blog/
│   │   ├── +page.koda        # Blog Listing
│   │   └── [slug]/
│   │       ├── +page.koda    # Blog Detail
│   │       └── +page.server.ts
│   │
│   ├── app/                   # 🔒 Application Domain
│   │   ├── +layout.server.ts # Data Loaders (Functional)
│   │   ├── dashboard/
│   │   │   └── +page.tsx     # React Island (Interactive)
│   │   └── settings/
│   │       └── +page.svelte  # Svelte Island (Performance)
│   │
│   └── api/                   # ⚡ The Gateway Interface
│       ├── auth/
│       │   └── +server.ts    # Simple Functional Auth
│       ├── users/
│       │   ├── +server.ts    # Functional Route Handler
│       │   └── +controller.ts # 🏛️ Enterprise Controller (Optional)
│       └── webhooks/
│           └── +job.ts       # Background Job Definition
│
├── lib/                       # 🧠 The Business Core (Mixed Mode)
│   ├── db.ts                  # ⚡ Simple DB Client (for Functional Mode)
│   ├── auth.ts                # ⚡ Simple Auth Logic
│   ├── schemas.ts             # ⚡ Shared Zod Schemas
│   │
│   ├── services/              # 🏛️ Service Container (Enterprise Mode)
│   │   ├── AuthService.ts
│   │   └── BillingService.ts
│   ├── contracts/             # 📜 Interfaces & DTOs
│   │   └── IUserRepository.ts
│   ├── providers/             # 🔌 External Integrations
│   │   └── StripeProvider.ts
│   └── utils/                 # Pure Functions
│
├── db/                        # 💾 The Persistence Layer (@koda/db)
│   ├── schema/                # Drizzle-style Schema Definitions
│   │   ├── users.ts
│   │   └── audit.ts
│   ├── migrations/            # SQL Migration History
│   └── seed.ts                # Data Seeding Script
│
├── components/                # 🎨 The Design System (@koda/ui)
│   ├── ui/                    # 🎨 Project-Specific "Paint"
│   │   ├── Header.koda
│   │   └── Footer.koda
│   ├── tokens/                # 📏 Design Tokens (Colors, Typography)
│   ├── primitives/            # 🧱 Reusable Bento/Zenith Atoms
│   └── islands/               # 🏝️ Framework-specific Islands
│       ├── SearchBar.tsx
│       └── Chart.svelte
│
└── static/                    # 📁 Public Assets (Edge Cached)
    ├── favicon.ico
    ├── robots.txt
    └── images/
```

> **Insight**: Notice the harmony. You can start with simple `lib/db.ts` and `+server.ts` (Functional Mode), and gradually evolve to `lib/services/` and `+controller.ts` (Enterprise Mode) without changing your directory structure.

## 📦 The Zenith Ecosystem: Modular Responsibility

Koda is organized into specialized packages to ensure a strict **Separation of Concerns**. This modularity allows the framework to remain lightweight at runtime while providing institutional-grade power during development.

| Package | Responsibility | Role |
| :--- | :--- | :--- |
| **`@koda/core`** | The Kernel | Agnostic Foundation, Shared Types, Internal Contracts. |
| **`@koda/server`**| The Engine | Server Factory (`koda()`), SSR, Adapters (Bun/Edge). |
| **`@koda/ui`** | The Interface | `.koda` DSL, Primitives (Bento), Client Hooks, State. |
| **`@koda/cli`** | Automation | Scaffolding, `init`, `audit`, `evolve`, `generate`. |
| **`@koda/dx`** | Diagnostics | Forensic Brain, Error Layouts, Source-Code Parsing. |
| **`@koda/content`**| Orchestration | MDX Engine, Content Collections, Zod validation. |
| **`@koda/db`** | Persistence | Migrations, Seeding, SQL Orchestration. |
| **`@koda/jobs`** | Background | Job Queues, Workers, Cron Scheduling. |
| **`@koda/realtime`**| Connectivity | WebSockets, SSE, Pub/Sub. |
| **`@koda/payments`**| Monetization | Stripe Orchestration, Pricing Engine. |
| **`@koda/email`** | Communication | React Email, Transactional & Bulk Sending. |
| **`@koda/i18n`** | Localization | Type-safe translation & Locale detection. |
| **`@koda/sw`** | Offline | Service Worker & PWA Infrastructure. |
| **`@koda/plugins`**| Extensibility | CLI & Core Ecosystem Plugin System. |

---

