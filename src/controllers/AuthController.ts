import { Context } from 'koa';
import * as httpStatus from 'http-status';
import * as R from 'ramda';

import { User } from 'models/userModel';
import * as refreshTokenService from 'shared/helpers/refreshToken';
import { bind } from 'decko';

export class AuthController {
  /**
   * POST /register
   */
  public async registerNewUser(ctx: Context) {
    const { body } = ctx.request;
    try {
      const newUser = new User(body);
      if (await User.findOne({ email: body.email })) {
        return ctx.throw(httpStatus.FORBIDDEN, 'Email is used');
      }
      await newUser.save();
      ctx.status = httpStatus.CREATED;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  /**
   * POST /authenticate
   * Sign in using email and password
   */
  @bind
  public async authenticate(ctx: Context) {
    const { body } = ctx.request;
    try {
      const user = await this.getUser(ctx, '+password +tokens');
      if (!user.comparePassword(body.password)) {
        return ctx.throw(httpStatus.UNAUTHORIZED, 'Wrong password');
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
   */
  @bind
  public async logout(ctx: Context) {
    const { body: { refreshToken } } = ctx.request;
    try {
      const user = await this.getUser(ctx, '+tokens');
      const updatedTokens = refreshTokenService.remove(user.tokens, refreshToken);
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
  @bind
  public async refreshAccessToken(ctx: Context) {
    const { body: { refreshToken } } = ctx.request;
    try {
      const user = await this.getUser(ctx, '+tokens');
      const updatedTokens = refreshTokenService.update(user.tokens, refreshToken);
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

  private async getUser(ctx: Context, selectQuery: string) {
    const { body: { email } } = ctx.request;
    const user = await User.findOne({ email }).select(selectQuery);
    return user ? user : ctx.throw(httpStatus.NOT_FOUND, 'User not found');
  }
}
