import { BaseContext } from 'koa';
import * as httpStatus from 'http-status';
import * as R from 'ramda';

import { User } from 'models/userModel';
import * as refreshTokenService from 'services/refreshToken';

export default class AuthController {
  /**
   * POST /register
   */
  public async registerNewUser(ctx: BaseContext) {
    const { body } = ctx.request;
    try {
      const newUser = new User(body);
      if (await User.findOne({ email: body.email })) {
        return ctx.throw(httpStatus.FORBIDDEN, 'Email is used');
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
      const user = await User.findOne({ email: body.email }).select('+password +tokens');
      if (!user) {
        return ctx.throw(httpStatus.NOT_FOUND, 'User not found');
      }
      if (!user.comparePassword(body.password)) {
        return ctx.throw(httpStatus.FORBIDDEN, 'Wrong password');
      }
      user.tokens = refreshTokenService.add(user.tokens);
      user.save();
      ctx.status = httpStatus.OK;
      ctx.body = {
        data: R.omit(['password', 'tokens'], user.toJSON()),
        token: {
          accessToken: user.getJWT(),
          refreshToken: user.getRefreshToken(),
        },
      };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  /**
   * POST /logout
   * Sign in using email and password
   */
  public async logout(ctx: BaseContext) {
    const { body: { email, refreshToken } } = ctx.request;
    try {
      const user = await User.findOne({ email }).select('+tokens');
      if (!user) {
        return ctx.throw(httpStatus.NOT_FOUND, 'User not found');
      }
      const updatedTokens = refreshTokenService.remove(user.tokens, refreshToken);
      if (updatedTokens instanceof Error) {
        return ctx.throw(httpStatus.FORBIDDEN, updatedTokens.message);
      }
      user.tokens = updatedTokens;
      user.save();
      ctx.status = httpStatus.OK;
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  /**
   * POST /authenticate/refresh
   */
  public async refreshAccessToken(ctx: BaseContext) {
    const { body: { email, refreshToken } } = ctx.request;
    try {
      const user = await User.findOne({ email }).select('+tokens');
      if (!user) {
        return ctx.throw(httpStatus.NOT_FOUND, 'User not found');
      }
      const updatedTokens = refreshTokenService.update(user.tokens, refreshToken);
      if (updatedTokens instanceof Error) {
        return ctx.throw(httpStatus.FORBIDDEN, updatedTokens.message);
      }
      user.tokens = updatedTokens;
      user.save();
      ctx.status = httpStatus.OK;
      ctx.body = {
        token: {
          accessToken: user.getJWT(),
          refreshToken: user.getRefreshToken(),
        },
      };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }
}
