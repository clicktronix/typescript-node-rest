import { BaseContext } from 'koa';
import * as httpStatus from 'http-status';

import { getNullErrorData } from 'shared/helpers/errorHandler';
import User from 'models/userModel';

export default class AuthController {
  /**
   * POST /register
   */
  public async registerNewUser(ctx: BaseContext) {
    const newUser = new User(ctx.request.body);
    try {
      await newUser.save((err, user) => {
        if (err) {
          ctx.status = httpStatus.BAD_REQUEST;
          ctx.body = getNullErrorData('Email is used.');
        }
        ctx.status = httpStatus.OK;
        ctx.body = {
          message: 'User registered',
          token: user.getJWT(),
          data: user.toJSON(),
        };
      });
    } catch (err) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = getNullErrorData(err.message);
    }
  }

  /**
   * POST /authenticate
   * Sign in using email and password.
   */
  public async authenticate(ctx: BaseContext) {
    const { body } = ctx.request;
    try {
      if (!body.email) {
        ctx.status = httpStatus.BAD_REQUEST;
        ctx.body = getNullErrorData('Please enter an email to login');
      }
      if (!body.password) {
        ctx.status = httpStatus.BAD_REQUEST;
        ctx.body = getNullErrorData('Please enter a password to login');
      }

      await User.findOne({ email: body.email }, (err, user) => {
        if (!user || err) {
          ctx.status = httpStatus.NOT_FOUND;
          ctx.body = getNullErrorData('User not found');
          return;
        }
        if (!user.comparePassword(body.password)) {
          ctx.status = httpStatus.BAD_REQUEST;
          ctx.body = getNullErrorData('Wrong password');
          return;
        }
        ctx.status = httpStatus.OK;
        ctx.body = {
          token: user.getJWT(),
          data: user.toJSON(),
        };
      });
    } catch (err) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = getNullErrorData(err.message);
    }
  }
}
