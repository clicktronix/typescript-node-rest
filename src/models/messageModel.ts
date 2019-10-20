import * as mongoose from 'mongoose';
import { IMessageModel } from 'shared/types/models/message';

const Schema = mongoose.Schema;

const MessageSchema = new Schema<IMessageModel>({
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export const Message = mongoose.model<IMessageModel>('Message', MessageSchema);
