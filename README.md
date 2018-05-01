 [![buddy pipeline](https://app.buddy.works/hevans90/oa3-api-defender/pipelines/pipeline/135282/badge.svg?token=3e84171aecc7e0513da933a8e20d43480917d06fb391c0840949584b65098d4e "buddy pipeline")](https://app.buddy.works/hevans90/oa3-api-defender/pipelines/pipeline/135282) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Open Api 3 <--> RESTFul API Defender

This tool is a CLI that parses an [Open Api 3 Specification](https://swagger.io/specification/), calls a real API based on the spec's `paths` & associated response `schemas`, and provides command line validation on the output.

___

## Installation

`npm install oa3-api-defender --dev`

`yarn add oa3-api-defender --dev`

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

Requests with path (`/path{id}`) or query (`/path?query=1&nice=2`) will be called **only if the OA3 spec contains valid examples for the parameters**:

![Alt text](docs/paramaterised_get_output.png?raw=true "CLI Output")


## Known Issues/WIPs

- ~~The Tool cannot currently handle paramaterised requests : `url/{id}` or `url/{id}/nestedpath`, I am working on a solution: grabbing example param values from the OA3 spec and automatically calling the endpoints with them.~~ Paramaterised (path + query only) requests are now implemented as of version 1.4.

- The Tool cannot currently properly handle requests with request bodies, I am also working on this, though the solution to this is a little more involved - give me a few days :)
