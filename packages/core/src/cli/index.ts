#!/usr/bin/env bun
import { parseArgs } from "util";
import { initCommand } from "./commands/init";
import { auditCommand } from "./commands/audit";
import { evolveCommand } from "./commands/evolve";

/**
 * 🛰️ Koda CLI: Standard Scaffolding Engine
 * Part of Phase 7: Koda CLI (Scaffolding Engine)
 * The zenith of developer experience starts here.
 * ทุก detail Zenith tetap aman.
 */

const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    help: { type: "boolean", short: "h" },
    version: { type: "boolean", short: "v" },
    force: { type: "boolean", short: "f" },
  },
  allowPositionals: true,
});

const VERSION = "0.1.0-zenith";

const showHelp = () => {
  console.log(`
  🛰️ Koda CLI: The Stage Zenith Scaffolding Engine

  Usage:
    koda <command> [options]

  Commands:
    init [path]     Initialize a new high-fidelity Koda project
    audit           (Phase 8) Run cybersecurity hardening checks
    evolve          (Phase 11) Run evolutionary upgrades & hegemony check
    version         Show Koda version

  Options:
    -h, --help      Show this help message
    -v, --version   Show version
    -f, --force     Force operation (overwrite existing files)

  Synthesis:
    "Standard Chassis, Creative Innovation."
  `);
};

if (values.help || positionals.length === 0) {
  showHelp();
  process.exit(0);
}

if (values.version || positionals[0] === "version") {
  console.log(`Koda CLI v${VERSION}`);
  process.exit(0);
}

const command = positionals[0];

switch (command) {
  case "init":
    await initCommand(positionals[1] || ".", values.force as boolean);
    break;
  case "audit":
    await auditCommand(positionals[1] || ".");
    break;
  case "evolve":
    await evolveCommand({ values: values as any });
    break;
  default:
    console.log(`❌ Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
