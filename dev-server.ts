import fs from 'node:fs';
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
import { logger } from './src/logger.js';

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

async function processRequest(event: H3Event<EventHandlerRequest>, gcpFunction: string) {
  const data = await readBody(event);
  logger.info(`Processing request for ${path.resolve(gcpFunction)}`);
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
}

const cwd = process.env.CWD ?? '.';
logger.info(`Current working directory: ${cwd}`);

const functionFiles: string[] = fs.readdirSync(cwd).map((file) => file.slice(0, -3));

export const app = createApp();
const router = createRouter();
app.use(router);

logger.info(chalk.blueBright('Following endpoints are available:'));
for (const file of functionFiles) {
  logger.info(chalk.bgBlueBright(`/${file}`));
  router.use(
    `/${file}`,
    defineEventHandler(async (event) => {
      const cors = handleCorsMiddleware(event);
      if (!cors) {
        const result = await processRequest(event, `${cwd}/${file}`);
        return result;
      }
    }),
  );
}
