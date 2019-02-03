import { Document } from 'mongoose';

export interface IUser {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface IUserModel extends IUser, Document {
  comparePassword(pwd: string): boolean;
  getJWT(): string;
}
