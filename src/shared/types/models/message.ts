import { Document } from 'mongoose';
import { IUserModel } from './user';

export interface IMessage {
  content: string;
  user: IUserModel;
}

export interface IMessageModel extends IMessage, Document { }
