import { default as express } from 'express';
import { default as mongoose } from 'mongoose';
import * as bodyParser from 'body-parser';

import { Router } from './routes';

class App {
  public app: express.Application;
  public router: Router;
  public mongoUrl: string = 'mongodb://clicktronix:23031994@localhost/roulette-rest';

  constructor() {
    this.app = express();
    this.expressConfig();
    this.router = new Router(this.app);
    this.mongoSetup();
  }

  private expressConfig(): void {
    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // support application/json type post data
    this.app.use(bodyParser.json({ limit: '50mb' }));
  }

  private mongoSetup(): void {
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
  }
}

export default new App().app;
