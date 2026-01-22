#!/usr/bin/env bun
import * as p from 'clack-prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * 🛰️ create-koda-app: Zenith Project Bootstrapper
 * The main entry point for npx create-koda-app.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
    console.clear();
    p.intro(`${pc.bgMagenta(pc.black(' KODA ZENITH '))} ${pc.dim('The Sovereign Metaframework')}`);

    const project = await p.group(
        {
            path: () => p.text({
                message: 'Where should we build your future?',
                placeholder: './my-zenith-app',
                validate: (value) => {
                    if (!value) return 'Path is required';
                    if (value === '.') return;
                }
            }),
            template: () => p.select({
                message: 'Choose your Zenith engine template:',
                options: [
                    { value: 'basic', label: 'Basic (Core Only)', hint: 'Ultra-lean, no DSL' },
                    { value: 'zenith', label: 'Zenith (Full-stack)', hint: 'Includes Rust Compiler & Islands' },
                    { value: 'edge', label: 'Edge (Cloud-Native)', hint: 'Distributed Sync enabled' },
                ]
            }),
            install: () => p.confirm({
                message: 'Should we awaken the dependencies? (npm install)',
                initialValue: true
            })
        },
        {
            onCancel: () => {
                p.cancel('Operation cancelled. The Zenith remains untouched.');
                process.exit(0);
            }
        }
    );

    const s = p.spinner();
    s.start('Synthesizing your project structure...');

    const targetPath = path.resolve(process.cwd(), project.path);

    // Scaffolding Logic
    try {
        await fs.ensureDir(targetPath);

        // Mock template copy
        await fs.writeJSON(path.join(targetPath, 'package.json'), {
            name: path.basename(targetPath),
            version: '0.1.0',
            private: true,
            dependencies: {
                "@koda/core": "latest",
                ...(project.template === 'zenith' ? { "@koda/compiler": "latest", "@koda/bridge": "latest" } : {}),
                ...(project.template === 'edge' ? { "@koda/cloud": "latest" } : {})
            }
        }, { spaces: 2 });

        s.stop('Synthesis complete.');

        p.outro(`${pc.green('Mission Successful!')} 🛰️🚀`);
        console.log(`\n  ${pc.dim('cd')} ${project.path}`);
        console.log(`  ${pc.dim('bun dev')}\n`);
        console.log(`💎 ${pc.magenta('Zenith Standard: Beyond Technology.')}`);
    } catch (err: any) {
        s.stop('Synthesis failed.');
        p.note(err.message, pc.red('Error'));
        process.exit(1);
    }
}

main().catch(console.error);
