## 📦 Content Collections (Astro-style)

### Defining Collections

```typescript
// content/config.ts

import { defineCollection, z } from '@koda/content';

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

import { getCollection } from '@koda/content';

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
import { t } from "@koda/i18n";

Screen About {
  Text(t("about.title"), style: Styles.H1);
  Text(t("about.description"), style: Styles.Body);
}
---

## 🧠 State Management

### Client State (Zustand-like)

```typescript
// lib/stores/cart.ts

import { createStore } from '@koda/ui';

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

import { createQuery, createMutation } from '@koda/ui';

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

import { koda } from '@koda/server';

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

import { koda, type WebSocketHandler } from '@koda/server';

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

import { koda, type RouteHandler } from '@koda/server';

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
import { useWebSocket, useSSE } from "@koda/ui";

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

import { koda, type RouteHandler } from '@koda/server';

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
import { useUpload } from "@koda/ui";

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

import { defineJob } from '@koda/jobs';

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

import { defineCron } from '@koda/jobs';

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

import { Email, Section, Text, Button } from '@koda/email';

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
import { koda } from '@koda/server';
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

import { createPaymentProvider } from '@koda/payments';

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
import { useSubscription } from "@koda/ui";

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
