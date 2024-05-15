# lighttp

Lighttp is a lightweight HTTP server designed for your GCP function. It's built for developing GCP functions quicker without rerunning functions manually.

It's main feature is building routes from the given `--dir` and detect new routes when adding or delete files from the folder.

## Getting Started

Simply run

```sh
npx lighttp --dir path/to/functions/folderh
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
