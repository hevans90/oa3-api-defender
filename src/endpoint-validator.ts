import * as colors from 'colors';
import {
  OpenApiValidator,
  ValidationError,
} from 'express-openapi-validate/dist';
import { Operation } from 'express-openapi-validate/dist/OpenApiDocument';
import * as Debug from 'debug';
import * as request from 'request';
import { ErrorFormatter } from './error-formatter';
import { OperationConfig } from './operation-config';

const debug = Debug('oa3-def');

export class EndPointValidator {
  /**
   * matches strings such as: body[0], array[1232]
   */
  public static arrRegex = /[a-z]+\[\d+\]/i;
  public static integerRegex = /\d+/g;

  public static validate(
    validator: OpenApiValidator,
    opConfig: OperationConfig,
    originalPath: string,
    paramaterisedPath: string,
    rootUrl: string,
    body?: Object,
    auth?: string,
  ) {
    // debug(`  ${originalPath}... (${opConfig.operation})`);
    /**
     * Generated validation function from the validator's consumed OpenApiDocument,
     * using ajv under the hood
     */
    const validateFn: (res: any) => void = validator.validateResponse(
      opConfig.operation,
      originalPath,
    );

    /**
     * Set Auth headers if passed
     */
    const headers: request.Headers | undefined = auth
      ? {
          Authorization: auth,
        }
      : undefined;

    switch (opConfig.operation) {
      // "get" | "put" | "post" | "patch" | "delete"
      case 'get': {
        request.get(
          `${rootUrl}${paramaterisedPath}`,
          {
            headers: headers ? headers : undefined,
          },
          (err: any, res: request.Response) => {
            this.verifyRequest(err, res, 'get', paramaterisedPath, validateFn);
          },
        );
        break;
      }
      case 'post': {
        request.post(
          {
            url: `${rootUrl}${paramaterisedPath}`,
            headers: headers ? headers : undefined,
            body: body ? body : undefined,
            json: true,
          },
          (err: any, res: request.Response) => {
            this.verifyRequest(err, res, 'post', paramaterisedPath, validateFn);
          },
        );
        break;
      }
      case 'delete': {
        request.delete(
          `${rootUrl}${paramaterisedPath}`,
          {
            headers: headers ? headers : undefined,
          },
          (err: any, res: request.Response) => {
            this.verifyRequest(
              err,
              res,
              'delete',
              paramaterisedPath,
              validateFn,
            );
          },
        );
        break;
      }
      case 'put': {
        request.put(
          {
            url: `${rootUrl}${paramaterisedPath}`,
            headers: headers ? headers : undefined,
            body: body ? body : undefined,
            json: true,
          },
          (err: any, res: request.Response) => {
            this.verifyRequest(err, res, 'put', paramaterisedPath, validateFn);
          },
        );
        break;
      }
      case 'patch': {
        request.patch(
          {
            url: `${rootUrl}${paramaterisedPath}`,
            headers: headers ? headers : undefined,
            body: body ? body : undefined,
            json: true,
          },
          (err: any, res: request.Response) => {
            this.verifyRequest(
              err,
              res,
              'patch',
              paramaterisedPath,
              validateFn,
            );
          },
        );
        break;
      }
      default: {
        throw new Error(
          'this tool currently only supports "get" | "post" | "delete" | "put" | "patch" HTTP operations, sorry!',
        );
      }
    }
  }

  private static verifyRequest(
    err: any,
    res: request.Response,
    operation: Operation,
    path: string,
    validateFn: any,
  ) {
    if (err) {
      console.log(`${colors.red(err)}`);
    } else if (
      res.statusCode.toString().startsWith('4') ||
      res.statusCode.toString().startsWith('5')
    ) {
      this.outputFormattedPath(
        operation,
        path,
        res.statusCode,
        res.statusMessage,
        true,
      );
    } else {
      res.body = JSON.parse(res.body);
      this.runValidator(res, operation, path, validateFn);
    }
  }

  public static runValidator(
    res: request.Response,
    operation: Operation,
    path: string,
    validateFn: (res: request.Response) => void,
  ): void {
    try {
      validateFn(res);
      this.outputFormattedPath(
        operation,
        path,
        res.statusCode,
        res.statusMessage,
      );
    } catch (error) {
      const xerr: ValidationError = error;
      this.outputFormattedPath(
        operation,
        path,
        res.statusCode,
        res.statusMessage,
        false,
        error,
      );

      let currentIndex: number;

      xerr.data.forEach((errorObj, i) => {
        const formattedError = ErrorFormatter.formatError(errorObj);

        if (this.isArrayResponse(formattedError.prefix)) {
          if (i === 0) {
            debug('Array response detected');
          }

          const prevIndex = currentIndex;
          currentIndex = this.getArrayIndex(formattedError.prefix);
          if (currentIndex !== prevIndex && i !== 0) {
            console.log('');
          }
        }
        console.log(`  ${formattedError.message}`);
        if (i === xerr.data.length - 1) {
          console.log('');
        }
      });
    }
  }

  public static outputFormattedPath(
    op: Operation,
    path: string,
    statusCode: number,
    statusMessage: string,
    serverError?: boolean,
    valError?: ValidationError,
  ): void {
    if (valError) {
      console.log(
        `${op.toUpperCase()} ${colors.bold.green(
          path,
        )}: ${statusCode} - ${colors.underline.bold.red(
          `${valError.data.length} problems found`,
        )}:`,
      );
      console.log('');
    } else if (serverError) {
      console.log(
        `${op.toUpperCase()} ${colors.bold.bgRed(path)}: ${colors.bold(
          `${statusCode}`,
        )} - ${statusMessage}`,
      );
    } else {
      console.log(
        `${op.toUpperCase()} ${colors.bold.green(
          path,
        )}: ${statusCode} - no problems found`,
      );
    }
  }

  public static isArrayResponse(prefix: string): boolean {
    return prefix.match(this.arrRegex) !== null;
  }

  public static getArrayIndex(prefix: string): number {
    const arrString = (prefix.match(this.arrRegex) as RegExpMatchArray)[0]; // i.e [12]
    const index = parseInt(
      (arrString.match(this.integerRegex) as RegExpMatchArray)[0],
      10,
    ); // i.e. 12
    return index;
  }
}
