import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
import * as colors from 'colors';
import * as Debug from 'debug';
import * as requestPromise from 'request-promise-native';
import { OpenApiValidator, OpenApiDocument } from 'express-openapi-validate';
import {
  Operation,
  PathItemObject,
  OperationObject,
} from 'express-openapi-validate/dist/OpenApiDocument';

import { EndPointValidator } from './endpoint-validator';
import { OperationConfig } from './operation-config';
import { ParamParser } from './param-parser';
import { RequestParser } from './request-parser';
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
  }

  public endPointValidator: any | undefined;

  private specPath: string;
  private apiUrl: string;
  private auth: string | undefined;

  private _document: OpenApiDocument | undefined = undefined;
  get document(): OpenApiDocument {
    return this._document as OpenApiDocument;
  }
  set document(doc: OpenApiDocument) {
    this._document = doc;
  }

  private _oa3Validator: OpenApiValidator | undefined;
  get oa3Validator(): OpenApiValidator {
    return this._oa3Validator as OpenApiValidator;
  }
  set oa3Validator(val: OpenApiValidator) {
    this._oa3Validator = val;
  }

  public async setupSpecValidator(): Promise<boolean> {
    try {
      this.document = await this.loadOpenApiSpec();

      this.oa3Validator = new OpenApiValidator(this.document, {
        ajvOptions: { allErrors: true, verbose: true },
      });

      return Promise.resolve(true);
    } catch (err) {
      throw err;
    }
  }

  private async loadOpenApiSpec(): Promise<OpenApiDocument> {
    if (this.specPath.startsWith('http')) {
      const doc = await this.loadOpenApiSpecAsync(this.specPath);
      return Promise.resolve(jsYaml.safeLoad(doc) as OpenApiDocument);
    } else {
      return Promise.resolve(this.loadOpenApiSpecSync(this.specPath));
    }
  }

  /**
   * Parses an OA3 spec using jsYaml & fs
   */
  private loadOpenApiSpecSync(specPath: string): OpenApiDocument | never {
    let doc: OpenApiDocument | undefined;
    try {
      debug(`Trying to parse spec: ${specPath}...`);
      doc = jsYaml.safeLoad(
        fs.readFileSync(specPath, 'utf-8'),
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

  private async loadOpenApiSpecAsync(specUrl: string): Promise<string> {
    return requestPromise(specUrl);
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

        operations.forEach(opConfig => {
          const paramaterisedPath = ParamParser.generateParamaterisedPath(
            path,
            opConfig,
          );

          const reqBody = RequestParser.generateExampleBody(
            path,
            opConfig,
            this.document,
          );

          // very rudimentary DI
          if (this.endPointValidator) {
            debug(`opConfig: ${JSON.stringify(opConfig, null, 2)}`);
            this.endPointValidator.validate(
              this.oa3Validator,
              opConfig,
              path,
              this.apiUrl,
            );
          } else {
            EndPointValidator.validate(
              this.oa3Validator,
              opConfig,
              path,
              paramaterisedPath,
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
  public getDefinedHttpOperations(pathItem: PathItemObject): OperationConfig[] {
    const operations: OperationConfig[] = [];

    if (pathItem.get)
      operations.push({ operation: 'get', config: pathItem.get });
    if (pathItem.post)
      operations.push({ operation: 'post', config: pathItem.post });
    if (pathItem.delete)
      operations.push({ operation: 'delete', config: pathItem.delete });
    if (pathItem.put)
      operations.push({ operation: 'put', config: pathItem.put });
    if (pathItem.patch)
      operations.push({ operation: 'patch', config: pathItem.patch });

    return operations;
  }
}
