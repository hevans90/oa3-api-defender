import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
import {
  OpenApiValidator,
  OpenApiDocument,
  ValidationError
} from 'express-openapi-validate';
import {
  Operation,
  PathsObject,
  PathItemObject
} from 'express-openapi-validate/dist/OpenApiDocument';

import { EndpointValidator } from './endpoint-validator';

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

  // EndpointValidator.validate(validator, 'get', 'plans', apiUrl);

  public loadOpenApiSpec(): OpenApiDocument {
    return jsYaml.safeLoad(
      fs.readFileSync(this.specPath, 'utf-8')
    ) as OpenApiDocument;
  }

  public generatePathsToValidate(doc: OpenApiDocument): PathItemObject[] {
    return Object.values({ ...doc.paths });
  }

  public validateSpec(): void {
    const pathsToValidate: string[] = Object.keys(this.document.paths);

    pathsToValidate.forEach(path => {
      console.log(path);

      const pathObj: PathItemObject = this.document.paths[path];
      const operations = this.getDefinedHttpOperations(pathObj);

      operations.forEach(op => {
        path = path.replace('/', '');
        EndpointValidator.validate(this.validator, op, path, this.apiUrl);
      });
    });
  }

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
