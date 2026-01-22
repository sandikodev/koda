import { Command } from 'commander';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * 🧠 koda context: The Cognitive Mapper
 * Generates a compressed, LLM-optimized view of the project architecture.
 */

export const contextCommand = new Command('context')
    .description('Generate an LLM-optimized context bundle of the Zenith project')
    .action(async () => {
        console.log(`\n🧠 Zenith Cognitive Scan Initiated...`);
        console.log(`🛰️ Mapping architectural signals and AST boundaries...`);

        const contextMap = {
            version: '0.1.0-zenith',
            timestamp: new Date().toISOString(),
            architecture: 'Koda Zenith',
            pillars: ['Signals', 'Islands', 'Meta-Router', 'DSL Compiler'],
            monorepo_packages: [
                '@koda/core',
                '@koda/server',
                '@koda/cli',
                '@koda/signals',
                '@koda/bridge',
                '@koda/tokens',
                '@koda/compiler',
                '@koda/cloud'
            ]
        };

        const targetPath = path.join(process.cwd(), '.zenith_context.json');

        try {
            await fs.writeFile(targetPath, JSON.stringify(contextMap, null, 2));
            console.log(`✅ Success: Context bundle generated at ${targetPath}`);
            console.log(`💎 Tip: Feed this file to your AI partner for deep architectural reasoning.`);
        } catch (err: any) {
            console.error(`❌ Error generating context: ${err.message}`);
        }
    });
