import { expect } from 'chai';
import ioClient from 'socket.io-client';
import ioServer from 'socket.io';

import { Socket } from '../sockets';
import { Message } from '../models';
import { CONFIG } from '../config';
import { SOCKET_MESSAGE, SOCKET_ERROR, SOCKET_CONNECT } from '../sockets/constants';

const messageRequest = {
  content: 'message',
  sender: 'userEmail@gmail.com',
};

describe('Socket module', () => {
  let server: ioServer.Server;
  let socket: Socket;
  let client: SocketIOClient.Socket;

  beforeEach(() => {
    server = ioServer.listen(CONFIG.test_socket_port);
    socket = new Socket(server);
    socket.connect();
    client = ioClient.connect(`http://localhost:${CONFIG.test_socket_port}`, {
      transports: ['websocket'],
      forceNew: true,
    });
  });

  afterEach(() => {
    server.close();
    client.close();
  });

  it('Socket client should be connected', (done) => {
    client.on(SOCKET_CONNECT, () => {
      expect(client.connected).to.equal(true);
      done();
    });
  });

  it('Should send message for client', (done) => {
    client.on(SOCKET_CONNECT, () => {
      client.on(SOCKET_MESSAGE, (req: Message) => {
        expect(req).to.deep.equal({
          content: 'message',
          sender: 'userEmail@gmail.com',
        });
        done();
      });

      client.emit(SOCKET_MESSAGE, messageRequest);
    });
  });

  it('Should send error for client if message does not exist', (done) => {
    client.on(SOCKET_CONNECT, () => {
      client.on(SOCKET_ERROR, (req: string) => {
        expect(req).to.be.an('string');
        done();
      });

      client.emit(SOCKET_MESSAGE, {
        ...messageRequest,
        content: '',
      });
    });
  });
});
