import { default as express } from 'express';
import { default as session } from 'express-session';
import { default as connectMongo } from 'connect-mongo';
import { default as passport } from 'passport';
import { default as logger } from 'morgan';
import { default as cors } from 'cors';
import { default as mongoose } from 'mongoose';
import { default as chalk } from 'chalk';
import { default as errorHandler } from 'errorhandler';
import * as bodyParser from 'body-parser';

import { CONFIG } from 'config';
import { router } from 'routes';

class App {
  public app: express.Application;
  private corsOptions: cors.CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    credentials: true,
    methods: 'GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE',
    preflightContinue: true,
    optionsSuccessStatus: 200,
  };
  private mongoUrl = 'mongodb://' + CONFIG.db_user + ':' + CONFIG.db_password + '@'
    + CONFIG.db_host + ':' + CONFIG.db_port + '/' + CONFIG.db_name;
  private mongoOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
  };

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.dbConnect();
    this.catchErrors();
  }

  private setMiddlewares(): void {
    this.app.set('host', CONFIG.host);
    this.app.set('port', CONFIG.port);
    const MongoStore = connectMongo(session);
    this.app.use(logger('dev'));
    this.app.use(cors(this.corsOptions));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use('/', router);

    this.app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: '123123',                     // session secret key
      cookie: { maxAge: 1209600000 },       // two weeks in milliseconds
      store: new MongoStore({
        url: this.mongoUrl,
        autoReconnect: true,
      }),
    }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private dbConnect(): void {
    mongoose.connect(this.mongoUrl, this.mongoOptions);
    mongoose.connection.on('error', (err) => {
      console.error(err);
      console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
      process.exit();
    });
  }

  private catchErrors(): void {
    if (CONFIG.app === 'dev') {
      this.app.use(errorHandler());
    }
  }
}

export default new App().app;
