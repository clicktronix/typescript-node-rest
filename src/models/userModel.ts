import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { NextFunction } from 'express';
import { to } from 'await-to-js';
import { IUser } from 'shared/types/models';
import { CONFIG } from 'config';

const Schema = mongoose.Schema;
const SALT_ROUND = 10;

export const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    match: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },

}, {
    timestamps: true,
    useNestedStrict: true,
  },
);

/**
 * Password hash middleware.
 */
UserSchema.pre('save', async function preSave(next: NextFunction) {
  // tslint:disable-next-line:no-this-assignment
  const user = this;
  if (!user.isModified('password')) { return next(); }
  try {
    await bcrypt.genSalt(SALT_ROUND, (err, salt) => {
      if (err) { return next(err); }
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) { return next(error); }
        user.password = hash;
        next();
      });
    });
  } catch (error) {
    return error;
  }
});

/**
 * Helper method for validating user's password.
 */
UserSchema.methods.comparePassword = async function compare(pwd: string) {
  const [error, isMatch] = await to<boolean, Error>(bcrypt.compare(pwd, this.password));
  if (error) { return error; }
  return isMatch;
};

/**
 * Helper method for getting jwt token.
 */
UserSchema.methods.getJWT = function createToken() {
  const expirationTime = parseInt(CONFIG.jwt_expiration, 10);
  return 'TOKEN' + jwt.sign({ user_id: this._id }, CONFIG.jwt_encryption, { expiresIn: expirationTime });
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
