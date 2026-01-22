## 🏛️ The "Standard Chassis" Philosophy

### Architecture vs. Design

Koda operates on the principle of **Standard Chassis vs. Creative Paint**:

1.  **The Chassis (`@koda/core`)**: The invisible, rigid infrastructure. Security, Routing, SEO, Data Loading, and Diagnostics. This is non-negotiable and provides institutional stability.
2.  **The Paint & Focus (`@koda/ui`)**: The primary interface for the application developer. It orchestrates the visual layer (Bento, ZenithStage), the `.koda` DSL, and all frontend-focused hooks (State, Forms, Search, etc.).

### Extending the Chassis

```typescript
// lib/chassis/custom.ts

import { defineChassisExtension } from '@koda/core';

// This becomes part of the shared institutional infrastructure
export default defineChassisExtension({
  name: 'audit-logger',
  
  onBoot(koda) {
    koda.hook('request:after', async (c) => {
      await db.insert(auditLogs).values({ ... });
    });
  },
});
```

---

---

## 🎨 Design Token Orchestration

### Semantic Theme Definition

```typescript
// koda.config.ts

export default defineConfig({
  ui: {
    theme: {
      tokens: {
        colors: {
          zenith: {
            primary: '#4F46E5',
            secondary: '#7C3AED',
            accent: '#F43F5E',
            surface: '#0F172A',
          }
        },
        spacing: {
          bento: '1.5rem',
        }
      },
      // Automatic dark mode orchestration
      darkMode: 'class',
    }
  }
});
```

### Usage in Custom Styles

```typescript
// lib/styles.ts

import { tokens } from '@koda/ui';

export const Styles = {
  H1: tokens.text('4xl', 'bold', 'zenith.primary'),
  Card: tokens.container('rounded-xl', 'bg-surface', 'border-zenith-secondary'),
};
```

---

## ♿ Accessibility (A11y) & Inclusive Design

### Built-in A11y Standards

```koda
import @koda/ui;

Screen AccessiblePage {
  // Zenith UI primitives are ARIA-aware by default
  Modal {
    title: "Settings";
    role: "dialog";
    ariaLabel: "Application Settings";
    
    content: Column {
      Text("Focus is automatically trapped here", style: Styles.Body);
      
      // High-contrast awareness
      Button("Save Changes", variant: primary);
    }
  }
}
```

### A11y Auditing

```bash
# Run accessibility audit
koda audit --a11y

# Output:
# [PASS] ScreenReader: All images have alt text
# [PASS] Contrast: Color ratios meet WCAG AA standards
# [WARN] Keyboard: 1 custom component missing aria-label
```

---

## ⚡ Edge-Native Lifecycle

### The Distributed Request Flow

1.  **Global Routing**: Request hits the nearest PoP (Point of Presence).
2.  **Environment Sync**: Koda automatically synchronizes `locals`, `env`, and `session`.
3.  **Agnostic Dispatch**: The logic runs on **Bun/Deno/Edge** without modification.
4.  **Streaming Hydration**: HTML is streamed to the browser as it's rendered.

```typescript
// Any middleware/handler is edge-native
export const middleware = async (c, next) => {
  const region = c.req.header('x-edge-region');
  c.set('isNearUser', true);
  await next();
};
```

---

---
