#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import chalk from 'chalk';
import { Command } from 'commander';
import pkg from './package.json' assert { type: 'json' };
import { runDevServer } from './src/run-dev-server.js';

const program = new Command();

program
  .version(pkg.version)
  .description('Spin a quick development Server for your GCP functions')
  .option('-d, --dir  [value]', 'Directory folder to watch for changes')
  .option('-p, --port [value]', 'Port to run the server on')
  .parse(process.argv);

const options = program.opts<{ dir: string; port?: number }>();

if (options.dir) {
  const srcDir = path.resolve(options.dir);
  if (!fs.existsSync(srcDir)) {
    program.error(chalk.red(`Directory ${srcDir} does not exist`));
  }
  runDevServer(srcDir, options.port);
} else {
  runDevServer('.');
}

program.parse();
