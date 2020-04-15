import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import socketIo from 'socket.io';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import serve from 'koa-static';
import logger from 'koa-logger';

import { Socket } from './sockets';
import { router } from './routes';
import { DataBase } from './data';
import { CONFIG } from './config';

class App {
  public app: Koa;
  private db: DataBase;
  private socketServer: Socket;

  constructor() {
    this.app = new Koa();
    this.db = new DataBase();
    this.socketServer = new Socket(socketIo(this.app));
    this.socketServer.connect();
    this.db.connect();
    this.setMiddlewares();
  }

  private setMiddlewares() {
    this.app
      .use(helmet())
      .use(cors())
      .use(bodyParser())
      .use(serve('../public'))
      .use(router.routes())
      .use(router.allowedMethods())
      .use(logger());
  }
}

export { App };
export const app = new App().app.listen(
  CONFIG.port,
  () => console.info(`Server is listening on port ${CONFIG.port}`),
);
