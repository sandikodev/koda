## ⚙️ Configuration

### `koda.config.ts`

```typescript
import { defineConfig } from '@koda/core';

export default defineConfig({
  // Orchestrated by @koda/core
  runtime: 'auto', // 'bun' | 'deno' | 'edge' | 'auto'
  
  // Handled by @koda/ui
  engines: {
    default: 'zenith', // .koda files
    react: { hydration: 'full' },
    svelte: { hydration: 'compiled' },
    qwik: { hydration: 'resumable' },
  },
  
  // Orchestrated by @koda/core (Security Layer)
  security: {
    rateLimit: { windowMs: 60_000, limit: 100 },
    csp: { defaultSrc: ["'self'"] },
    sanitize: true,
  },
  
  // Powering @koda/content
  content: {
    collections: ['blog', 'docs'],
    mdx: { remarkPlugins: [], rehypePlugins: [] },
  },

  // Managed by @koda/dx
  dx: {
    forensics: true,
    ideLink: 'vscode://file/{file}:{line}:{column}',
  },
  
  // Centality from @koda/core (SEO Engine)
  seo: {
    siteName: 'My Koda App',
    defaultImage: '/og-image.png',
    title: { template: '%s | Koda App' },
  },
});
```

---
