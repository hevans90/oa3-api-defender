import * as colors from 'colors';
import * as request from 'request';
import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
import {
  AdditionalPropertiesParams,
  ErrorObject,
  FormatParams,
  RequiredParams,
  TypeParams
} from 'ajv';

import { Keyword } from './keyword';

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
  let res = request.get(
    `${apiUrl}/plans`,
    (err: any, res: request.Response, body: string) => {
      res.body = JSON.parse(res.body);

      try {
        validateResponse(res);
      } catch (err) {
        let xerr: ValidationError = err;

        xerr.data.forEach(err => {
          console.log(formatError(err));
        });
      }
    }
  );
};

const formatError = (errorData: ErrorObject): string => {
  let fieldName: string;
  let suffix: string = '';
  const dataPathArray = errorData.dataPath.split('.');
  const parentObjDescription = getParentObjDescription(dataPathArray);

  switch (errorData.keyword) {
    case Keyword.additionalProperties: {
      fieldName = parentObjDescription;
      suffix = (errorData.params as AdditionalPropertiesParams)
        .additionalProperty;
      errorData.message += ':';
      break;
    }
    case Keyword.required: {
      fieldName = parentObjDescription;
      errorData.message = 'should have required property:';
      suffix = (errorData.params as RequiredParams).missingProperty;
      break;
    }
    default: {
      fieldName = dataPathArray.pop();
    }
  }

  return `${colors.red.bold(fieldName)} - ${
    errorData.message
  } ${colors.red.bold(suffix)}\n`;

  function getParentObjDescription(dataPathArr: string[]): string {
    const len = dataPathArr.length;
    let parentObject: string = len > 1 ? dataPathArr[len - 1] : null;

    if (parentObject.includes('body')) {
      return '{ ResponseBody }';
    } else if (parentObject) {
      return `{ ${parentObject} }`;
    } else {
      return '<No Parent Object Found>';
    }
  }
};

console.log(`\n${colors.bgBlue(colors.bold('--API Testing CLI--'))}\n`);

callPlans();
