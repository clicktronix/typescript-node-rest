import { default as Koa } from 'koa';
import { default as bodyParser } from 'koa-bodyparser';
import { default as socketIo } from 'socket.io';

import { Socket } from 'sockets';
import { router } from './routes';
import { DataBase } from './data';
import { CONFIG } from './config';

class App {
  public app: Koa;
  private db: DataBase;
  private io: socketIo.Server;
  private socketServer: Socket;

  constructor() {
    this.app = new Koa();
    this.db = new DataBase();
    this.io = socketIo(this.app);
    this.socketServer = new Socket(this.io);
    this.app.listen(CONFIG.port, () => console.log(`Server is listening on port ${CONFIG.port}`));
    this.socketServer.connect();
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
