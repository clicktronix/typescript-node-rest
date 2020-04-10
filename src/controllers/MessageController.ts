import { Context } from 'koa';
import httpStatus from 'http-status';
import {
  request, summary, tagsAll, body as requestBody, responsesAll, path,
} from 'koa-swagger-decorator';

import { ROUTE_MESSAGES, ROUTE_MESSAGES_ID } from 'routes/constants';

import {
  Message, User, UserModel, messageSwaggerSchema,
} from '../models';
import { decodeToken } from '../shared/helpers/decodeToken';

@tagsAll(['Message'])
@responsesAll({
  200: { description: 'Success' },
  201: { description: 'Created' },
  204: { description: 'No content' },
  400: { description: 'Bad request' },
  401: { description: 'You have not permissions' },
  403: { description: 'Email is used' },
  404: { description: 'Message not found' },
})
export class MessageController {
  @request('get', ROUTE_MESSAGES)
  @summary('Get message list')
  public static async getMessages(ctx: Context) {
    try {
      const messages = await Message.find({});
      ctx.status = httpStatus.OK;
      ctx.body = { data: messages || [] };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  @request('get', ROUTE_MESSAGES_ID)
  @summary('Get message by id')
  @path({ messageId: { type: 'string', required: true } })
  @requestBody(messageSwaggerSchema)
  public static async getMessage(ctx: Context) {
    const { headers } = ctx.request;
    try {
      const usersMeta = decodeToken(headers.authorization);
      const message = await MessageController.findMessage(ctx, usersMeta);
      if (!message) {
        return ctx.throw(httpStatus.NOT_FOUND, 'Message not found');
      }
      ctx.body = { data: message };
      ctx.status = httpStatus.OK;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  @request('post', ROUTE_MESSAGES)
  @summary('Set message')
  @requestBody(messageSwaggerSchema)
  public static async postMessage(ctx: Context) {
    const { body, headers } = ctx.request;
    try {
      const usersMeta = decodeToken(headers.authorization);
      const sender = await User.findById(usersMeta.id);
      const owner = await User.findOne({ email: body.owner });
      if (!sender || !owner) {
        return ctx.throw(httpStatus.NOT_FOUND, 'User not found');
      }
      const message = new Message({
        content: body.content,
        onModel: body.onModel,
        sender,
        owner,
      });
      await message.save();
      await owner.messages.push(message);
      ctx.status = httpStatus.CREATED;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  @request('patch', ROUTE_MESSAGES_ID)
  @summary('Update message by id')
  @path({ messageId: { type: 'string', required: true } })
  @requestBody(messageSwaggerSchema)
  public static async updateMessage(ctx: Context) {
    const { body, headers } = ctx.request;
    try {
      const usersMeta = decodeToken(headers.authorization);
      const message = await MessageController.findMessage(ctx, usersMeta);
      if (message) {
        message.content = body.content;
        await message.save();
      }
      ctx.status = httpStatus.OK;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  @request('delete', ROUTE_MESSAGES_ID)
  @summary('Delete message by id')
  @path({ messageId: { type: 'string', required: true } })
  public static async deleteMessage(ctx: Context) {
    const { headers } = ctx.request;
    try {
      const usersMeta = decodeToken(headers.authorization);
      const message = await MessageController.findMessage(ctx, usersMeta);
      if (message) {
        await message.remove();
      }
      ctx.status = httpStatus.NO_CONTENT;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  private static async findMessage(ctx: Context, usersMeta: UserModel) {
    try {
      const message = await Message.findById(ctx.request.ctx.params.messageId);
      const user = await User.findById(usersMeta.id);
      if (!message || !user) {
        return ctx.throw(httpStatus.NOT_FOUND, 'Message or user not found');
      }
      return message;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }
}
