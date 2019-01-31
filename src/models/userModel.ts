import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IUserModel } from 'shared/types/models';
import { CONFIG } from 'config';

const Schema = mongoose.Schema;
const SALT_ROUND = 10;

export const UserSchema = new Schema<IUserModel>({
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
UserSchema.pre('save', function pre(next: mongoose.HookNextFunction) {
  if (!this.isModified('password')) { return next(); }
  try {
    bcrypt.genSalt(SALT_ROUND, (err, salt) => {
      if (err) { return next(err); }
      bcrypt.hash((this as IUserModel).password, salt, (error, hash) => {
        if (error) { return next(error); }
        (this as IUserModel).password = hash;
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
UserSchema.methods.comparePassword = function compare(pwd: string) {
  return bcrypt.compareSync(pwd, this.password);
};

/**
 * Helper method for getting jwt token.
 */
UserSchema.methods.getJWT = function getToken() {
  const expirationTime = parseInt(CONFIG.jwt_expiration, 10);
  return 'TOKEN' + jwt.sign({ user_id: this._id }, CONFIG.jwt_encryption, { expiresIn: expirationTime });
};

export const User = mongoose.model<IUserModel>('User', UserSchema);
