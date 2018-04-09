import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from './_base-route';

export class PlansRoute extends BaseRoute {
  public static create(router: Router) {
    router.get('/plans', (req: Request, res: Response, next: NextFunction) => {
      res.status(200).send([
        {
          id: 0,
          name: 'Classic',
          description: 'Our most popular option',
          annualMembershipPrice: {
            amount: 5.35,
            currencyCode: 'GBP'
          },
          monthlyMembershipPrice: {
            amount: 5.35,
            currencyCode: 'GBP'
          },
          promoCode: 'EARLYBIRD',
          totalCost: {
            amount: 5.35,
            currencyCode: 'GBP'
          }
        }
      ]);
      next();
    });
  }
}
