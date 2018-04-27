import { OperationConfig } from './operation-config';
import { ParameterObject } from 'express-openapi-validate/dist/OpenApiDocument';
import * as Debug from 'debug';
import * as qString from 'query-string';

const debug = Debug('oa3-def');

export class ParamParser {
  /**
   * Takes a path and it's associated OperationConfig, and generates a paramaterised
   * path from examples in the spec
   */
  public static generateParamaterisedPath(
    path: string,
    opConfig: OperationConfig,
  ): string {
    let paramPath = path.slice();
    let pathParams: ParameterObject[] = [];
    let queryParams: ParameterObject[] = [];
    const queryParamsDictionary = {};

    if (opConfig.config.parameters) {
      pathParams = opConfig.config.parameters.filter(
        param => param.in === 'path',
      );
      queryParams = opConfig.config.parameters.filter(
        param => param.in === 'query',
      );
    }

    pathParams.forEach(param => {
      if (param.example !== undefined) {
        paramPath = paramPath.replace(`{${param.name}}`, param.example);
        debug(
          `\nFound example path param (${param.name} : ${
            param.example
          }) for: ${paramPath}`,
        );
        debug(`Modified path to: ${paramPath}`);
      }
    });

    queryParams.forEach(param => {
      if (param.example !== undefined) {
        queryParamsDictionary[`${param.name}`] = param.example;
        debug(
          `Found example query string param (${param.name}: ${
            param.example
          }) for: ${paramPath}`,
        );
      }
    });

    if (Object.keys(queryParamsDictionary).length) {
      paramPath += `?${qString.stringify(queryParamsDictionary)}`;
      debug(`Modified path to: ${paramPath}`);
    }

    return paramPath;
  }
}
