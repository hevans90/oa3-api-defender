import { ErrorFormatter } from './error-formatter';
import { ErrorObject } from 'ajv';
import * as colors from 'colors';

const mockReqError: ErrorObject = {
  keyword: 'required',
  dataPath: '.body[0]',
  params: { missingProperty: 'missing_prop' },
  schemaPath: ''
};

const mockTypeError: ErrorObject = {
  keyword: 'type',
  dataPath: '.body[0].object1',
  data: 'STRING',
  params: { type: 'integer' },
  schemaPath: ''
};

const mockAdditionalPropsError: ErrorObject = {
  keyword: 'additionalProperties',
  dataPath: '.body',
  message: 'should NOT have additional properties',
  params: { additionalProperty: 'i_shouldnt_be_here' },
  schemaPath: ''
};

const splitter = (dataPath: string) => dataPath.split('.');

describe('ErrorFormatter', () => {
  describe('formatError', () => {
    it('should format additionalProperties errors correctly', () => {
      const formatted = ErrorFormatter.formatError(mockAdditionalPropsError);

      expect(formatted.prefix).toEqual('body');
      expect(formatted.message).toEqual(
        `${colors.red.bold(
          'body'
        )} - should NOT have additional properties: ${colors.red.bold(
          'i_shouldnt_be_here'
        )}`
      );
      expect(formatted.suffix).toEqual('i_shouldnt_be_here');
    });

    it('should format type errors correctly', () => {
      const formatted = ErrorFormatter.formatError(mockTypeError);

      expect(formatted.prefix).toEqual('body[0].object1');
      expect(formatted.message.trim()).toEqual(
        `${colors.red.bold(
          'body[0].object1'
        )} - should be integer (currently ${colors.red.bold('string')})`
      );
      expect(formatted.suffix).toBeUndefined();
    });

    it('should format required errors correctly', () => {
      const formatted = ErrorFormatter.formatError(mockReqError);

      expect(formatted.prefix).toEqual('body[0]');
      expect(formatted.message.trim()).toEqual(
        `${colors.red.bold(
          'body[0]'
        )} - should have required property: ${colors.red.bold('missing_prop')}`
      );
      expect(formatted.suffix).toEqual('missing_prop');
    });
  });
});
