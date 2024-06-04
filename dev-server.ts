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

// Assuming necessary imports are already done
async function processRequest(event: H3Event<EventHandlerRequest>, gcpFunction: string) {
  logger.info(`Processing request for ${gcpFunction}`);

  const module = await import(`${path.resolve(gcpFunction)}`);
  const handler = module.handler;

  let input = event.node.req;
  let res = createResponse(event);

  if (event.method === 'POST') {
    input = await preparePostRequestBody(event);
  }

  const result = await handler(input, res);
  return result || { message: 'No response' };
}

function createResponse(event: H3Event<EventHandlerRequest>) {
  return {
    set: (key: string, value: string) => event.node.res.setHeader(key, value),
    send: (data: string) => event.node.res.end(data),
  };
}

async function preparePostRequestBody(event: H3Event<EventHandlerRequest>): Promise<GcpRequest> {
  const data = await readBody(event);
  return { body: data } as unknown as GcpRequest;
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
