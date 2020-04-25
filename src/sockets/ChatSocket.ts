import socketIo from 'socket.io';
import { autobind } from 'core-decorators';

import { Chat, Message } from 'models';

import { SOCKET_MESSAGE, SOCKET_ERROR } from './constants';

export class ChatSocket {
  constructor(private io: socketIo.Server) { }

  @autobind
  public async connect(socket: socketIo.Socket) {
    socket.on(SOCKET_MESSAGE, this.handleMessage);
    this.checkChatExisting();
  }

  @autobind
  public async handleMessage(data: Message) {
    const { sender, content } = data;
    if (!content) {
      this.handleError('Please enter a message');
      return;
    }
    try {
      const chat = await Chat.findOne();
      if (!chat) {
        this.handleError('Chat not found');
        return;
      }
      chat.messages.push(
        new Message({
          content,
          sender,
        }),
      );
      await chat.save();
      this.io.emit('message', data);
    } catch (error) {
      this.handleError(error.message);
    }
  }

  private handleError(error: string) {
    this.io.emit(SOCKET_ERROR, error);
  }

  private async checkChatExisting() {
    try {
      if (!await Chat.exists({})) {
        const chat = new Chat({
          messages: [],
        });
        await chat.save();
      }
      return;
    } catch (error) {
      this.handleError(error.message);
    }
  }
}
