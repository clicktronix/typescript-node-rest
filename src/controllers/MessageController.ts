import { BaseContext } from 'koa';
import * as httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import { bind } from 'decko';

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
      const messages = await Message.find().populate('user', 'email');
      ctx.status = httpStatus.OK;
      ctx.body = {
        data: messages || [],
      };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  /**
   * GET /messages:messageId
   */
  @bind
  public async getMessage(ctx: BaseContext) {
    const { headers } = ctx.request;
    try {
      const usersMeta = this.decodeToken(headers.authorization);
      const message = await this.findMessage(ctx, usersMeta);
      if (!message) {
        return ctx.throw(httpStatus.NOT_FOUND, 'Message not found');
      }
      ctx.body = {
        data: message,
      };
      ctx.status = httpStatus.OK;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  /**
   * POST /messages
   */
  @bind
  public async postMessage(ctx: BaseContext) {
    const { body, headers } = ctx.request;
    try {
      const usersMeta = this.decodeToken(headers.authorization);
      const sender = await User.findById(usersMeta.id);
      const owner = await User.findOne({ email: body.to });
      if (!sender || !owner) {
        return ctx.throw(httpStatus.NOT_FOUND, 'User not found');
      }
      const message = new Message({
        content: body.content,
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
   * PATCH /messages:messageId
   */
  @bind
  public async updateMessage(ctx: BaseContext) {
    const { body, headers } = ctx.request;
    try {
      const usersMeta = this.decodeToken(headers.authorization);
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
   * DELETE /messages:messageId
   */
  @bind
  public async deleteMessage(ctx: BaseContext) {
    const { headers } = ctx.request;
    try {
      const usersMeta = this.decodeToken(headers.authorization);
      const message = await this.findMessage(ctx, usersMeta);
      message && await message.remove();
      ctx.status = httpStatus.OK;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  private async findMessage(ctx: BaseContext, usersMeta: IUserModel) {
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

  private decodeToken(usersToken: string) {
    const token = usersToken.replace('Bearer ', '');
    const decoded = jwt.verify(token, CONFIG.jwt_encryption);
    if (!decoded || isString(decoded)) {
      throw new Error('Invalid token');
    }
    return decoded as IUserModel;
  }
}
