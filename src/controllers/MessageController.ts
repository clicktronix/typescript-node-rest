import { Context } from 'koa';
import * as httpStatus from 'http-status';
import { bind } from 'decko';

import { Message, User, IUserModel } from '../models';
import { decodeToken } from '../shared/helpers/decodeToken';

export class MessageController {
  /**
   * GET /messages
   */
  public static async getMessages(ctx: Context) {
    try {
      const messages = await Message.find({});
      ctx.status = httpStatus.OK;
      ctx.body = { data: messages || [] };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  /**
   * GET /messages/:messageId
   */
  @bind
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

  /**
   * POST /messages
   */
  @bind
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

  /**
   * PATCH /messages/:messageId
   */
  @bind
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

  /**
   * DELETE /messages/:messageId
   */
  @bind
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

  private static async findMessage(ctx: Context, usersMeta: IUserModel) {
    try {
      const message = await Message.findById(ctx.request.ctx.params.messageId);
      const user = await User.findById(usersMeta.id);
      if (!message || !user) {
        return ctx.throw(httpStatus.NOT_FOUND, 'Message or user not found');
      }
      if (!message.owner._id.equals(user._id)) {
        return ctx.throw(httpStatus.UNAUTHORIZED, 'You have not permissions');
      }
      return message;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }
}
