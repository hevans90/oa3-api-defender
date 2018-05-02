import * as Debug from 'debug';
import { OperationConfig } from './operation-config';
import { OpenApiDocument } from 'express-openapi-validate';
import { resolveReference } from 'express-openapi-validate/dist/schema-utils';
import {
  SchemaObject,
  ReferenceObject,
} from 'express-openapi-validate/dist/OpenApiDocument';
import { Schema } from 'js-yaml';

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
      // debug(`initial Schema: ${JSON.stringify(requestSchema, null, 2)}`);

      if (requestSchema) {
        requestSchema = resolveReference(document, requestSchema);
        // debug(`resolved Schema: ${JSON.stringify(requestSchema, null, 2)}`);

        if (requestSchema.properties) {
          Object.keys(requestSchema.properties).forEach(prop => {
            const ex = (requestSchema as any).properties[prop].example;
            reqBody[prop] = ex ? ex : undefined;
          });
          debug(`Generated Body: ${JSON.stringify(reqBody, null, 2)}`);
        }
      }
    }

    return reqBody;
  }
}
