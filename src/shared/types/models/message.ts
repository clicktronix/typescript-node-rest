import { Document } from 'mongoose';
import { IUserModel } from './user';

export interface IMessage {
  content: string;
  sender: IUserModel;
  owner: IUserModel;
}

export interface IMessageModel extends IMessage, Document { }
