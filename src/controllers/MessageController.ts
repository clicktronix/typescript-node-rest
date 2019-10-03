import { BaseContext } from 'koa';
import * as httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';

import { Message, User } from 'models';
import { isString } from 'shared/types/guards';
import { CONFIG } from 'config';
import { IUserModel } from 'shared/types/models';

export default class MessageController {
  /**
   * GET /messages
   */
  public async getMessages(ctx: BaseContext) {
    try {
      const messages = await Message.find().populate('user', 'firstName');
      ctx.status = httpStatus.OK;
      ctx.body = {
        data: messages || [],
      };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  /**
   * POST /messages
   */
  public async postMessage(ctx: BaseContext) {
    const { body } = ctx.request;
    try {
      const usersMeta = this.decodeToken(ctx);
      const user = await User.findById(usersMeta.id);
      if (!user) {
        return ctx.throw(httpStatus.NOT_FOUND, 'User not found');
      }
      const message = new Message({
        content: body.content,
        user,
      });
      await message.save();
      await user.messages.push(message);
      ctx.status = httpStatus.CREATED;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  /**
   * PATCH /messages
   */
  public async updateMessage(ctx: BaseContext) {
    const { body } = ctx.request;
    try {
      const usersMeta = this.decodeToken(ctx);
      const message = await this.findMessage(ctx, usersMeta);
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
   * DELETE /messages
   */
  public async deleteMessage(ctx: BaseContext) {
    try {
      const usersMeta = this.decodeToken(ctx);
      const message = await this.findMessage(ctx, usersMeta);
      message && await message.remove();
      ctx.status = httpStatus.OK;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  private async findMessage(ctx: BaseContext, usersMeta: IUserModel) {
    try {
      const message = await Message.findById(ctx.params.id);
      if (!message) {
        return ctx.throw(httpStatus.NOT_FOUND, 'Message not found');
      }
      if (message.user.id !== usersMeta.id) {
        return ctx.throw(httpStatus.UNAUTHORIZED, 'You have not permissions');
      }
      return message;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  private decodeToken(ctx: BaseContext) {
    const { headers } = ctx.request;
    const token = headers.authorization.replace('Bearer ', '');
    const decoded = jwt.verify(token, CONFIG.jwt_encryption);
    if (!decoded || isString(decoded)) {
      return ctx.throw(httpStatus.UNAUTHORIZED, 'Invalid token');
    }
    return decoded as IUserModel;
  }
}
