import * as mongoose from 'mongoose';
import { IMessageModel } from 'shared/types/models/message';

const Schema = mongoose.Schema;

const MessageSchema = new Schema<IMessageModel>({
  id: Schema.Types.ObjectId,
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel',
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  onModel: {
    type: String,
    required: true,
    enum: ['User', 'Chat'],
  },
});

export const Message = mongoose.model<IMessageModel>('Message', MessageSchema);
