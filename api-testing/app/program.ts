import * as colors from 'colors';
import * as fs from 'fs';
import * as jsYaml from 'js-yaml';

import {
  OpenApiValidator,
  ValidationError
} from 'express-openapi-validate/dist';
import { EndpointValidator } from './endpoint-validator';

const apiUrl = 'http://localhost:4040';

const openApiDocument = jsYaml.safeLoad(
  fs.readFileSync('../test.yaml', 'utf-8')
);

const validator = new OpenApiValidator(openApiDocument, {
  ajvOptions: { allErrors: true, verbose: true }
});

console.log(`\n${colors.bgBlue(colors.bold('--API Testing CLI--'))}\n`);

EndpointValidator.validate(validator, 'get', 'plans', apiUrl);
