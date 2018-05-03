import * as Debug from 'debug';
import { OperationConfig } from './operation-config';
import { OpenApiDocument } from 'express-openapi-validate';
import { resolveReference } from 'express-openapi-validate/dist/schema-utils';
import {
  SchemaObject,
  ReferenceObject,
} from 'express-openapi-validate/dist/OpenApiDocument';
import { Schema } from 'js-yaml';
import { isObject } from 'util';

const debug = Debug('oa3-def');

export class RequestParser {
  /**
   * Attemps to generate an example request body
   * from requestBody schema examples (if they exist)
   */
  public static generateExampleBody(
    path: string,
    opConfig: OperationConfig,
    document: OpenApiDocument,
  ): Object {
    const reqBody = {};

    if (opConfig.config.requestBody) {
      debug(
        `Attempting to generate requestBody for: ${opConfig.operation.toUpperCase()} ${path}...`,
      );

      let requestSchema: SchemaObject | ReferenceObject | undefined =
        opConfig.config.requestBody.content['application/json'].schema;

      if (requestSchema) {
        requestSchema = resolveReference(document, requestSchema);

        if (requestSchema.properties) {
          Object.keys(requestSchema.properties).forEach(prop => {
            const ref = resolveReference(
              document,
              (requestSchema as any).properties[prop],
            );
            const ex = this.generateExampleValue(ref);
            reqBody[prop] = ex ? ex : undefined;
          });
          debug(`Generated Body: ${JSON.stringify(reqBody, null, 2)}`);
        }
      }
    }

    return reqBody;
  }

  /**
   * Recursive function to generate examples for individual SchemaObjects.
   * If an object literal is detected the function will recurse down the tree and look for examples, indefinitely.
   */
  public static generateExampleValue(schema: SchemaObject | any): any {
    if (schema.example) {
      return schema.example;
    } else if (schema.properties) {
      const exampleLiteral = {};

      Object.keys(schema.properties).forEach(prop => {
        exampleLiteral[prop] = this.generateExampleValue(
          schema.properties[prop],
        );
      });

      return exampleLiteral;
    }
  }
}
