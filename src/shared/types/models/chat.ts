import { Document } from 'mongoose';
import { IMessageModel } from './message';

export interface IChat {
  messages: IMessageModel[];
}

export interface IChatModel extends IChat, Document { }
