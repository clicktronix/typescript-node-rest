import * as mongoose from 'mongoose';

import { MessageModel } from './messageModel';

export interface Chat {
  messages: MessageModel[];
  type?: 'main-chat' | 'private-chat';
}

const { Schema } = mongoose;

const ChatSchema = new Schema<ChatModel>({
  id: Schema.Types.ObjectId,
  type: {
    type: String,
    default: 'private-chat',
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
});

export interface ChatModel extends Chat, mongoose.Document { }
export const Chat = mongoose.model<ChatModel>('Chat', ChatSchema);
