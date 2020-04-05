import * as mongoose from 'mongoose';

import { IUserModel } from './userModel';

export interface Message {
  content: string;
  sender: IUserModel;
}

const { Schema } = mongoose;

const MessageSchema = new Schema<MessageModel>({
  id: Schema.Types.ObjectId,
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export const messageSwaggerSchema = {
  content: { type: 'string', example: 'Message text' },
  sender: { type: 'string', example: 'sender@gmail.com' },
};

export interface MessageModel extends Message, mongoose.Document { }
export const Message = mongoose.model<MessageModel>('Message', MessageSchema);
