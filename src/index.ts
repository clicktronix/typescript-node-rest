import { default as Koa } from 'koa';
import { default as bodyParser } from 'koa-bodyparser';
import { default as socketIo } from 'socket.io';

import { router } from './routes';
import { DataBase } from './data';
import { CONFIG } from './config';
import ChatController from 'controllers/ChatController';

class App {
  public app: Koa;
  private db: DataBase;
  private io: socketIo.Server;

  constructor() {
    this.app = new Koa();
    this.db = new DataBase();
    this.io = socketIo(this.app);
    this.listening();
    this.db.connect();
    this.setMiddlewares();
  }

  private setMiddlewares() {
    this.app.use(bodyParser());
    this.app.use(router.routes()).use(router.allowedMethods());
  }

  private listening() {
    this.app.listen(CONFIG.port, () => console.log(`Server is listening on port ${CONFIG.port}`));

    this.io.on('connect', (socket: socketIo.Socket) => {
      console.log('Connected client on port ', CONFIG.port);
      const chatController = new ChatController(socket);

      socket.on('message', chatController.handleMessage);
      socket.on('disconnect', chatController.handleDisconnect);
    });
  }
}

export { App };
export default new App().app;
