import { SpecValidator } from './spec-validator';
import * as mockFs from 'mock-fs';
import { PathItemObject } from 'express-openapi-validate/dist/OpenApiDocument';
import { RequestParser } from './request-parser';
import { OperationConfig } from './operation-config';

let specValidator: SpecValidator;
const fakeApiUrl = 'nice-api-mate';
const fakeDir = 'FAKE__DIR';
const fakeSpecFileName = 'fake-spec.yaml';
const fakeSpec = `
openapi: 3.0.0
info:
  version: "0.0.1"
  title: 'Testing Spec'
  description: 'Open API spec for testing purposes'

paths:
  /basic_endpoint/:
    post:
      requestBody:
        content:
          application/json:
            schema:
              required:
                - card_number
                - program
              properties:
                card_number:
                  type: string
                  example: '4234567890123456'
                program:
                  type: string
                  example: 'nice'
                numberExample:
                  type: integer
                  example: 42

  /array_endpoint/:
    post:
      requestBody:
        content:
          application/json:
            schema:
              properties:
                arr:
                  type: array
                  items:
                    type: string
                  example: ['item1', 'item2', 'item3']

  /nested_endpoint/:
    post:
      requestBody:
        content:
          application/json:
            schema:
              required:
                - card_number
                - program
              properties:
                card_number:
                  type: string
                  example: '4234567890123456'
                program:
                  type: string
                  example: 'nice'
                numberExample:
                  type: integer
                  example: 42
                objExample:
                  properties:
                    subProp1:
                      type: string
                      example: 'foo'
                    subProp2:
                      type: string
                      example: 'bar'
                    subProp3:
                      type: integer
                      example: 99
                    subObj:
                      properties:
                        subSubProp1:
                          type: string
                          example: 'foo'
                        subSubProp2:
                          type: string
                          example: 'bar'
                        subSubProp3:
                          type: integer
                          example: 111
      responses:
        200:
          description: 'TODO response'
        400:
          description: 'TODO Cardholder ineligible/validation error'
          `;

describe('RequestParser', () => {
  beforeEach(async () => {
    mockFs({
      [fakeDir]: {
        [fakeSpecFileName]: fakeSpec,
      },
    });
    specValidator = new SpecValidator(
      `${fakeDir}/${fakeSpecFileName}`,
      fakeApiUrl,
      undefined,
      {
        validate: (): void => {
          '';
        },
      },
    );

    await specValidator.setupSpecValidator();
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe('generateExampleBody', () => {
    it('should generate a basic request body of string props', () => {
      const pathObj: PathItemObject =
        specValidator.document.paths['/basic_endpoint/'];
      const operations = specValidator.getDefinedHttpOperations(pathObj);
      const postOp = operations.find(
        op => op.operation === 'post',
      ) as OperationConfig;

      const reqBody = RequestParser.generateExampleBody(
        'basic_endpoint',
        postOp,
        specValidator.document,
      );

      const assertedBody = {
        card_number: '4234567890123456',
        program: 'nice',
        numberExample: 42,
      };

      expect(reqBody).toBeDefined();
      expect(reqBody).toEqual(assertedBody);
    });

    it('should generate a request body with an array', () => {
      const pathObj: PathItemObject =
        specValidator.document.paths['/array_endpoint/'];
      const operations = specValidator.getDefinedHttpOperations(pathObj);
      const postOp = operations.find(
        op => op.operation === 'post',
      ) as OperationConfig;

      const reqBody = RequestParser.generateExampleBody(
        'array_endpoint',
        postOp,
        specValidator.document,
      );

      const assertedBody = {
        arr: ['item1', 'item2', 'item3'],
      };

      console.log(reqBody);

      expect(reqBody).toBeDefined();
      expect(reqBody).toEqual(assertedBody);
    });

    it('should generate a complex nested request body', () => {
      const pathObj: PathItemObject =
        specValidator.document.paths['/nested_endpoint/'];
      const operations = specValidator.getDefinedHttpOperations(pathObj);
      const postOp = operations.find(
        op => op.operation === 'post',
      ) as OperationConfig;

      const reqBody = RequestParser.generateExampleBody(
        'nested_endpoint',
        postOp,
        specValidator.document,
      );

      const assertedBody = {
        card_number: '4234567890123456',
        program: 'nice',
        numberExample: 42,
        objExample: {
          subProp1: 'foo',
          subProp2: 'bar',
          subProp3: 99,
          subObj: {
            subSubProp1: 'foo',
            subSubProp2: 'bar',
            subSubProp3: 111,
          },
        },
      };

      expect(reqBody).toBeDefined();
      expect(reqBody).toEqual(assertedBody);
    });
  });
});
