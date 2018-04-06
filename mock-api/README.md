# TS-Node Monorepo Boilerplate

Fork this repo for a quickstart monorepo containing a node.js/express API & a node.js CLI, both written in TypeScript >2.6. 

## Includes:

- npm build & test scripts for compiling + testing both projects
- npm build & test scripts for individually compiling + testing the CLI
- npm build & test scripts for individually compiling + testing the API

## Quickstart for the API

Fork or clone this repo, yarn install, and then open 2 terminals.

1. In the first terminal `npm run api-watch` to watch for typescript changes in the `src/api` directory, and re-compile on the fly.

2. In the second terminal `npm run test-api` to watch for changes to `dist/api` spec files, and re-run tests on the fly.

### Running the API

1. To run the actual API you can run in dev (with ts-node): `npm run api-dev`, or in prod (with transpiled javascript) `npm run api-prod`.

2. Once running, try out GET/POST requests to `http://localhost:4040`.

## Quickstart for the CLI

Open 2 terminals.

In the first terminal `npm run cli-watch` to watch for typescript changes in the `src/cli` directory, and re-compile on the fly.

In the second terminal `npm run test-cli` to watch for changes to `dist/cli` spec files, and re-run tests on the fly.

### Running the CLI

Coming soon!
