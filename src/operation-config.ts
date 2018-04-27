import {
  OperationObject,
  Operation,
} from 'express-openapi-validate/dist/OpenApiDocument';

export interface OperationConfig {
  operation: Operation;
  config: OperationObject;
}
