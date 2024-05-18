import * as fs from 'node:fs';
import { ServerResponse } from 'node:http';
import * as path from 'node:path';
import type {
  Request as GcpRequest,
  Response as GcpResponse,
} from '@google-cloud/functions-framework';
import chalk from 'chalk';
import {
  type EventHandlerRequest,
  type H3Event,
  createApp,
  createRouter,
  defineEventHandler,
  handleCors,
  readBody,
} from 'h3';
import { listenAndWatch } from 'listhen';
import { logger } from './logger.js';
const handleCorsMiddleware = (event: H3Event<EventHandlerRequest>) => {
  const cors = handleCors(event, {
    origin: '*',
    preflight: {
      statusCode: 204,
    },
    methods: '*',
  });
  return cors;
};

const processRequest = async (event: H3Event<EventHandlerRequest>, gcpFunction: string) => {
  const data = await readBody(event);
  const module = await import(`${path.resolve(gcpFunction)}`);
  const handler = module.handler;
  const input = { body: data } as unknown as GcpRequest;
  const serverResponse = new ServerResponse(input);
  const res = {
    set: (key: string, value: string) => serverResponse.setHeader(key, value),
    send: (data: string) => serverResponse.end(data),
  } as unknown as GcpResponse;
  const result = await handler(input, res);
  return result || { message: 'No response' };
};

export const app = createApp();

export async function runDevServer(dir: string, port?: number) {
  const functionFiles = fs.readdirSync(dir).map((file) => file.slice(0, -3));
  const router = createRouter();

  app.use(router);

  const filename = import.meta.url.replace('file://', '');
  const serverPath = path.resolve(filename);

  await listenAndWatch(serverPath, { cwd: dir, port });
  logger.info(chalk.blueBright('Following endpoints are available:'));
  for (const file of functionFiles) {
    logger.info(chalk.bgBlueBright(`/${file}`));
    router.use(
      `/${file}`,
      defineEventHandler(async (event) => {
        const cors = handleCorsMiddleware(event);
        if (!cors) {
          const result = await processRequest(event, file);
          return result;
        }
      }),
    );
  }
}
