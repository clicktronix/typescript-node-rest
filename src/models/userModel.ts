import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import to from 'await-to-js';
import * as jwt from 'jsonwebtoken';
const validate = require('mongoose-validator');

import { CONFIG } from '../config';

const Schema = mongoose.Schema;
const SALT_ROUND = 10;

export const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  phone: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true,
    validate: [validate({
      validator: 'isNumeric',
      arguments: [7, 20],
      message: 'Not a valid phone number.',
    })],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true,
    validate: [validate({
      validator: 'isEmail',
      message: 'Not a valid email.',
    })],
  },
  password: { type: String },

}, { timestamps: true });

UserSchema.pre('save', async (next) => {
  if (this.isModified('password') || this.isNew) {

    const [saltErr, salt] = await to(bcrypt.genSalt(SALT_ROUND));
    if (saltErr || !salt) { throw Error(saltErr.message); }

    const [hashErr, hash] = await to(bcrypt.hash(this.password, salt));
    if (hashErr) { throw Error(hashErr.message); }

    this.password = hash;
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = async (pwd: string) => {
  if (!this.password) { throw Error('Password not set'); }

  const [err, pass] = await to(bcrypt.compare(pwd, this.password));
  if (err) { throw Error(err.message); }
  if (!pass) { throw Error('Invalid password'); }

  return this;
};

UserSchema.virtual('full_name').set((name: string) => {
  const split = name.split(' ');
  this.first = split[0];
  this.last = split[1];
});

UserSchema.virtual('full_name').get(() => {
  if (!this.firstName) { return null; }
  if (!this.lastName) { return this.firstName; }

  return this.first + ' ' + this.last;
});

UserSchema.methods.getJWT = () => {
  const expirationTime = parseInt(CONFIG.jwt_expiration, 10);
  return 'Bearer ' + jwt.sign({ user_id: this._id }, CONFIG.jwt_encryption, { expiresIn: expirationTime });
};

UserSchema.methods.toWeb = () => {
  const json = this.toJSON();
  // this is for the front end
  json.id = this._id;
  return json;
};

const User = mongoose.model('User', UserSchema);
export default User;
