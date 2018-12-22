import * as mongoose from 'mongoose';
const validate = require('mongoose-validator');

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  first: { type: String },
  last: { type: String },
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
