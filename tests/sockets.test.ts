// import * as ioClient from 'socket.io-client';
// import { default as socketIo } from 'socket.io';
// import { expect } from 'chai';
// import supertest from 'supertest';

// import { CONFIG } from 'config';
// import { Socket } from 'sockets';
// // import { IMessageRequest } from 'models';
// import app from '../src';

// const socketUrl: string = `http://localhost:${CONFIG.port}`;
// const options: SocketIOClient.ConnectOpts = {
//   transports: ['websocket'],
//   forceNew: true,
//   reconnectionDelay: 0,
//   autoConnect: false,
// };

// describe('Socket server', () => {
//   let server: any;
//   let io: SocketIO.Server;
//   let socketServer: Socket;
//   let socketClient: SocketIOClient.Socket;

//   beforeEach(() => {
//     server = supertest(app);
//     io = socketIo(server);
//     socketServer = new Socket(io);
//     socketServer.connect();
//     socketClient = ioClient.connect(socketUrl, options);
//   });

//   afterEach(() => {
//     if (socketClient.connected) {
//       socketClient.disconnect();
//     } else {
//       console.log('No connection to break...');
//     }
//   });

//   describe('Connect', () => {
//     it('Should connect socket', (done) => {
//       socketClient.on('connect', () => {
//         expect(socketClient.connected).to.equal(true);
//         done();
//       });
//     });
//   });

//   // describe('Message', () => {
//   //   it('Should set the message and receive it back', (done) => {
//   //     socketClient.on('connect', () => {
//   //       socketClient.on('message', (data: IMessageRequest) => {
//   //         expect(data.message).to.equal('test');
//   //         done();
//   //       });
//   //       socketClient.emit('message', {
//   //         message: 'test message',
//   //       });
//   //     });
//   //   });
//   // });
// });
