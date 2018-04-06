import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';

class App {
  constructor() {
    this.app = express();
    this.config();
    this.headers();
    this.routes();
  }

  public app: express.Application;

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private headers(): void {
    // Add headers
    this.app.use(function(req, res, next) {
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

    router.get('/plans', (req: Request, res: Response) => {
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
    });

    router.post('/', (req: Request, res: Response) => {
      const data = req.body;
      // query a database and save data
      res.status(200).send(data);
    });

    this.app.use('/', router);
  }
}

export default new App().app;
