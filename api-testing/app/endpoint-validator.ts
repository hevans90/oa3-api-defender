import * as colors from 'colors';
import {
  OpenApiValidator,
  ValidationError
} from 'express-openapi-validate/dist';
import { Operation } from 'express-openapi-validate/dist/OpenApiDocument';

import * as request from 'request';
import { ErrorFormatter } from './error-formatter';

export class EndPointValidator {
  public static arrRegex = /body\[\d+\]/i;
  public static integerRegex = /\d+/g;

  public static validate(
    validator: OpenApiValidator,
    operation: Operation,
    path: string,
    rootUrl: string,
    body?: Object
  ) {
    /**
     * Generated validation function from the validator's consumed OpenApiDocument,
     * using ajv under the hood
     */
    const validateFn: (res: any) => void = validator.validateResponse(
      operation,
      `/${path}`
    );

    switch (operation) {
      // "get" | "put" | "post" | "patch" | "delete"
      case 'get': {
        request.get(`${rootUrl}/${path}`, (err: any, res: request.Response) => {
          res.body = JSON.parse(res.body);
          this.runValidator(res, operation, path, validateFn);
        });
        break;
      }
      case 'post': {
        request.post(
          { url: `${rootUrl}/${path}`, body: body ? body : null },
          (err: any, res: request.Response) => {
            res.body = JSON.parse(res.body);
            this.runValidator(res, operation, path, validateFn);
          }
        );
        break;
      }
      case 'delete': {
        request.delete(
          `${rootUrl}/${path}`,
          (err: any, res: request.Response) => {
            res.body = JSON.parse(res.body);
            this.runValidator(res, operation, path, validateFn);
          }
        );
        break;
      }
      case 'put': {
        request.put(
          { url: `${rootUrl}/${path}`, body: body ? body : null },
          (err: any, res: request.Response) => {
            res.body = JSON.parse(res.body);
            this.runValidator(res, operation, path, validateFn);
          }
        );
        break;
      }
      case 'patch': {
        request.patch(
          { url: `${rootUrl}/${path}`, body: body ? body : null },
          (err: any, res: request.Response) => {
            res.body = JSON.parse(res.body);
            this.runValidator(res, operation, path, validateFn);
          }
        );
        break;
      }
      default: {
        throw new Error(
          'this tool currently only supports "get" | "post" | "delete" | "put" | "patch" HTTP operations, sorry!'
        );
      }
    }
  }

  public static runValidator(
    res: request.Response,
    operation: string,
    path: string,
    validateFn: (res: request.Response) => void
  ): void {
    try {
      validateFn(res);
    } catch (error) {
      const xerr: ValidationError = error;

      console.log(
        `${operation.toUpperCase()} ${colors.bold.bgMagenta(
          `/${path}`
        )} - ${colors.underline.bold.red(
          `${xerr.data.length} problems found`
        )}:\n`
      );

      let currentIndex: number;

      xerr.data.forEach((errorObj, i) => {
        const formattedError = ErrorFormatter.formatError(errorObj);

        if (this.isArrayResponse(formattedError.prefix)) {
          const prevIndex = currentIndex;
          currentIndex = this.getArrayIndex(formattedError.prefix);
          if (currentIndex !== prevIndex && i !== 0) {
            console.log('');
          }
        }

        console.log(`  ${formattedError.message}`);
      });
    } finally {
      console.log('');
    }
  }

  public static isArrayResponse(prefix: string): boolean {
    return prefix.match(this.arrRegex) !== null;
  }

  public static getArrayIndex(prefix: string): number {
    const arrString = (prefix.match(this.arrRegex) as RegExpMatchArray)[0]; // i.e [12]
    const index = parseInt(
      (arrString.match(this.integerRegex) as RegExpMatchArray)[0],
      10
    ); // i.e. 12
    return index;
  }
}
