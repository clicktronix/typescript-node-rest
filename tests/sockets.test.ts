// import { default as ioClient } from 'socket.io-client';
// import { default as socketIo } from 'socket.io';
// import { expect } from 'chai';

// import { Socket } from 'sockets';

// const socketUrl: string = `http://localhost:${8000}`;
// const options: SocketIOClient.ConnectOpts = {
//   transports: ['websocket'],
//   forceNew: true,
//   reconnectionDelay: 0,
//   autoConnect: false,
// };

// describe('Socket server', () => {
//   let server: socketIo.Server;
//   let socket: Socket;
//   let client: SocketIOClient.Socket;

//   beforeEach(() => {
//     server = socketIo().listen(8000);
//     socket = new Socket(server);
//     socket.connect();
//     client = ioClient.connect(socketUrl, options);
//   });

//   afterEach(() => {
//     server.close();
//     client.close();
//   });

//   describe('Connect', () => {
//     it('Should connect socket', (done) => {
//       client.on('connect', () => {
//         expect(client.connected).to.equal(true);
//         done();
//       });
//     });
//   });
// });
