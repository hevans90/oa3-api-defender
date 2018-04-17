import * as colors from 'colors';
import {
  ErrorObject,
  AdditionalPropertiesParams,
  RequiredParams,
  TypeParams
} from 'ajv';
import { Keyword } from './keyword';

export interface ErrorFormat {
  message: string;
  prefix: string;
  suffix?: string;
}

export class ErrorFormatter {
  public static formatError = (errorData: ErrorObject): ErrorFormat => {
    let prefix = '';
    let suffix: string | undefined;

    errorData.dataPath = errorData.dataPath
      .split('.')
      .filter(String)
      .join('.');

    switch (errorData.keyword) {
      case Keyword.additionalProperties: {
        prefix = errorData.dataPath;
        suffix = (errorData.params as AdditionalPropertiesParams)
          .additionalProperty;
        errorData.message += ':';
        break;
      }
      case Keyword.type: {
        prefix = errorData.dataPath;
        errorData.message = `should be ${
          (errorData.params as TypeParams).type
        } (currently ${colors.red.bold(typeof errorData.data)})`;

        break;
      }
      case Keyword.required: {
        prefix = errorData.dataPath;
        errorData.message = 'should have required property:';
        suffix = (errorData.params as RequiredParams).missingProperty;
        break;
      }
      default: {
        prefix = errorData.dataPath;
      }
    }

    function formatPrefix(pre: string | undefined): string {
      return pre ? colors.red.bold(pre) : '';
    }

    function formatSuffix(suf: string | undefined): string {
      return suf ? colors.red.bold(suf) : '';
    }

    const formattedError: ErrorFormat = {
      message: `${formatPrefix(prefix)} - ${errorData.message} ${formatSuffix(
        suffix
      )}`,
      prefix: prefix,
      suffix: suffix
    };

    return formattedError;
  };
}
