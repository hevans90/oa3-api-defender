import { EndPointValidator } from './endpoint-validator';

describe('EndPointValidator', () => {
  describe('isArrayResponse', () => {
    it('should return true for array responses', () => {
      expect(EndPointValidator.isArrayResponse('body[0]')).toEqual(true);
    });

    it('should return false for non-array responses', () => {
      expect(
        EndPointValidator.isArrayResponse('definitely_not_an_array')
      ).toEqual(false);
    });
  });

  describe('getArrayIndex', () => {
    it('should return integer array indices', () => {
      expect(EndPointValidator.getArrayIndex('body[0]')).toEqual(0);
    });

    it('should handle very large integer array indices', () => {
      expect(
        EndPointValidator.getArrayIndex('niceArray[123456789123456]')
      ).toEqual(123456789123456);
    });
  });
});
