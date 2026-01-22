# Koda Syntax Specification (.koda) 💎

**Vision:** A declarative, type-safe, and concise syntax for building Koda user interfaces, inspired by Flutter/Dart and SwiftUI. It prioritizes ergonomics and readability over web-standard boilerplate.

## Core Concepts
1.  **Widgets as First-Class Citizens:** Everything is a Widget.
2.  **Property-First:** Props are defined cleanly without JSX noise.
3.  **Built-in Reactivity:** State binding is implicit or minimal syntax.

## Syntax Preview

```koda
// dashboard.koda

import @koda/ui;
import @modules/finance;

Screen Dashboard {
  state activeTab = "overview";
  
  Layout.Bento {
    columns: 3;
    gap: md;

    // Direct Prop Usage (No {})
    Card {
      title: "Revenue";
      icon: Icons.Wallet;
      variant: primary;
      
      content: Text(
        value: finance.revenue,
        style: Styles.H1
      );
    }

    Card {
      title: "Active Users";
      content: List(data: users.active);
    }
  }
}
```

## Implementation Strategy (Phase 13)
1.  **Vite Plugin (`vite-plugin-koda`)**: Tranforms `.koda` files into `.tsx` on the fly.
2.  **Koda Language Server**: Provides IntelliSense for `.koda` files.
3.  **Standard Library**: A set of base widgets mapping to HTML/React primitives.

## Why this works?
- **Reduces Bloat**: Removes `<div>`, `className`, `import React` noise.
- **Enforces Structure**: Impossible to write "spaghetti JSX" if the syntax restricts it.
- **Brand Agnostic**: The styling happens in the `Theme` provider, the `.koda` file only defines structure.

---

# Architecture Update: @koda/ui

We will split the repository to:
- `packages/koda-core`: The Engine (Hono, Server, CLI, RPC).
- `packages/koda-ui`: The Chassis (Headless Components, Layout Primitives, The .koda Runtime).

Applications will import from `@koda/ui` and apply its own "CustomTheme".
