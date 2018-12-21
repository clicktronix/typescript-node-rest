import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  firstName: {
    type: String,
    required: 'Enter a firs name',
  },
  lastName: {
    type: String,
    required: 'Enter a last name',
  },
  email: {
    type: String,
    required: 'Enter a email',
  },
  phone: {
    type: Number,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});
