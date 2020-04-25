import * as mongoose from 'mongoose';

import { MessageModel } from './messageModel';

export interface Chat {
  messages: MessageModel[];
  getSingleton: () => void;
}

const { Schema } = mongoose;

export interface ChatModel extends Chat, mongoose.Document { }

const ChatSchema = new Schema<ChatModel>({
  id: Schema.Types.ObjectId,
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
});

export const Chat = mongoose.model<ChatModel>('Chat', ChatSchema);
