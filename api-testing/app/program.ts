import * as colors from 'colors';
import * as request from 'request';
import * as fs from 'fs';
import * as jsYaml from 'js-yaml';

import { ErrorFormatter } from './error-formatter';

import {
  OpenApiValidator,
  ValidationError
} from 'express-openapi-validate/dist';

const apiUrl = 'http://localhost:4040';

const openApiDocument = jsYaml.safeLoad(
  fs.readFileSync('../test.yaml', 'utf-8')
);

const validator = new OpenApiValidator(openApiDocument, {
  ajvOptions: { allErrors: true, verbose: false }
});

const callPlans = () => {
  const validateResponse = validator.validateResponse('get', '/plans');
  const response = request.get(
    `${apiUrl}/plans`,
    (err: any, res: request.Response, body: string) => {
      res.body = JSON.parse(res.body);

      try {
        validateResponse(res);
      } catch (error) {
        const xerr: ValidationError = error;

        xerr.data.forEach(errorObj => {
          console.log(ErrorFormatter.formatError(errorObj));
        });
      }
    }
  );
};

console.log(`\n${colors.bgBlue(colors.bold('--API Testing CLI--'))}\n`);

callPlans();
