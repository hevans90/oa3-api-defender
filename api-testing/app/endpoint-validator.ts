import {
  OpenApiValidator,
  ValidationError
} from 'express-openapi-validate/dist';
import { Operation } from 'express-openapi-validate/dist/OpenApiDocument';

import * as request from 'request';
import { ErrorFormatter } from './error-formatter';

export abstract class EndpointValidator {
  public static validate(
    validator: OpenApiValidator,
    operation: Operation,
    path: string,
    rootUrl: string
  ) {
    const validateResponse = validator.validateResponse(operation, `/${path}`);

    request.get(
      `${rootUrl}/${path}`,
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
  }
}
