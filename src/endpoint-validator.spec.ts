import * as colors from 'colors';
import { EndPointValidator } from './endpoint-validator';

const stripAnsi = require('strip-ansi');

describe('EndPointValidator', () => {
  describe('isArrayResponse', () => {
    it('should return true for array responses', () => {
      expect(EndPointValidator.isArrayResponse('body[0]')).toEqual(true);
    });

    it('should return false for non-array responses', () => {
      expect(
        EndPointValidator.isArrayResponse('definitely_not_an_array'),
      ).toEqual(false);
    });
  });

  describe('getArrayIndex', () => {
    it('should return integer array indices', () => {
      expect(EndPointValidator.getArrayIndex('body[0]')).toEqual(0);
    });

    it('should handle very large integer array indices', () => {
      expect(
        EndPointValidator.getArrayIndex('niceArray[123456789123456]'),
      ).toEqual(123456789123456);
    });
  });

  describe('outputFormattedPath', () => {
    it('should correctly log out successful validation passes', () => {
      spyOn(console, 'log');
      EndPointValidator.outputFormattedPath('get', '/potatoes', 200, 'OK');
      expect(console.log).toHaveBeenCalledWith(
        'GET /potatoes: 200 - no problems found',
      );
    });

    it('should correctly log out failed validation passes', () => {
      spyOn(console, 'log');
      EndPointValidator.outputFormattedPath(
        'get',
        '/potatoes',
        200,
        'OK',
        false,
        {
          statusCode: 200,
          data: [
            {
              keyword: '',
              dataPath: '',
              schemaPath: '',
              params: [],
            },
          ],
          name: '',
          message: '',
        },
      );
      expect(console.log).toHaveBeenCalledWith(
        'GET /potatoes: 200 - 1 problems found:',
      );
    });

    it('should correctly log out 4xx & 5xx path request failures', () => {
      spyOn(console, 'log');
      EndPointValidator.outputFormattedPath(
        'get',
        '/potatoes',
        404,
        'Not Found',
        true,
      );
      expect(console.log).toHaveBeenCalledWith(
        'GET /potatoes: 404 - Not Found',
      );
    });
  });
});
