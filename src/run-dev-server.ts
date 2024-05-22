import * as path from 'node:path';
import { listenAndWatch } from 'listhen';
import { logger } from './logger.js';

const dirname = import.meta.dirname;
const serverPath = path.resolve(dirname, '..', 'dev-server.ts');
logger.info(`Server path: ${serverPath}`);

export async function runDevServer(dir: string, port?: number) {
  process.env.CWD = dir;
  await listenAndWatch(serverPath, {
    port,
    logger,
  });
}
