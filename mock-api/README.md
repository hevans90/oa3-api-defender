# Mock API

This folder contains a mock of the ten-platform-api, written using Node.js & express.

## Quickstart

Fork or clone the repo, `cd mock-api`, yarn install, and then open 3 terminals.

1. `npm run watch:api` to watch for typescript changes in the `src/api` directory, and re-compile on the fly.

2. `npm run test` to watch for changes to `dist/api` spec files, and re-run tests on the fly.

3. `npm run serve:dev` to run the API on `localhost:4040` using ts-node.

___

## Swagger

`npm run serve:swagger` to serve a swagger UI on `localhost:4041` using http-server.

*NOTE: this Swagger UI loads the Open API 3 spec in the repo's root directory, it is not necessarily representative of the mock-api at all.*
