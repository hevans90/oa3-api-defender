import { SpecValidator } from './spec-validator';
import * as mock from 'mock-fs';
import { OpenApiDocument } from 'express-openapi-validate';

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
    mock({
      [fakeDir]: {
        [fakeSpecFileName]: fakeSpec,
        'broken-spec.yaml': 'I r brokens'
      }
    });

    specValidator = new SpecValidator(
      `${fakeDir}/${fakeSpecFileName}`,
      fakeApiUrl
    );
  });

  afterEach(() => {
    mock.restore();
  });

  it('should create', () => {
    expect(specValidator).toBeDefined();
  });
  it('should NOT create if spec cannot be found', () => {
    expect(
      () => new SpecValidator(`${fakeDir}/invalid_file_path.yaml`, '')
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
        () => new SpecValidator(`${fakeDir}/broken-spec.yaml`, '')
      ).toThrow();
    });
  });
});
