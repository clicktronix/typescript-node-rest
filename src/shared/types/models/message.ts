import { Document } from 'mongoose';
import { IUserModel } from './user';
import { IChatModel } from './chat';

export interface IMessage {
  content: string;
  sender: IUserModel;
  owner: IUserModel | IChatModel;
}

export interface IMessageRequest {
  chatId: string;
  message: IMessage;
}

export interface IMessageModel extends IMessage, Document { }
