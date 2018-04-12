import { ErrorFormatter } from './error-formatter';
import { ErrorObject } from 'ajv';

const mockReqError: ErrorObject = {
  keyword: 'required',
  dataPath: '.body[0]',
  params: [],
  schemaPath: ''
};

const mockTypeError: ErrorObject = {
  keyword: 'type',
  dataPath: '.body[0].object1',
  params: [],
  schemaPath: ''
};

const mockAdditionalPropsError: ErrorObject = {
  keyword: 'additionalProperties',
  dataPath: '.body',
  params: [],
  schemaPath: ''
};

const mockDeepError: ErrorObject = {
  keyword: '',
  dataPath: '.body.ob1.obj2.obj3',
  params: [],
  schemaPath: ''
};

const splitter = (dataPath: string) => dataPath.split('.');

describe('ErrorFormatter', () => {
  describe('formatError', () => {
    it('should', () => {
      ///
    });
  });
});
