# Ghosttp

**`Ghosttp`** is a lightweight HTTP server designed for your GCP function. It's built for developing GCP functions quicker without rerunning functions manually.

It's main feature is building routes from the given `--dir` and detect new routes when adding or delete files from the folder.

That generates a development server with hot module reloading (HMR) and creates a route based on the filename.

```sh
  ➜ Local:    http://localhost:3000/
  ➜ Network:  use --host to expose

[listhen 11:27:15 AM] 🚀 Loading server entry ./src/run-dev-server.ts
[listhen 11:27:15 AM] ✅ Server initialized in 74ms
[listhen 11:27:15 AM] 👀 Watching ./tests for changes
[11:27:15.206] INFO (21369): Following endpoints are available:
[11:27:15.206] INFO (21369): /dev-server.test
```

### Opinionated Handler

I know, for now it is a bit opinionated but the handler should be named `handler`.
However, you can ESM or Typescript Syntax.

```ts
import type { Request, Response } from '@google-cloud/functions-framework';

export const handler = async (req: Request, res: Response) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('')`
    return;
  }

  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      result,
    }),
  );
  return new Response(JSON.stringify(result));
};
```

## Getting Started

Simply run

```sh
npx ghosttp --dir path/to/functions/folder
```

If no argument is passed, it will use the current dir. Otherwise, check the [Args](#args).

### Args

```sh
Spin a quick development Server for your GCP
functions

Options:
  -V, --version       output the version number
  -d, --dir  [value]  Directory folder to watch for changes
  -h, --help          display help for command
```

## Contribution

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
