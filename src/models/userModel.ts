import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { CONFIG } from 'config';
import { IUserModel } from 'shared/types/models';

const Schema = mongoose.Schema;
const SALT_ROUND = 10;

export const UserSchema = new Schema<IUserModel>({
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
    maxlength: [50, 'You have exceeded the maximum password length'],
    minlength: [5, 'Password is too short'],
    select: false,
  },
}, {
    timestamps: true,
    useNestedStrict: true,
    versionKey: false,
  },
);

/**
 * Password hash middleware
 */
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) { return; }
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
UserSchema.methods.comparePassword = function(pwd: string) {
  return bcrypt.compareSync(pwd, this.password);
};

/**
 * Get full name method
 */
UserSchema.virtual('fullName').get(function() {
  return this.name.first + ' ' + this.name.last;
});

/**
 * Helper method for getting jwt token
 */
UserSchema.methods.getJWT = function() {
  const expirationTime = parseInt(CONFIG.jwt_expiration, 10);
  return 'TOKEN' + jwt.sign({ user_id: this._id }, CONFIG.jwt_encryption, { expiresIn: expirationTime });
};

export const User = mongoose.model<IUserModel>('User', UserSchema);
