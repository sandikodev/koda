# 🎨 Zenith UI Vision: The Declarative Future

> *"HTML is for documents. JSX is for logic. Zenith is for **Architecture**."*

Zenith (`@koda/ui`) is Koda's proprietary UI Engine. It is not just a component library; it is a **Domain Specific Language (DSL)** designed to solve the chaos of modern frontend development: "Div Soup", "Class Name Spaghetti", and "Framework Wars".

---

## 💎 The Three Pillars of Zenith

### 1. Structural Clarity (The DSL)
We borrowed the best ideas from **Flutter** and **SwiftUI**—typed, declarative layout primitives—and brought them to the Web.

**The Problem (JSX/HTML):**
```tsx
<div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg">
  <div className="flex justify-between">
    <h1 className="text-xl font-bold">Title</h1>
    <span>Subtitle</span>
  </div>
</div>
```

**The Zenith Solution (.koda):**
```koda
Column {
  padding: 4;
  gap: 4;
  background: Colors.Gray100;
  radius: lg;

  Row {
    justify: between;
    Text("Title", style: Styles.H1);
    Text("Subtitle", style: Styles.Caption);
  }
}
```
> **Insane Detail**: This does NOT compile to heavy JS. The Koda Compiler (`@koda/compiler`) statically extracts this into **Pure HTML + Atomic CSS** at build time. It has **Zero Runtime Overhead**.

### 2. The "Islands Bridge" (Framework Agnostic)
Zenith does not force you to abandon React, Svelte, or Vue. It acts as the **Orchestrator**. You build the *Skeleton* in Zenith, and mount the *Organs* (Interactive Components) in your framework of choice.

```koda
Screen Dashboard {
  // Zenith handles the heavy layout (0kb JS)
  Sidebar { ... }
  Header { ... }

  Main {
    // Koda mounts a React Island here
    ChartIsland {
      engine: "react";
      src: "@/components/RevenueChart";
      props: { data: serverData };
    }

    // Koda mounts a Svelte Island right next to it
    RealtimeTicker {
      engine: "svelte";
      src: "@/components/Ticker";
    }
  }
}
```

## ⚡ The Qwik Synergy: The Golden Ratio

While Koda supports React and Svelte, **Qwik** is Zenith's "Soulmate".

*   **Zenith** compiles Layouts to **0KB HTML/CSS**.
*   **Qwik** compiles Logic to **0KB Initial JS** (Resumable).

**The Combination**:
This is the only stack in existence that allows you to build a **Complex Enterprise Dashboard** that loads with **0KB of JavaScript** on the main thread, and *only* downloads the specific click-handler for the "Buy" button when the user's mouse hovers over it.

```koda
// A truly 0KB Initial Load Dashboard
Screen UltraFastDashboard {
  
  // Rendered as Pure HTML/CSS
  Sidebar { ... } 
  
  // Interactive, but 0KB JS on load.
  // The JS for 'onBuy' is lazy-loaded ONLY on hover/interaction.
  QwikIsland {
    engine: "qwik";
    src: "@/components/BuyButton";
    props: { id: "123" };
  }
}
```
> **The Insight**: React Islands require downloading the React Runtime + Component Code before *anything* is interactive. Qwik Islands require **Nothing**. They are interactive immediately via global event delegation.

### 3. Design Token Orchestration
In Zenith, Design Tokens are not just CSS variables. They are **Runtime Types**.

```typescript
// Your Design System Definition
const MyTheme = defineTheme({
  colors: {
    primary: '#0070f3',
    // ...
  },
  typography: {
    h1: { fontSize: '2rem', weight: 700 },
  }
});
```

If you try to use a color that doesn't exist (`Colors.Red500` when you only defined `Crimson`), the **Compiler Fails**. You maintain visual consistency by *law*.

---

## 🧘 Universal Reactivity: The Signal Bus

Zenith introduces a **Unified Signal Protocol** that creates a wormhole between frameworks.

```typescript
// lib/store.ts
import { signal } from '@koda/ui';

// A signal that lives outside of React/Svelte
export const counter = signal(0);
```

*   **In React**: `useSignal(counter)` -> Triggers Re-render.
*   **In Svelte**: `$counter` -> Triggers Reactivity.
*   **In Solid**: `counter()` -> Triggers Effect.
*   **In Zenith**: `Text(counter.value)` -> Updates Text Node directly (Fine-grained).

---

## 🎭 Animation & Interaction

Zenith uses a physics-based animation engine (`@koda/motion`) that is declarative.

```koda
Button {
  "Click Me";
  
  // Declarative Gestures
  whileHover: { scale: 1.05 };
  whileTap: { scale: 0.95 };
  
  // Layout Transitions (Magic Motion)
  layoutId: "btn-primary";
}
```

---

## 🧩 The Component Standard (Bento Primitives)

Zenith comes with **Bento**, a standard library of UI primitives optimized for the Edge.

| Primitive | Description | HTML Output |
| :--- | :--- | :--- |
| `Row` / `Column` | Flexbox layouts with standardized gaps | `<div style="display: flex...">` |
| `Stack` | Z-index layering | `<div style="display: grid; grid-area: 1/1...">` |
| `Grid` | CSS Grid with auto-placement | `<div style="display: grid...">` |
| `Text` | Typography enforcement | `<span class="typo-h1">` |
| `Spacer` | Flex grow/gap utility | `<div style="flex: 1">` |

---

## ♿ Accessibility First (A11y)

Zenith forces A11y. You literally *cannot* compile an Image without an alt tag.

```koda
//! COMPILER ERROR: Asset 'hero.jpg' is missing 'alt' description.
Image { src: "/hero.jpg" } 
```

It automatically handles ARIA roles for complex interactive elements.

---

## 🔮 Future: Generative UI
Because Zenith is a structured DSL, it is **perfect for AI**.
1.  **LLM Generation**: It is harder for an LLM to mess up `Column { Text("Hi") }` than nested `div` soup.
2.  **Streaming UI**: You can stream Zenith Nodes from the server, and the client renders them instantly via a lightweight interpreter.

_"The Frontend is no longer a graveyard of `<div>` tags. It is a structured, typed, and compiled architecture."_
