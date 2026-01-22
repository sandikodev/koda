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

import { koda } from '@koda/server';

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

import { koda } from '@koda/server';

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
import { lazy } from "@koda/ui";

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

import { precacheAndRoute, cleanupOutdatedCaches } from '@koda/sw';

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

import { koda } from '@koda/server';

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
import { useSearch } from "@koda/ui";

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
import { createForm } from '@koda/ui';

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
import { useForm } from "@koda/ui";

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
import { useMultiStepForm } from "@koda/ui";

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

import { koda } from '@koda/server';

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
import { useNotifications } from "@koda/ui";

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
import { useDataTable } from "@koda/ui";

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

import { generateOpenAPI } from '@koda/openapi';

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

import { koda, type RouteHandler } from '@koda/server';
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
