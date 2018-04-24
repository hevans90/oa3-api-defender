# Open Api 3 <--> RESTFul API Defender

This tool is a CLI that parses an [Open Api 3 Specification](https://swagger.io/specification/), calls a real API based on the spec's `paths` & associated response `schemas`, and provides command line validation on the output.

___

## Installation

`npm install @ten-group/oa3-api-defender --dev`

`yarn add @ten-group/oa3-api-defender --dev`

## Usage

`npx oa3-def validate --specPath=<path_to_yaml_spec> --url=<URL_of_API>`

- `--specPath`: path to an Open Api 3 Specification written in `YAML`.
- `--url`: fully qualified URL to the API to call (don't use production, especially if your spec has CRUD operations!!).
- `--auth`: an **optional** string that will be added as an auth header, like so:

```json
{
  headers: {
    Authorization: 'YOUR AUTH STRING HERE'
  }
}
```

![Alt text](docs/example_output.png?raw=true "CLI Output")

## Known Issues/WIPs

- The Tool cannot currently handle paramaterised requests : `url/{id}` or `url/{id}/nestedpath`, I am working on a solution: grabbing example param values from the OA3 spec and automatically calling the endpoints with them.

- The Tool cannot currently properly handle requests with request bodies, I am also working on this, though the solution to this is a little more involved - give me a few days :)
