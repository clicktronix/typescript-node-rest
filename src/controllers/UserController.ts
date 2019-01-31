import { BaseContext } from 'koa';
import * as httpStatus from 'http-status';

import { User } from 'models/userModel';

export default class UserController {
  public async getUsers(ctx: BaseContext) {
    await User.find({}, (err, users) => {

      if (err || !users) {
        ctx.throw(httpStatus.NOT_FOUND, err.message, { data: null });
      }
      ctx.status = httpStatus.OK;
      ctx.body = {
        data: users,
      };
    });
  }

  public async getUserById(ctx: BaseContext) {
    await User.findById(ctx.request.ctx.params.userId, (err, user) => {
      if (err || !user) {
        ctx.throw(httpStatus.NOT_FOUND, err.message, { data: null });
        return;
      }
      ctx.status = httpStatus.OK;
      ctx.body = {
        data: user.toJSON(),
      };
    });
  }

  public async updateUser(ctx: BaseContext) {
    const { request } = ctx;
    await User.findOneAndUpdate({ _id: request.ctx.params.userId }, request.body, { new: true }, (err, user) => {
      if (err || !user) {
        ctx.throw(httpStatus.NOT_FOUND, err.message, { data: null });
        return;
      }
      ctx.status = httpStatus.OK;
      ctx.body = {
        data: user.toJSON(),
      };
    });
  }

  public async deleteUser(ctx: BaseContext) {
    await User.deleteOne({ _id: ctx.request.ctx.params.userId }, (err) => {
      if (err) {
        ctx.throw(httpStatus.NOT_FOUND, err.message, { data: null });
        return;
      }
      ctx.status = httpStatus.OK;
      ctx.body = { message: 'Successfully deleted user!' };
    });
  }
}
