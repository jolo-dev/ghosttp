# GHosttp

<p align="center">
  <img src="./docs/GHosttp.png" />
</p>

**`GHosttp`** is a lightweight HTTP server designed for your GCP function. It's built for developing GCP functions quicker without rerunning functions manually.

It's main feature is building routes from the given `--dir` and detect new routes when adding or delete files from the folder.

That generates a development server with hot module reloading (HMR) and creates a route based on the filename.

```sh
  ➜ Local:    http://localhost:3000/
  ➜ Network:  use --host to expose

🚀 Loading server entry ./src/run-dev-server.ts GHosttp 12:21:58 AM
✅ Server initialized in 90ms                   GHosttp 12:21:58 AM
👀 Watching ./path/to/functions for changes     GHosttp 12:21:58 AM
ℹ Following endpoints are available             GHosttp 12:21:58 AM
ℹ /logger                                       GHosttp 12:21:58 AM
ℹ /run-dev-server                               GHosttp 12:21:58 AM
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
    res.status(204).send('')
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
  -p, --port [number] The port number where the dev server shall run
  -h, --help          display help for command
```

## Contribution

To install dependencies:

```bash
pnpm install
```

To run:

```bash
pnpm dev --dir path/to/folder # Otherwise it would take the "." (root)
```

## [LICENSE](./docs/LICENSE.md)
