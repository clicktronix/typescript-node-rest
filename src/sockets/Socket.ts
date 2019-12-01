import { default as socketIo } from 'socket.io';
import { ChatSocket } from './ChatSocket';
import { SOCKET_CONNECT } from './constants';

export class Socket {
  private chatSocket: ChatSocket = new ChatSocket(this.io);

  constructor(private io: socketIo.Server) { }

  public connect() {
    this.io.on(SOCKET_CONNECT, this.chatSocket.connect);
  }
}
