import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { reqReporter } from './request-reporter';

export class App {
  constructor(useReporters?: boolean) {
    this.express = express();
    this.config();
    this.headers();
    this.routes();
    this.express.use(function(err, req, res, next) {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });
    if (useReporters) {
      this.express.use(reqReporter);
    }
  }

  public express: express.Application;

  private config(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private headers(): void {
    // Add headers
    this.express.use(function(req, res, next) {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
      );

      // Request headers you wish to allow
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type'
      );

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      // Pass to next layer of middleware
      next();
    });
  }

  private routes(): void {
    // create a new router
    const router = express.Router();

    router.get('/plans', (req: Request, res: Response, next) => {
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

    router.get('/test', (req: Request, res: Response, next) => {
      res.status(400).send('Bad Request');
      next();
    });

    router.use('*', (req: Request, res: Response, next) => {
      if (!res.headersSent) {
        res.status(404).send("Oops! Can't find that");
      }
      next();
    });
    this.express.use('/', router);
  }
}
