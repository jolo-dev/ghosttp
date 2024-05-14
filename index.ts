import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { Command } from 'commander';
import { runDevServer } from './src/run-dev-server';

const program = new Command();

program
  .version('1.0.0')
  .description('Spin a quick development Server for your GCP functions')
  .option('-d, --dir  [value]', 'Directory folder to watch for changes')
  .parse(process.argv);

const options = program.opts<{ dir: string }>();

if (options.dir) {
  const srcDir = path.resolve(options.dir);
  if (!fs.existsSync(srcDir)) {
    program.error(chalk.red(`Directory ${srcDir} does not exist`));
  }
  runDevServer(srcDir);
} else {
  runDevServer('.');
}

program.parse();
