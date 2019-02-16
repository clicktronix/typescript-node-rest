import { Document } from 'mongoose';

export interface IUser {
  email: string;
  name: string;
  surname: string;
  password: string;
  tokens: string[];
}

export interface IUserModel extends IUser, Document {
  comparePassword(pwd: string): boolean;
  getJWT(): string;
  getRefreshToken(): string | undefined;
}
