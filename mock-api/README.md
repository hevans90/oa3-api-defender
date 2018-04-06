# Mock API

This folder contains a mock of the ten-platform-api, written using Node.js & express.

## Quickstart

Fork or clone the repo, `cd mock-api`, yarn install, and then open 2 terminals.

1. `npm run test` to run spec files using [jasmine-ts](https://www.npmjs.com/package/jasmine-ts) in watch mode.

2. `npm run serve:dev` to run the API on `localhost:4040` using [ts-node](https://www.npmjs.com/package/ts-node) in watch mode.

___

## Swagger

`npm run serve:swagger` to serve a swagger UI on `localhost:4041` using http-server.

*NOTE: this Swagger UI loads the Open API 3 spec in the repo's root directory, it is not necessarily representative of the mock-api at all.*
