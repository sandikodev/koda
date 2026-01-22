# ⚙️ Agnostic Kernel Vision: The Universal Engine

> *"Write Once, Run Anywhere. Not as a slogan, but as a compilation target."*

The Koda Backend is split into two massive pillars: **The Kernel (`@koda/core`)** and **The Engine (`@koda/server`)**. This separation is what allows Koda to be agile enough for a Cloudflare Worker yet robust enough for a Banking Monolith.

---

## 🏗️ The Architecture: Kernel vs. Engine

### 1. The Kernel (`@koda/core`)
The **Agnostic Foundation**. This package contains **Zero Dependencies**. It defines the *Interfaces* and *contracts* that the ecosystem obeys.
*   **Role**: The "Constitution" of the framework.
*   **Contains**: `defineConfig`, `KodaError`, `Context` interfaces, `Container` types.
*   **Safe for**: Browser, Server, Edge, IoT.

### 2. The Engine (`@koda/server`)
The **Runtime Executioner**. This is where the metal meets the meat.
*   **Role**: The "Motor" that drives the app.
*   **Contains**: Server Factories, Adapter Logic, DI Container, Security Implementations.
*   **Safe for**: Bun, Node, Deno, Edge Workers.

---

## 🔌 The Universal Adapter Protocol (UAP)

Most frameworks bind you to `Node.js` APIs (`IncomingMessage`) or strictly `Web Standard` APIs. Koda uses a **Polymorphic Adapter Pattern**.

```typescript
// Internal Koda Implementation
interface ServerAdapter {
  createContext(rawRequest: any): KodaContext;
  sendResponse(response: KodaResponse): any;
}

// Bun Adapter
class BunAdapter implements ServerAdapter {
  createContext(req: Request) { ... } // Uses native Request
}

// Deno Adapter
class DenoAdapter implements ServerAdapter {
  createContext(req: Request) { ... } // Uses Deno.serve & Deno.env
}

// Node Adapter
class NodeAdapter implements ServerAdapter {
  createContext(req: IncomingMessage) { ... } // Converts Node stream to Web Stream
}
```
> **Result**: You write `ctx.req.json()`. Koda handles the translation to the underlying runtime instantly.

---

## 🏛️ The Institutional DI Container

This is the crown jewel of the Enterprise Mode. Koda implements a **Hierarchical Dependency Injection** system that works on the Edge (no heavy Reflection metadata).

### Scopes
1.  **Singleton (`@Singleton`)**: Created once at server boot. Shared across all requests. (DB Connections, Redis).
2.  **Request (`@Scoped`)**: Created fresh for every incoming HTTP request. Garbage collected after response. (User Session, Transaction Manager).
3.  **Transient (`@Transient`)**: Created every time it is injected.

### Zero-Overhead Injection
We avoid the massive performance cost of `reflect-metadata` by using **Type-Pass-Through Compilation**.

```typescript
// Your Code
@Service()
class UserService {
  constructor(private db: Database) {}
}

// Koda Compiler Output
class UserService {
  static __inject = ['Database'];
  constructor(db) { this.db = db; }
}
```
This runs at native speed on V8.

---

## 🛡️ The Security Fortress (Internals)

### 1. Sovereign Session Encryption
Koda does not trust cookies.
*   **Mechanism**: `AES-256-GCM`.
*   **Flow**:
    1.  User Data -> JSON Stringify.
    2.  Compress (Gzip) -> Reduce Payload Size.
    3.  Encrypt (Key Rotation Supported).
    4.  Sign (HMAC-SHA256).
    5.  Set Cookie `__koda_session`.

### 2. Proxy-Based PII Redaction
How does the logging redaction work? We wrap your objects in a **recursive Proxy trap**.

```typescript
const safeLog = new Proxy(data, {
  get(target, prop) {
    if (SENSITIVE_KEYS.includes(prop)) return "[REDACTED]";
    return Reflect.get(target, prop);
  }
});
```
This ensures that *even if you mistakenly log the entire User object*, the password hash is never printed to stdout.

---

## ✈️ The Flight Recorder (Forensic Core)

The "Black Box" feature leverages **Universal AsyncLocalStorage** (supported by Node, Bun, and Deno) to maintain a context trace throughout the request lifecycle, even across async/await boundaries.

1.  **Request Start**: `ALS.enterWith({ traceId, sqlLogs: [], events: [] })`.
2.  **DB Query**: The DB client pushes the query + duration into the current ALS store.
3.  **Error Thrown**: The Exception Handler pulls the *entire* ALS store.
4.  **Serialization**: The context is serialized into a portable JSON blob (The "Black Box").

---

## 🌐 The Edge-Mesh Capabilities

### 1. Durable Object Coordination
When deploying to Cloudflare, `@koda/server` can automatically promote a `WebSocket` handler into a **Durable Object** to enable stateful realtime connections without you rewriting code.

### 2. Region-Aware Routing
The Engine utilizes `req.cf.colo` (or equivalent) to inject `ctx.region`.
*   **Middleware**: Can deny requests from sanctioned countries at the edge.
*   **Data**: Can route read queries to the nearest read-replica DB.

_"Koda is Agnostic not because it doesn't care about the platform, but because it masters them all."_
