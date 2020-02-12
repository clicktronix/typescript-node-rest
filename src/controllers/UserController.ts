import { Context } from 'koa';
import * as httpStatus from 'http-status';
import {
  request, summary, tagsAll,
} from 'koa-swagger-decorator';

import { User } from '../models';

@tagsAll(['User'])
export class UserController {
  @request('get', '/users')
  @summary('Get user list')
  // @body([User])
  public static async getUsers(ctx: Context) {
    try {
      const users = await User.find({});
      ctx.status = httpStatus.OK;
      ctx.body = { data: users || [] };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  @request('get', '/users/{userId}')
  @summary('Get user by id')
  // @body(User)
  public static async getUserById(ctx: Context) {
    try {
      const user = await User.findById(ctx.request.ctx.params.userId);
      if (!user) {
        return ctx.throw(httpStatus.NOT_FOUND, 'User not found');
      }
      ctx.status = httpStatus.OK;
      ctx.body = { data: user.toJSON() };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  @request('put', '/users/{userId}')
  @summary('Update user by id')
  // @query(User)
  public static async updateUser(ctx: Context) {
    try {
      const user = await User.findOneAndUpdate({ email: ctx.request.body.email }, ctx.request.body, { new: true });
      if (!user) {
        return ctx.throw(httpStatus.NOT_FOUND, 'User not found');
      }
      ctx.status = httpStatus.OK;
      ctx.body = {
        message: 'User updated',
        data: user.toJSON(),
      };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  @request('delete', '/users/{userId}')
  @summary('Delete user by id')
  // @query({ userId: { type: 'string', required: true } })
  public static async deleteUser(ctx: Context) {
    try {
      await User.deleteOne({ _id: ctx.request.ctx.params.userId });
      ctx.status = httpStatus.NO_CONTENT;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }
}
