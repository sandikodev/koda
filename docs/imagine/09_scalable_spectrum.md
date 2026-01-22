## 🚀 The Scalable Spectrum: Functional vs. Enterprise

Koda recognizes that not every app needs to be a fortress. But when it does, the capability is built-in.

### Mode 1: Functional Zenith (Default)
**"The Speed of Now."**

Like **SvelteKit** or **Next.js**, the default mode is purely functional. Handlers are simple functions. State is atomic. It is optimized for **Zero-Overhead** and massive developer velocity.

```typescript
// routes/api/users.ts (Functional Mode)
export const GET = async (c) => c.json(await db.select().from(users));
```

### Mode 2: Institutional Enterprise (Optional)
**"The Rigor of Forever."**

Like **Laravel** or **Spring**, this mode is for teams that need **Service Containers, Dependency Injection (DI), and Strict Contracts**. Koda allows you to bring this rigor to the Edge without bloating the runtime.

#### The Service Container
Koda provides a lightweight DI container that works across Bun and Edge runtimes.

```typescript
// lib/services/UserService.ts
import { Service, Inject } from '@koda/server/di';

@Service()
export class UserService implements IUserService {
  constructor(
    @Inject('Repo') private repo: UserRepository,
    @Inject('Logger') private logger: Logger
  ) {}

  async findActive() {
    this.logger.info('Fetching active users');
    return this.repo.find({ status: 'active' });
  }
}
```

#### The Controller Pattern
You can swap functional routes for Class-based Controllers if your organization prefers strict routing contracts.

```typescript
// routes/api/users/+controller.ts
import { Controller, Get, UseGuard } from '@koda/server/mvc';

@Controller('/api/users')
export class UserController {
  @Get('/')
  @UseGuard(AuthGuard)
  async list(@Inject() users: UserService) {
    return users.findActive();
  }
}
```

> **Why this matters**: Enterprise teams often avoid modern JS frameworks because they miss the structure of Java/PHP. Koda invites them to the modern web without forcing them to abandon their architectural discipline.

---

---

## 🌟 The Fullstack Anatomy: A Real-World Feature

To visualize how Koda's "Dual Personality" and "Modular Ecosystem" come together, let's look at a vertical slice of a **Merchant Analytics** feature.

### 1. The Persistence Layer (`@koda/db`)
First, we define the schema. Koda uses Drizzle-style definitions but optimized for the Edge.

```typescript
// db/schema/analytics.ts
import { sqliteTable, text, integer } from '@koda/db';

export const dailyMetrics = sqliteTable('daily_metrics', {
  id: text('id').primaryKey(),
  merchantId: text('merchant_id').notNull(),
  revenue: integer('revenue'),
  date: text('date'),
});
```

### 2. The Logic Layer (`@koda/server` - Enterprise Mode)
We use the **Service Container** to encapsulate complex business logic, keeping our routes clean.

```typescript
// lib/services/AnalyticsService.ts
import { Service, Inject } from '@koda/server/di';
import { koda } from '@koda/server';

@Service()
export class AnalyticsService {
  constructor(@Inject('DB') private db: Database) {}

  async getMerchantPerformance(id: string) {
    // Forensic logging built-in
    koda.log.info('Calculating metrics', { merchantId: id });
    
    return this.db.query.dailyMetrics.findMany({
      where: (t, { eq }) => eq(t.merchantId, id)
    });
  }
}
```

### 3. The Gateway Layer (`proxy.ts` & Routes)
The **Proxy** ensures security, while the **Controller** handles the request dispatch.

```typescript
// routes/api/analytics/+controller.ts
import { Controller, Get, UseGuard } from '@koda/server/mvc';

@Controller('/api/analytics')
export class AnalyticsController {
  @Get('/:merchantId')
  @UseGuard(MerchantOwnerGuard)
  async getStats(ctx, @Inject() service: AnalyticsService) {
    const data = await service.getMerchantPerformance(ctx.params.merchantId);
    return ctx.json({ data, meta: { served_by: 'Koda Edge' } });
  }
}
```

### 4. The Experience Layer (`@koda/ui` & `.koda`)
Finally, the **Zenith DSL** consumes the data. Note how it mixes declarative UI with powerful hooks.

```koda
// routes/dashboard/+page.koda
import @koda/ui;
import { useQuery } from '@koda/ui';

Screen MerchantDashboard {
  // Client-side data fetching from our API
  const { data: stats } = useQuery(['analytics'], () => 
    fetch('/api/analytics/me').then(r => r.json())
  );

  Layout.Bento {
    // Loading states handled automatically by Zenith
    when (stats.isLoading) {
      Skeleton { height: "200px"; span: 3; }
    }

    GradientCard {
      title: "Today's Revenue";
      // Formatted data injection
      content: Text(stats.revenue, style: Styles.H1);
      variant: primary;
    }

    Chart {
      data: stats.history;
      type: "area";
    }
  }
}
```

> **The Insight**: Notice how the code flows from the structured backend (Enterprise) to the declarative frontend (Zenith). Koda handles the "Hard Stuff" (DI, Security, DB) so you can focus on the "Beautiful Stuff" (UI, Charts, Experience).

---

