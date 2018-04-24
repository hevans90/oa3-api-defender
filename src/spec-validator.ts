import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
import * as colors from 'colors';
import * as Debug from 'debug';
import { OpenApiValidator, OpenApiDocument } from 'express-openapi-validate';
import {
  Operation,
  PathItemObject,
} from 'express-openapi-validate/dist/OpenApiDocument';

import { EndPointValidator } from './endpoint-validator';

const debug = Debug('oa3-def');

/**
 * A class encapsulating the boilerplate required to call the EndpointValidator.
 *
 * Simply instantiate a new instance of this class with a file path to the spec file,
 * and the root URL of the API to test against, and then call the validate() method.
 */
export class SpecValidator {
  constructor(
    specPath: string,
    apiUrl: string,
    auth?: string,
    endPointValidator?: EndPointValidator, // simple DI
  ) {
    this.specPath = specPath;
    this.apiUrl = apiUrl;
    this.auth = auth ? auth : undefined;

    if (endPointValidator) {
      this.endPointValidator = endPointValidator;
    }

    this._document = this.loadOpenApiSpec();
    this._oa3Validator = new OpenApiValidator(this.document, {
      ajvOptions: { allErrors: true, verbose: true },
    });
  }

  public endPointValidator: any | undefined;

  private specPath: string;
  private apiUrl: string;
  private auth: string | undefined;

  private _document: OpenApiDocument;
  get document(): OpenApiDocument {
    return this._document;
  }

  private _oa3Validator: OpenApiValidator;
  get oa3Validator(): OpenApiValidator {
    return this._oa3Validator;
  }

  /**
   * Parses an OA3 spec using jsYaml & fs
   */
  public loadOpenApiSpec(): OpenApiDocument | never {
    let doc: OpenApiDocument | undefined;

    try {
      debug(`Trying to parse spec: ${this.specPath}...`);
      doc = jsYaml.safeLoad(
        fs.readFileSync(this.specPath, 'utf-8'),
      ) as OpenApiDocument;
      debug('Success!');
      return doc;
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(
          `${colors.red(
            `No such file or directory: ${colors.red.bold(err.path)}`,
          )}`,
        );
      } else {
        throw err;
      }
    }
  }

  /**
   *  Gathers paths & their descendant HTTP Operations from the validator's currently parsed
   *  OA3 spec and passes then to the static EndpointValidator.validate method.
   */
  public validateSpec(): void {
    if (!this.document) {
      throw new Error('No OA3 document found!');
    } else {
      const pathsToValidate: string[] = Object.keys(this.document.paths);

      debug(`Found ${pathsToValidate.length} paths to validate...`);

      pathsToValidate.forEach(path => {
        const pathObj: PathItemObject = this.document.paths[path];
        const operations = this.getDefinedHttpOperations(pathObj);

        const reqBody = {};

        operations.forEach(op => {
          // very rudimentary DI
          if (this.endPointValidator) {
            this.endPointValidator.validate(
              this._oa3Validator,
              op,
              path,
              this.apiUrl,
            );
          } else {
            EndPointValidator.validate(
              this._oa3Validator,
              op,
              path,
              this.apiUrl,
              reqBody,
              this.auth,
            );
          }
        });
      });
    }
  }

  /**
   * Returns an array of Operations from a PathItemObject.
   * (currently only supports **get** | **post** | **delete** | **put** | **patch**)
   */
  public getDefinedHttpOperations(pathItem: PathItemObject): Operation[] {
    const operations: Operation[] = [];

    if (pathItem.get) operations.push('get');
    if (pathItem.post) operations.push('post');
    if (pathItem.delete) operations.push('delete');
    if (pathItem.put) operations.push('put');
    if (pathItem.patch) operations.push('patch');

    return operations;
  }
}
