import * as path from 'node:path';
import { listenAndWatch } from 'listhen';
import { logger } from './logger.js';

const filename = import.meta.url.replace('file://', '');
const extension = path.extname(filename);
const serverPath = path.resolve(filename, '../..', `dev-server${extension}`);
logger.info(`Server path: ${serverPath}`);

export async function runDevServer(dir: string, port?: number) {
  process.env.CWD = dir;
  await listenAndWatch(serverPath, {
    cwd: dir,
    port,
    logger,
  });
}
