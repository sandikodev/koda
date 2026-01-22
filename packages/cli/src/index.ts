#!/usr/bin/env bun
import { Command } from 'commander';
import pc from 'picocolors';
import { initCommand } from './commands/init';
import { auditCommand } from './commands/audit';
import { generateCommand } from './commands/generate';
import { repairCommand } from './commands/repair';
import { contextCommand } from './commands/context';

const program = new Command();

program
    .name('koda')
    .description('The institutional CLI for the Koda Zenith Metaframework')
    .version('0.1.0-zenith')
    .addCommand(generateCommand)
    .addCommand(repairCommand)
    .addCommand(contextCommand);

program
    .command('init')
    .argument('[path]', 'path to initialize', '.')
    .option('-f, --force', 'force overwrite', false)
    .description('Initialize a new Koda project')
    .action(async (path, options) => {
        await initCommand(path, options.force);
    });

program
    .command('audit')
    .argument('[path]', 'path to audit', '.')
    .description('Perform a security audit on the current project')
    .action(async (path) => {
        await auditCommand(path);
    });

program
    .command('evolve')
    .option('--dry-run', 'simulasikan upgrade tanpa merubah file', false)
    .description('Run evolutionary upgrades & hegemony check')
    .action(async (options) => {
        await evolveCommand({ values: options });
    });

program.parse();
