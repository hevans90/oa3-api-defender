# Open Api 3 <--> RESTFul API Defender

This tool is a CLI that parses an [Open Api 3 Specification](https://swagger.io/specification/), calls a real API based on the spec's `paths` & associated response `schemas`, and provides command line validation on the output.

___

## Installation

`npm install @ten-group/oa3-api-defender --dev`

`yarn add @ten-group/oa3-api-defender --dev`

## Usage

`npx oa3-def validate --specPath=<path_to_yaml_spec> --url=<URL_of_API>`

- `--specPath` path to an Open Api 3 Specification written in `YAML`.
- `--url` fully qualified URL to the API to call (don't use production, especially if your spec has CRUD operations!!).
