import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
import { OpenApiValidator, OpenApiDocument } from 'express-openapi-validate';
import {
  Operation,
  PathItemObject
} from 'express-openapi-validate/dist/OpenApiDocument';

import { EndpointValidator } from './endpoint-validator';

/**
 * A class encapsulating the boilerplate required to call the EndpointValidator.
 *
 * Simply instantiate a new instance of this class with a file path to the spec file,
 * and the root URL of the API to test against, and then call the validate() method.
 */
export class SpecValidator {
  constructor(specPath: string, apiUrl: string) {
    this.specPath = specPath;
    this.apiUrl = apiUrl;

    this.document = this.loadOpenApiSpec();
    this.validator = new OpenApiValidator(this.document, {
      ajvOptions: { allErrors: true, verbose: true }
    });
  }

  private specPath: string;
  private apiUrl: string;

  private document: OpenApiDocument;
  private validator: OpenApiValidator;

  /**
   * Parses an OA3 spec using jsYaml & fs
   */
  public loadOpenApiSpec(): OpenApiDocument {
    return jsYaml.safeLoad(
      fs.readFileSync(this.specPath, 'utf-8')
    ) as OpenApiDocument;
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

      pathsToValidate.forEach(path => {
        const pathObj: PathItemObject = this.document.paths[path];
        const operations = this.getDefinedHttpOperations(pathObj);

        operations.forEach(op => {
          path = path.replace('/', '');
          EndpointValidator.validate(this.validator, op, path, this.apiUrl);
        });
      });
    }
  }

  /**
   * Returns an array of Operations from a PathItemObject.
   * (currently only supports **get** | **post** | **delete** | **put** | **patch**)
   */
  private getDefinedHttpOperations(pathItem: PathItemObject): Operation[] {
    const operations: Operation[] = [];

    if (pathItem.get) operations.push('get');
    if (pathItem.post) operations.push('post');
    if (pathItem.delete) operations.push('delete');
    if (pathItem.put) operations.push('put');
    if (pathItem.patch) operations.push('patch');

    return operations;
  }
}
