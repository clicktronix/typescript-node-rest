import { default as socketIo } from 'socket.io';
import { bind } from 'decko';

import { Chat, Message, IMessage } from 'models';

export class ChatSocket {
  constructor(private io: socketIo.Server) { }

  @bind
  public async connect(socket: socketIo.Socket) {
    socket.on('message', this.handleMessage);
    socket.on('disconnect', this.handleDisconnect);
    await this.checkMainChat();
  }

  @bind
  public async handleMessage(data: IMessage) {
    const { sender, owner, content } = data;
    if (!content) {
      this.handleError(new Error('Please enter a message'));
      return;
    }
    try {
      const chat = await Chat.find({ type: 'main' });
      if (!chat) {
        this.handleError(new Error('Chat not found'));
        return;
      }
      chat[0].messages.push(new Message({
        content,
        owner,
        sender,
      }));
      await chat[0].save();
      this.io.emit('message', data);
    } catch (error) {
      this.handleError(error);
    }
  }

  @bind
  public handleDisconnect() {
    console.log('Client disconnected');
  }

  private handleError(error: Error) {
    this.io.emit('error', error);
  }

  private async checkMainChat() {
    try {
      const isChatExist = await Chat.exists({ type: 'main' });
      if (!isChatExist) {
        const chat = new Chat({ type: 'main', messages: [] });
        await chat.save();
      }
      return;
    } catch (error) {
      this.handleError(error);
    }
  }
}
