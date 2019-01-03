import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  comparePassword(pwd: string): boolean | Error;
  getJWT(): string;
}
