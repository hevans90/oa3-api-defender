import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from './_base-route';

export class PlansRoute extends BaseRoute {
  public static create(router: Router) {
    router.get('/plans', (req: Request, res: Response, next: NextFunction) => {
      // res.status(200).send({ prop1: 'I am a string, not an array' });
      res.status(200).send([
        {
          zid: 0,
          zname: 'Classic',
          zdescription: 'Our most popular option',
          zannualMembershipPrice: {
            amount: 5.35,
            currencyCode: 'GBP'
          },
          zmonthlyMembershipPrice: {
            amount: 5.35,
            currencyCode: 'GBP'
          },
          zpromoCode: 'EARLYBIRD',
          ztotalCost: {
            amount: 5.35,
            currencyCode: 'GBP'
          }
        }
        // 'string bro'
      ]);

      next();
    });
  }
}
