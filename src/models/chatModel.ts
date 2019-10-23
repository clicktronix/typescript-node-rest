import * as mongoose from 'mongoose';
import { IChatModel } from 'shared/types/models';

const Schema = mongoose.Schema;

const ChatSchema = new Schema<IChatModel>({
  id: Schema.Types.ObjectId,
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
});

export const Chat = mongoose.model<IChatModel>('Chat', ChatSchema);
