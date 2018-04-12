import * as colors from 'colors';
import { ErrorObject, AdditionalPropertiesParams, RequiredParams } from 'ajv';
import { Keyword } from './keyword';

export class ErrorFormatter {
  public static formatError = (errorData: ErrorObject): string => {
    let prefix: string | undefined;
    let suffix: string | undefined;
    const dataPathArray = errorData.dataPath.split('.');
    const parentObjDescription = ErrorFormatter.getParentObjDescription(
      dataPathArray
    );

    switch (errorData.keyword) {
      case Keyword.additionalProperties: {
        prefix = parentObjDescription;
        suffix = (errorData.params as AdditionalPropertiesParams)
          .additionalProperty;
        errorData.message += ':';
        break;
      }
      case Keyword.required: {
        prefix = parentObjDescription;
        errorData.message = 'should have required property:';
        suffix = (errorData.params as RequiredParams).missingProperty;
        break;
      }
      default: {
        if (dataPathArray.pop()) {
          prefix = dataPathArray.pop();
        }
      }
    }

    function formatPrefix(pre: string | undefined): string {
      return pre ? colors.red.bold(pre) : '';
    }

    function formatSuffix(suf: string | undefined): string {
      return suf ? colors.red.bold(suf) : '';
    }

    return `${formatPrefix(prefix)} - ${errorData.message} ${formatSuffix(
      suffix
    )}\n`;
  };

  public static getParentObjDescription(dataPathArr: string[]): string {
    const len = dataPathArr.length;
    const parentObject: string | null = len > 1 ? dataPathArr[len - 1] : null;

    if (parentObject && parentObject.includes('body')) {
      return '{ ResponseBody }';
    } else if (parentObject) {
      return `{ ${parentObject} }`;
    } else {
      return '<No Parent Object Found>';
    }
  }
}
