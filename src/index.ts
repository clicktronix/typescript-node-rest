import { default as Koa } from 'koa';
import { default as bodyParser } from 'koa-bodyparser';

import { router } from './routes';
import { DataBase } from './data';
import { CONFIG } from './config';

class App {
  public app: Koa;
  private db: DataBase;

  constructor() {
    this.app = new Koa();
    this.db = new DataBase();
    this.app.listen(CONFIG.port, () => console.log(`Server is listening on ${CONFIG.port}`));
    this.db.connect();
    this.setMiddlewares();
  }

  private setMiddlewares() {
    this.app.use(bodyParser());
    this.app.use(router.routes()).use(router.allowedMethods());
  }
}

export { App };
export default new App().app;
