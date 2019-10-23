import { default as socketIo } from 'socket.io';

import { Chat, Message } from 'models';
import { IMessageRequest } from 'shared/types/models';

export default class ChatController {
  constructor(private socket: socketIo.Socket) { }

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
      this.socket.emit('message', data);
    } catch (err) {
      return this.handleError(err);
    }
  }

  public handleDisconnect() {
    console.log('Client disconnected');
  }

  private handleError(err: Error) {
    this.socket.emit('error', err);
  }
}
