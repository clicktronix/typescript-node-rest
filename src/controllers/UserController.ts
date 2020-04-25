import { Context } from 'koa';
import * as httpStatus from 'http-status';
import {
  request, summary, tagsAll, body as requestBody, responsesAll,
} from 'koa-swagger-decorator';

import { ROUTE_USERS, ROUTE_USERS_ID } from 'routes/constants';

import { User, userSwaggerSchema } from '../models';

@tagsAll(['User'])
@responsesAll({
  200: { description: 'Success' },
  204: { description: 'No content' },
  400: { description: 'Bad request' },
  404: { description: 'User not found' },
})
export class UserController {
  @request('get', ROUTE_USERS)
  @summary('Get user list')
  public static async getUsers(ctx: Context) {
    try {
      const users = await User.find({});
      ctx.status = httpStatus.OK;
      ctx.body = { users: users || [] };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  @request('get', ROUTE_USERS_ID)
  @summary('Get user by id')
  public static async getUserById(ctx: Context) {
    try {
      const user = await User.findById(ctx.request.ctx.params.userId);
      if (!user) {
        return ctx.throw(httpStatus.NOT_FOUND, 'User not found');
      }
      ctx.status = httpStatus.OK;
      ctx.body = { user: user.toJSON() };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  @request('put', ROUTE_USERS_ID)
  @summary('Update user by id')
  @requestBody(userSwaggerSchema)
  public static async updateUser(ctx: Context) {
    const { body } = ctx.request;
    try {
      const user = await User.findOneAndUpdate({ _id: ctx.request.ctx.params.userId }, body, { new: true });
      if (!user) {
        return ctx.throw(httpStatus.NOT_FOUND, 'User not found');
      }
      ctx.status = httpStatus.OK;
      ctx.body = {
        message: 'User updated',
        user: user.toJSON(),
      };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  @request('delete', ROUTE_USERS_ID)
  @summary('Delete user by id')
  public static async deleteUser(ctx: Context) {
    try {
      await User.deleteOne({ _id: ctx.request.ctx.params.userId });
      ctx.status = httpStatus.NO_CONTENT;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }
}
