import { expect } from 'chai';
import { default as ioClient } from 'socket.io-client';
import { default as ioServer } from 'socket.io';

import { Socket } from 'sockets';
import { IMessage } from 'models';

const messageRequest = {
  content: 'message',
  owner: 'userEmail@gmail.com',
  sender: 'userEmail@gmail.com',
};

describe('Socket module', () => {
  let server: ioServer.Server;
  let socket: Socket;
  let client: SocketIOClient.Socket;

  beforeEach(() => {
    server = ioServer.listen(3000);
    socket = new Socket(server);
    socket.connect();
    client = ioClient.connect(`http://localhost:${3000}`, {
      transports: ['websocket'],
      forceNew: true,
    });
  });

  afterEach(() => {
    server.close();
    client.close();
  });

  it('Socket client should be connected', (done) => {
    client.on('connect', () => {
      expect(client.connected).to.equal(true);
      done();
    });
  });

  it('Should send message for client', (done) => {
    client.on('connect', () => {
      client.on('message', (req: IMessage) => {
        expect(req).to.deep.equal({
          content: 'message',
          sender: 'userEmail@gmail.com',
          owner: 'userEmail@gmail.com',
        });
        done();
      });

      client.emit('message', messageRequest);
    });
  });
});
