import { Request, Response } from 'express';
import * as colors from 'colors';

export const reqReporter = (req: Request, res: Response, next): void => {
  console.log(`${statusString(req, res)}`);
  next();
};

const statusString = (req: Request, res: Response): string => {
  function httpVerbWithColor(req: Request, res: Response): string {
    if (res.statusCode.toString().startsWith('4')) {
      return colors.red.bold(req.method);
    } else {
      return colors.green.bold(req.method);
    }
  }

  return `${httpVerbWithColor(req, res)} ${req.path} -- ${res.statusCode} : ${
    res.statusMessage
  }`;
};
