import { BaseContext } from 'koa';
import * as httpStatus from 'http-status';

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
      const user = await newUser.save();
      ctx.status = httpStatus.OK;
      ctx.body = {
        message: 'User registered',
        data: user.toJSON(),
      };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  /**
   * POST /authenticate
   * Sign in using email and password.
   */
  public async authenticate(ctx: BaseContext) {
    const { body } = ctx.request;
    try {
      if (!body.email || !body.password) {
        ctx.throw(httpStatus.FORBIDDEN, 'Please fill in your credentials');
      }
      const user = await User.findOne({ email: body.email });
      if (!user) {
        ctx.throw(httpStatus.NOT_FOUND, 'User not found');
        return;
      }
      if (!user.comparePassword(body.password)) {
        ctx.throw(httpStatus.FORBIDDEN, 'Wrong password');
      }
      ctx.status = httpStatus.OK;
      ctx.body = {
        data: user.toJSON(),
      };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }
}
