import { NextFunction, Request, Response, Router } from 'express';

export abstract class BaseRoute {
  public static create(router: Router, path: string) {
    router.get(
      `/${path}`,
      (req: Request, res: Response, next: NextFunction) => {
        res.status(200).send(`/${path} works!`);
      }
    );
  }
}
