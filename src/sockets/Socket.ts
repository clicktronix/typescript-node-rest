import { default as socketIo } from 'socket.io';

import { Chat, Message } from 'models';
import { IMessageRequest } from 'shared/types/models';
import { bind } from 'decko';

export class Socket {
  constructor(private io: socketIo.Server) { }

  public connect() {
    this.io.of('/chat').on('connect', (socket: socketIo.Socket) => {
      socket.on('message', this.handleMessage);
      socket.on('disconnect', this.handleDisconnect);
    });
  }

  @bind
  public async handleMessage(data: IMessageRequest) {
    const { chatId, message } = data;
    if (!chatId || !message) {
      return this.handleError(new Error('Please enter a name and message'));
    }
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return this.handleError(new Error('Chat not found'));
      }
      chat.messages.push(new Message(message));
      await chat.save();
      this.io.emit('message', data);
    } catch (err) {
      return this.handleError(err);
    }
  }

  @bind
  public handleDisconnect() {
    console.log('Client disconnected');
  }

  private handleError(err: Error) {
    this.io.emit('error', err);
  }
}
