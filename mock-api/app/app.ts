import * as express from 'express';
import * as bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';
import { reqReporter } from './middleware/request-reporter';
import { headers } from './middleware/headers';
import { PlansRoute } from './routes/plans';

export class App {
  constructor(useReporters?: boolean) {
    this.express = express();
    this.config();
    this.headers();
    this.routes();
    this.express.use(function(
      err,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
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
    this.express.use(headers);
  }

  private routes(): void {
    // create a new router
    const router = express.Router();

    // add routes here
    PlansRoute.create(router);

    // 404 catch, hits any un-resolved routes
    router.use('*', (req: Request, res: Response, next: NextFunction) => {
      if (!res.headersSent) {
        res.status(404).send("Oops! Can't find that");
      }
      next();
    });
    this.express.use('/', router);
  }
}
