import { BaseContext } from 'koa';
import * as httpStatus from 'http-status';

import User from 'models/userModel';
import { getNullErrorData } from 'shared/helpers/errorHandler';

export default class UserController {
  public async getUsers(ctx: BaseContext) {
    await User.find({}, (error, users) => {

      if (error || !users) {
        ctx.status = httpStatus.NOT_FOUND;
        ctx.body = getNullErrorData(error.message);
      }
      ctx.status = httpStatus.OK;
      ctx.body = {
        data: users,
      };
    });
  }

  public async getUserById(ctx: BaseContext) {
    await User.findById(ctx.request.params.userId, (error, user) => {
      if (error || !user) {
        ctx.status = httpStatus.NOT_FOUND;
        ctx.body = getNullErrorData(error.message);
        return;
      }
      ctx.status = httpStatus.OK;
      ctx.body = {
        data: user.toJSON(),
      };
    });
  }

  public async updateUser(ctx: BaseContext) {
    await User.findOneAndUpdate({ _id: ctx.request.params.userId }, ctx.request.body, { new: true }, (error, user) => {
      if (error || !user) {
        ctx.status = httpStatus.NOT_FOUND;
        ctx.body = getNullErrorData(error.message);
        return;
      }
      ctx.status = httpStatus.OK;
      ctx.body = {
        data: user.toJSON(),
      };
    });
  }

  public async deleteUser(ctx: BaseContext) {
    await User.remove({ _id: ctx.request.params.contactId }, (error) => {
      if (error) {
        ctx.status = httpStatus.NOT_FOUND;
        ctx.body = getNullErrorData(error.message);
        return;
      }
      ctx.status = httpStatus.OK;
      ctx.body = { message: 'Successfully deleted user!' };
    });
  }
}
