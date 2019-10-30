import * as ioClient from 'socket.io-client';
import { default as socketIo } from 'socket.io';
import { expect } from 'chai';

import { CONFIG } from 'config';
import { Socket } from 'sockets';
import { default as app } from '../src';

const agent = require('supertest-koa-agent');
const socketUrl: string = `http://localhost:${CONFIG.port}`;
const options: SocketIOClient.ConnectOpts = {
  transports: ['websocket'],
};

describe('Socket server', () => {
  let server: any;
  let io: SocketIO.Server;
  let socket: Socket;
  let client: SocketIOClient.Socket;

  beforeEach(() => {
    server = agent(app);
    io = socketIo(server);
    socket = new Socket(io);
    socket.connect();
    client = ioClient.connect(socketUrl, options);
  });

  afterEach(() => {
    server.app.close();
    client.close();
  });

  describe('Connect', () => {
    it('Should connect socket', async () => {
      client.on('connect', () => {
        expect(client.connected).to.equal(true);
        client.disconnect();
      });
    });
  });

  describe('Message', () => {
    it('Should connect socket', async () => {
      client.emit('message', {
        message: 'test message',
      });
      client.on('message', () => {
        expect(client.connected).to.equal(true);
        client.disconnect();
      });
    });
  });
});
