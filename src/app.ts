import { default as express } from 'express';
import { default as logger } from 'morgan';
import { default as passport } from 'passport';
import { default as cors } from 'cors';
import * as bodyParser from 'body-parser';

import { BaseRouter as Router } from './routes';
import * as errorHandler from './shared/helpers/errorHandler';
import { checkUserToken } from './middlewares/checkUserToken';

class App {
  public app: express.Application;
  public router: Router;
  private corsOptions: cors.CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    credentials: true,
    methods: 'GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE',
    preflightContinue: true,
    optionsSuccessStatus: 200,
  };

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.router = new Router();
    this.catchErrors();
  }

  private setMiddlewares(): void {
    this.app.use(logger('dev'));
    this.app.use(cors(this.corsOptions));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(passport.initialize());
    checkUserToken(passport);
  }

  private catchErrors(): void {
    this.app.use(errorHandler.notFound);
    this.app.use(errorHandler.internalServerError);
  }
}

export default new App().app;
