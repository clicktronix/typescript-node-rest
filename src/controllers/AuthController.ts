import { BaseContext } from 'koa';
import * as httpStatus from 'http-status';

import { getNullErrorData } from 'shared/helpers/errorHandler';
import { User } from 'models/userModel';

export default class AuthController {
  /**
   * POST /register
   */
  public async registerNewUser(ctx: BaseContext) {
    const { body } = ctx.request;
    const newUser = new User(body);
    try {
      const userIsExist = await User.findOne({ email: body.email });
      if (userIsExist) {
        ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
        ctx.body = getNullErrorData('Email is used.');
        return;
      }
      const user = await newUser.save();
      ctx.status = httpStatus.OK;
      ctx.body = {
        message: 'User registered',
        data: user.toJSON(),
      };
    } catch (err) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = getNullErrorData(err.message);
    }
    // try {
    //   await newUser.save((err, user) => {
    //     if (err) {
    //       return { ...ctx, status: httpStatus.FORBIDDEN, body: getNullErrorData('Email is used.') };
    //     }
    //     ctx.status = httpStatus.OK;
    //     ctx.body = {
    //       message: 'User registered',
    //       data: user.toJSON(),
    //     };
    //   });
    // } catch (err) {
    //   return { ...ctx, status: httpStatus.INTERNAL_SERVER_ERROR, body: getNullErrorData(err.message) };
    // }
  }

  /**
   * POST /authenticate
   * Sign in using email and password.
   */
  public async authenticate(ctx: BaseContext) {
    const { body } = ctx.request;
    if (!body.email) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = getNullErrorData('Please enter an email to login');
      return;
    }
    if (!body.password) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = getNullErrorData('Please enter a password to login');
      return;
    }
    try {
      await User.findOne({ email: body.email }, (err, user) => {
        if (!user || err) {
          ctx.status = httpStatus.NOT_FOUND;
          ctx.body = getNullErrorData('User not found');
          return;
        }
        if (!user.comparePassword(body.password)) {
          ctx.status = httpStatus.FORBIDDEN;
          ctx.body = getNullErrorData('Wrong password');
          return;
        }
        ctx.status = httpStatus.OK;
        ctx.body = {
          data: user.toJSON(),
        };
      });
    } catch (err) {
      ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = getNullErrorData(err.message);
    }
  }
}
