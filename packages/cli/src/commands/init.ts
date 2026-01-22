import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Koda CLI: Init Command 🚀
 * Part of Phase 7: Koda CLI (Scaffolding Engine)
 * Synchronizes the Zenith vision into a new project structure.
 */

export const initCommand = async (targetPath: string, force: boolean = false) => {
    const absolutePath = path.resolve(targetPath);
    console.log(`🛰️ Initializing Stage Zenith project at: ${absolutePath}`);

    try {
        await mkdir(absolutePath, { recursive: true });

        // 1. Create Basic Structure
        const dirs = ["src", "src/server", "src/client", "public"];
        for (const dir of dirs) {
            await mkdir(path.join(absolutePath, dir), { recursive: true });
        }

        // 2. Create package.json
        const packageJson = {
            name: path.basename(absolutePath),
            version: "0.1.0",
            private: true,
            type: "module",
            scripts: {
                dev: "bun run src/server/index.ts",
                build: "koda build", // Phase 7 extension
                start: "bun run dist/server/index.js",
            },
            dependencies: {
                "@koda/core": "latest",
                "@koda/server": "latest",
                "hono": "^4.11.4",
            }
        };

        await writeFile(
            path.join(absolutePath, "package.json"),
            JSON.stringify(packageJson, null, 2)
        );

        // 3. Create Basic Server
        // Note: Using @koda/server factory in next iteration
        const serverIndex = `import { koda } from "@koda/server";

const app = koda();

app.get("/api/health", (c) => c.json({ status: "zenith", message: "Koda Engine Operational" }));

console.log("🚀 Zenith Synthesis active on http://localhost:3000");

export default {
  port: 3000,
  fetch: app.fetch,
};
`;

        await writeFile(path.join(absolutePath, "src/server", "index.ts"), serverIndex);

        // 4. Create README.md
        const readme = `# Zenith Synthesis Project 💎

Built with **Koda**, the universal zenith metaframework.

## 🚀 Commands
- \`bun dev\`: Start the development engine.
- \`koda audit\`: Run cybersecurity hardening (Phase 8).

---
> "Institutional Intelligence meets Creative Innovation."
`;

        await writeFile(path.join(absolutePath, "README.md"), readme);

        console.log(`✅ Project successfully synthesized at ${absolutePath}`);
        console.log(`\nNext steps:`);
        console.log(`  cd ${targetPath}`);
        console.log(`  bun install`);
        console.log(`  bun dev`);

    } catch (error) {
        console.error(`❌ Synthesis failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
};
