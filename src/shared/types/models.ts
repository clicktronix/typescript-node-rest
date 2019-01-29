import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  password: string;
  comparePassword(pwd: string): boolean;
  getJWT(): string;
}
