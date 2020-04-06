import * as mongoose from 'mongoose';

import { MessageModel } from './messageModel';

export interface Chat {
  messages: MessageModel[];
}

const { Schema } = mongoose;

const ChatSchema = new Schema<ChatModel>({
  id: Schema.Types.ObjectId,
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
});

export interface ChatModel extends Chat, mongoose.Document { }
export const Chat = mongoose.model<ChatModel>('Chat', ChatSchema);
