import { SpecValidator } from './spec-validator';
import * as mockFs from 'mock-fs';
import { OpenApiDocument } from 'express-openapi-validate';
import { PathItemObject } from 'express-openapi-validate/dist/OpenApiDocument';
import { EndPointValidator } from './endpoint-validator';

const fakeApiUrl = 'nice-api-mate';
const fakeDir = 'FAKE__DIR';
const fakeSpecFileName = 'fake-spec.yaml';
const fakeSpec = `
openapi: 3.0.0
info:
  description: A spec for the Ten Platform API.
  version: "1.0.0"
  title: Ten Platform API
  contact:
    email: someone@your-company.com
  license:
    name: Apache 2.0
    url: 'http://www.apache.org/licenses/LICENSE-2.0.html'

paths:
  /potatoes:
    get:
      description: Returns an array of potatoes
      responses:
        '200':
          description: A JSON array of membership plans
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Potato'

components:
  schemas:
    Potato:
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
          example: 'Classic'
`;

describe('SpecValidator', () => {
  let specValidator: SpecValidator;

  beforeEach(() => {
    mockFs({
      [fakeDir]: {
        [fakeSpecFileName]: fakeSpec,
        'broken-spec.yaml': 'I r brokens',
      },
    });

    specValidator = new SpecValidator(
      `${fakeDir}/${fakeSpecFileName}`,
      fakeApiUrl,
      {
        validate: (): void => {
          '';
        },
      },
    );
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should create', () => {
    expect(specValidator).toBeDefined();
  });
  it('should NOT create if spec cannot be found', () => {
    expect(
      () => new SpecValidator(`${fakeDir}/invalid_file_path.yaml`, ''),
    ).toThrow();
  });

  describe('loadOpenApiSpec', () => {
    it('should load valid OA3 specs successfully', () => {
      const doc: OpenApiDocument = specValidator.loadOpenApiSpec();

      expect(doc).toBeDefined();
      expect(Object.keys(doc.paths)).toContain('/potatoes');
    });
    it('should NOT load invalid OA3 specs successfully', () => {
      expect(
        () => new SpecValidator(`${fakeDir}/broken-spec.yaml`, ''),
      ).toThrow();
    });
  });
  describe('getDefinedHttpOperations', () => {
    let mockPathItemObject: PathItemObject = {
      get: { responses: '200' },
      put: { responses: '200' },
      post: { responses: '200' },
      delete: { responses: '200' },
      patch: { responses: '200' },
    };

    it('should correctly convert a PathItemObject (all verbs) to Operation[]', () => {
      expect(
        specValidator.getDefinedHttpOperations(mockPathItemObject),
      ).toEqual(['get', 'post', 'delete', 'put', 'patch']);
    });

    it('should correctly convert a PathItemObject (get only) to Operation[]', () => {
      mockPathItemObject = { get: { responses: '' } };
      expect(
        specValidator.getDefinedHttpOperations(mockPathItemObject),
      ).toEqual(['get']);
    });

    it('should correctly convert a PathItemObject (post only) to Operation[]', () => {
      mockPathItemObject = { post: { responses: '' } };
      expect(
        specValidator.getDefinedHttpOperations(mockPathItemObject),
      ).toEqual(['post']);
    });

    it('should correctly convert a PathItemObject (delete only) to Operation[]', () => {
      mockPathItemObject = { delete: { responses: '' } };
      expect(
        specValidator.getDefinedHttpOperations(mockPathItemObject),
      ).toEqual(['delete']);
    });

    it('should correctly convert a PathItemObject (put only) to Operation[]', () => {
      mockPathItemObject = { put: { responses: '' } };
      expect(
        specValidator.getDefinedHttpOperations(mockPathItemObject),
      ).toEqual(['put']);
    });

    it('should correctly convert a PathItemObject (patch only) to Operation[]', () => {
      mockPathItemObject = { patch: { responses: '' } };
      expect(
        specValidator.getDefinedHttpOperations(mockPathItemObject),
      ).toEqual(['patch']);
    });
  });

  describe('validateSpec', () => {
    let validateSpy;
    it('should call EndpointValidator with correct params', () => {
      validateSpy = spyOn(specValidator.endPointValidator, 'validate');
      specValidator.validateSpec();
      expect(validateSpy).toHaveBeenCalled();
      expect(validateSpy).toHaveBeenCalledWith(
        specValidator.oa3Validator,
        'get',
        '/potatoes',
        fakeApiUrl,
      );
    });
  });
});
