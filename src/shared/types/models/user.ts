import { Document } from 'mongoose';
import { IMessageModel } from './message';

export interface IUser {
  email: string;
  name: string;
  surname: string;
  password: string;
  tokens: string[];
  messages: IMessageModel[];
}

export interface IUserModel extends IUser, Document {
  comparePassword(pwd: string): boolean;
  getJWT(): string;
  getRefreshToken(): string | undefined;
}
