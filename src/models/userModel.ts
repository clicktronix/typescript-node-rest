import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import R from 'ramda';

import { CONFIG } from 'config';

import { MessageModel } from './messageModel';

export type User = {
  email: string;
  name: string;
  surname: string;
  password: string;
  tokens: string[];
  messages: MessageModel[];
};

export type UserModel = User & mongoose.Document & {
  comparePassword(pwd: string): boolean;
  getJWT(): string;
  getRefreshToken(): string | undefined;
};

const { Schema } = mongoose;
const SALT_ROUND = 10;

const UserSchema = new Schema<UserModel>(
  {
    id: Schema.Types.ObjectId,
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      default: 'Name',
    },
    surname: {
      type: String,
      required: [true, 'Surname is required'],
      trim: true,
      default: 'Surname',
    },
    email: {
      type: String,
      unique: true,
      match: [/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/, 'Email is not valid'],
      required: [true, 'Email is required'],
      trim: true,
      maxlength: [50, 'You have exceeded the maximum email length'],
      minlength: [5, 'Email is too short'],
      default: 'email@gmail.com',
    },
    password: {
      type: String,
      required: [true, 'Enter password'],
      trim: true,
      minlength: [5, 'Password is too short'],
      select: false,
      default: 'password',
    },
    tokens: {
      type: [String],
      select: false,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  {
    timestamps: true,
    useNestedStrict: true,
    versionKey: false,
  },
);

/**
 * Password hash middleware
 */
UserSchema.pre<UserModel>('save', async function hashMiddleware() {
  if (!this.isModified('password')) {
    return;
  }
  try {
    const salt = await bcrypt.genSalt(SALT_ROUND);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  } catch (err) {
    return err;
  }
});

UserSchema.methods.comparePassword = function comparePassword(pwd: string) {
  return bcrypt.compareSync(pwd, (this as UserModel).password);
};

UserSchema.methods.getJWT = function getJWT() {
  const expirationTime = parseInt(CONFIG.jwt_expiration, 10);
  return `Bearer ${jwt.sign({ id: (this as UserModel)._id }, CONFIG.jwt_encryption, { expiresIn: expirationTime })}`;
};

UserSchema.methods.getRefreshToken = function getRefreshToken() {
  return R.last((this as UserModel).tokens);
};

export const userSwaggerSchema = {
  name: { type: 'string', example: 'Name' },
  surname: { type: 'string', example: 'Surname' },
  email: { type: 'string', example: 'email@gmail.com', required: true },
  password: { type: 'string', example: 'password' },
};

export const User = mongoose.model<UserModel>('User', UserSchema);
