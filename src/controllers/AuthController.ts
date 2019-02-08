import { BaseContext } from 'koa';
import * as httpStatus from 'http-status';
import * as R from 'ramda';

import { User } from 'models/userModel';

export default class AuthController {
  /**
   * POST /register
   */
  public async registerNewUser(ctx: BaseContext) {
    const { body } = ctx.request;
    try {
      const newUser = new User(body);
      if (await User.findOne({ email: body.email })) {
        ctx.throw(httpStatus.FORBIDDEN, 'Email is used');
      }
      await newUser.save();
      ctx.status = httpStatus.OK;
      ctx.body = {
        message: 'User successfully registered',
      };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  /**
   * POST /authenticate
   * Sign in using email and password
   */
  public async authenticate(ctx: BaseContext) {
    const { body } = ctx.request;
    try {
      const user = await User.findOne({ email: body.email }).select('+password');
      if (!user) {
        ctx.throw(httpStatus.NOT_FOUND, 'User not found');
        return;
      }
      if (!user.comparePassword(body.password)) {
        ctx.throw(httpStatus.FORBIDDEN, 'Wrong password');
      }
      ctx.status = httpStatus.OK;
      ctx.body = {
        data: R.omit(['password'], user.toJSON()),
      };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }
}
