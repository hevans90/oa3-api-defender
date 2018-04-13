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
console.log('\n');
console.log(colors.bgBlue(colors.bold('                             ')));
console.log(colors.bgBlue(colors.bold('==== OA3 API Testing CLI ====')));
console.log(colors.bgBlue(colors.bold('_____________________________')));
console.log('\n');

console.log(colors.bold(`API URL: ${apiUrl}\n`));

EndpointValidator.validate(validator, 'get', 'plans', apiUrl);
