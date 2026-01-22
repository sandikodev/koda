import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Koda CLI: Audit Command 🛡️
 * Part of Phase 8: Cybersecurity & Pentesting Engine
 * Performs native hardening checks to ensure the "Fortress Principle".
 * ทุก detail Zenith tetap aman.
 */

export const auditCommand = async (projectPath: string) => {
    const absolutePath = path.resolve(projectPath);
    console.log(`🛡️  Starting Koda Security Audit at: ${absolutePath}\n`);

    const results = {
        pass: [] as string[],
        fail: [] as string[],
        warn: [] as string[],
    };

    const check = (name: string, passed: boolean, message: string, level: 'pass' | 'fail' | 'warn' = 'fail') => {
        if (passed) {
            results.pass.push(`✅ [PASS] ${name}: ${message}`);
        } else {
            if (level === 'fail') {
                results.fail.push(`❌ [FAIL] ${name}: ${message}`);
            } else {
                results.warn.push(`⚠️ [WARN] ${name}: ${message}`);
            }
        }
    };

    try {
        // 1. Check for .gitignore presence and .env exclusion
        const gitignorePath = path.join(absolutePath, ".gitignore");
        try {
            const gitignore = await readFile(gitignorePath, "utf-8");
            check("Git Hygiene", gitignore.includes(".env"), ".env is correctly ignored in .gitignore.");
        } catch {
            check("Git Hygiene", false, ".gitignore file not found. High risk of leaking secrets.");
        }

        // 2. Check for koda.security() usage in server
        const serverPath = path.join(absolutePath, "src/server/index.ts");
        try {
            const serverCode = await readFile(serverPath, "utf-8");
            check("Fortress Primitives", serverCode.includes("koda.security("), "koda.security() is active in the main server.");
            check("Rate Limiting", serverCode.includes("rateLimit:"), "Intelligent Rate Limiting is configured.", 'warn');
            check("Content Security Policy", serverCode.includes("csp:"), "Content Security Policy (CSP) is defined.", 'warn');
        } catch {
            check("Fortress Primitives", false, "Main server file not found at src/server/index.ts", 'warn');
        }

        // 3. Dependency Audit (Basic)
        const packageJsonPath = path.join(absolutePath, "package.json");
        try {
            const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));
            const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

            check("Dependency Hardening", !deps["express"], "No legacy Node components detected (Agnostic Zenith ensured).");
            check("Runtime Efficiency", !!deps["hono"], "Hono engine detected (High-performance baseline).");
        } catch {
            check("Package Integrity", false, "package.json not found.");
        }

        // Print Results
        console.log("--- Audit Results ---");
        results.pass.forEach(r => console.log(r));
        results.warn.forEach(r => console.log(r));
        results.fail.forEach(r => console.log(r));

        console.log("\n--- Synthesis ---");
        if (results.fail.length === 0) {
            console.log("🛡️  Project state: HARDENED. The Stage Zenith vision is secure.");
        } else {
            console.log(`🛡️  Project state: VULNERABLE. ${results.fail.length} critical issues detected.`);
            console.log("Action required: Align with the Fortress Principle to ensure institutional-grade safety.");
        }

    } catch (error) {
        console.error(`❌ Audit failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
};
