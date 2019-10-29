import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as R from 'ramda';

import { CONFIG } from 'config';
import { IUserModel } from 'shared/types/models';

const Schema = mongoose.Schema;
const SALT_ROUND = 10;

export const UserSchema = new Schema<IUserModel>({
  id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    match: [/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, 'Email is not valid'],
    required: [true, 'Email is required'],
    trim: true,
    maxlength: [50, 'You have exceeded the maximum email length'],
    minlength: [5, 'Email is too short'],
  },
  password: {
    type: String,
    required: [true, 'Enter password'],
    trim: true,
    minlength: [5, 'Password is too short'],
    select: false,
  },
  tokens: {
    type: [String],
    select: false,
  },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
}, {
  timestamps: true,
  useNestedStrict: true,
  versionKey: false,
},
);

/**
 * Password hash middleware
 */
UserSchema.pre('save', async function () {
  if (!(this as IUserModel).isModified('password')) { return; }
  try {
    const salt = await bcrypt.genSalt(SALT_ROUND);
    const hash = await bcrypt.hash((this as IUserModel).password, salt);
    (this as IUserModel).password = hash;
  } catch (err) {
    return err;
  }
});

/**
 * Helper method for validating user's password
 */
UserSchema.methods.comparePassword = function (pwd: string) {
  return bcrypt.compareSync(pwd, (this as IUserModel).password);
};

/**
 * Get full name method
 */
UserSchema.virtual('fullName').get(function () {
  return (this as IUserModel).name + ' ' + (this as IUserModel).surname;
});

/**
 * Helper method for getting jwt token
 */
UserSchema.methods.getJWT = function () {
  const expirationTime = parseInt(CONFIG.jwt_expiration, 10);
  return 'Bearer ' + jwt.sign({ id: (this as IUserModel)._id }, CONFIG.jwt_encryption, { expiresIn: expirationTime });
};

/**
 * Helper method for getting jwt token
 */
UserSchema.methods.getRefreshToken = function () {
  return R.last(this.tokens);
};

export const User = mongoose.model<IUserModel>('User', UserSchema);
