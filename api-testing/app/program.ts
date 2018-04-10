import * as colors from 'colors';
import * as request from 'request';
import * as fs from 'fs';
import * as jsYaml from 'js-yaml';

import {
  OpenApiValidator,
  ValidationError
} from 'express-openapi-validate/dist';

const apiUrl = 'http://localhost:4040';

const openApiDocument = jsYaml.safeLoad(
  fs.readFileSync('../swagger.yaml', 'utf-8')
);

const validator = new OpenApiValidator(openApiDocument);

const callPlans = () => {
  const validateResponse = validator.validateResponse('get', '/plans');
  let res = request.get(
    `${apiUrl}/plans`,
    (err: any, res: request.Response, body: string) => {
      res.body = JSON.parse(res.body);

      try {
        validateResponse(res);
      } catch (err) {
        let xerr: ValidationError = err;
        console.log(xerr.message);
      }
    }
  );
  console.log(validateResponse);
};

console.log(`\n${colors.bgBlue(colors.bold('--API Testing CLI--'))}\n`);

callPlans();
