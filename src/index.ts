import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import socketIo from 'socket.io';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import serve from 'koa-static';
import logger from 'koa-logger';
import { createServer, Server } from 'http';

import { Socket } from './sockets';
import { router } from './routes';
import { DataBase } from './data';
import { CONFIG } from './config';

class App {
  public httpServer: Server;
  private app: Koa;
  private db: DataBase;
  private socketServer: Socket;

  constructor() {
    this.app = new Koa();
    this.db = new DataBase();
    this.db.connect();
    this.setMiddlewares();
    this.httpServer = createServer(this.app.callback());
    this.socketServer = new Socket(
      socketIo(this.httpServer),
    );
    this.socketServer.connect();
  }

  private setMiddlewares() {
    this.app
      .use(helmet())
      .use(cors())
      .use(bodyParser())
      .use(router.routes())
      .use(router.allowedMethods())
      .use(logger())
      .use(serve('public'));
  }
}

export { App };
export const app = new App().httpServer.listen(
  CONFIG.port,
  () => console.info(`Server is listening on port ${CONFIG.port}`),
);
