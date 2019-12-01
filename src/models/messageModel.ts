import * as mongoose from 'mongoose';
import { IUserModel } from './userModel';
import { IChatModel } from './chatModel';

export interface IMessage {
  content: string;
  sender: IUserModel;
  owner: IUserModel | IChatModel;
}

const Schema = mongoose.Schema;

const MessageSchema = new Schema<IMessageModel>({
  id: Schema.Types.ObjectId,
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel',
  },
  sender: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel',
  },
  onModel: {
    type: String,
    required: true,
    enum: ['User', 'Chat'],
  },
});

export interface IMessageModel extends IMessage, mongoose.Document { }
export const Message = mongoose.model<IMessageModel>('Message', MessageSchema);
