import socketIo from 'socket.io';
import { autobind } from 'core-decorators';

import { Chat, Message } from '../models';
import { SOCKET_MESSAGE, SOCKET_ERROR } from './constants';

export class ChatSocket {
  constructor(private io: socketIo.Server) { }

  @autobind
  public async connect(socket: socketIo.Socket) {
    socket.on(SOCKET_MESSAGE, this.handleMessage);
    try {
      await this.checkChatExisting();
    } catch (error) {
      this.handleError(error.message);
    }
  }

  @autobind
  public async handleMessage(data: Message) {
    const { sender, content } = data;
    if (!content) {
      this.handleError('Please enter a message');
      return;
    }
    try {
      const chat = await Chat.find({ type: 'main-chat' });
      if (!chat) {
        this.handleError('Chat not found');
        return;
      }
      chat[0].messages.push(
        new Message({
          content,
          sender,
        }),
      );
      await chat[0].save();
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
      const isChatExist = await Chat.exists({ type: 'main-chat' });
      if (!isChatExist) {
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
