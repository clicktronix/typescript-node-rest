import { default as express } from 'express';
import { default as mongoose } from 'mongoose';
import { default as logger } from 'morgan';
import { default as passport } from 'passport';
import * as bodyParser from 'body-parser';

import { CONFIG } from './config';
import { Router } from './routes';

class App {
  public app: express.Application;
  public router: Router;
  public mongoUrl: string = 'mongodb://' + CONFIG.db_user + ':' + CONFIG.db_password + '@'
    + CONFIG.db_host + ':' + CONFIG.db_port + '/' + CONFIG.db_name;

  constructor() {
    this.app = express();
    this.expressConfig();
    this.router = new Router(this.app);
    this.mongoSetup();
  }

  private expressConfig(): void {
    this.app.use(logger('dev'));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(passport.initialize());
  }

  private mongoSetup(): void {
    mongoose.set('debug', true);
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useCreateIndex: true });
  }
}

process.on('unhandledRejection', error => {
  console.error('Uncaught Error', error);
});

export default new App().app;
