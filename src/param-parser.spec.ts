import { OperationConfig } from './operation-config';
import { ParamParser } from './param-parser';

const mockEmptyConfig: OperationConfig = {
  operation: 'get',
  config: {
    responses: '',
  },
};

const mockFullConfig: OperationConfig = {
  operation: 'get',
  config: {
    responses: '',
    parameters: [
      {
        name: 'id',
        in: 'path',
        example: 0,
      },
      {
        name: 'hipster',
        in: 'query',
        example: true,
      },
    ],
  },
};

describe('ParamParser', () => {
  describe('generateParamaterisedPath', () => {
    it('should NOT modify paths without paramaters', () => {
      expect(
        ParamParser.generateParamaterisedPath('nice_path_bro', mockEmptyConfig),
      ).toEqual('nice_path_bro');
    });

    it('should correctly modify paths with path & query paramaters', () => {
      expect(
        ParamParser.generateParamaterisedPath(
          'beard_styles/{id}',
          mockFullConfig,
        ),
      ).toEqual('beard_styles/0?hipster=true');
    });
  });
});
