import { default as socketIo } from 'socket.io';
import { ChatSocket } from './ChatSocket';

export class Socket {
  private chatSocket: ChatSocket = new ChatSocket(this.io);

  constructor(private io: socketIo.Server) { }

  public connect() {
    this.io.on('connect', this.chatSocket.connect);
  }
}
