import { default as Koa } from 'koa';
import { default as bodyParser } from 'koa-bodyparser';

import { router } from './routes';
import { DataBase } from './data';

class App {
  public app: Koa;
  private db: DataBase;

  constructor() {
    this.app = new Koa();
    this.db = new DataBase();
    this.setMiddlewares();
    this.db.connect();
  }

  private setMiddlewares(): void {
    this.app.use(bodyParser());
    this.app.use(router.routes()).use(router.allowedMethods());
  }
}

export { App };
export default new App().app;
