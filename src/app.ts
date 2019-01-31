import { default as Koa } from 'koa';
import { default as bodyParser } from 'koa-bodyparser';
import { default as logger } from 'koa-logger';
import { default as mongoose } from 'mongoose';
import { default as chalk } from 'chalk';

import { CONFIG } from './config';
import { router } from './routes';

class App {
  public app: Koa;
  private mongoUrl = 'mongodb://' + CONFIG.db_user + ':' + CONFIG.db_password + '@'
    + CONFIG.db_host + ':' + CONFIG.db_port + '/' + CONFIG.db_name;
  private mongoOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
  };

  constructor() {
    this.app = new Koa();
    this.setMiddlewares();
    this.dbConnect();
  }

  private setMiddlewares(): void {
    this.app.use(bodyParser());
    this.app.use(router.routes()).use(router.allowedMethods());
    this.app.use(logger());
  }

  private dbConnect(): void {
    mongoose.connect(this.mongoUrl, this.mongoOptions);
    mongoose.connection.on('error', (err) => {
      console.error(err);
      console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
      process.exit();
    });
  }
}

export { App };
export default new App().app;
