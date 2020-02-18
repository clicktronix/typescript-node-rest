import { Context } from 'koa';
import * as httpStatus from 'http-status';
import * as R from 'ramda';
import {
  tagsAll, request, summary, body as requestBody, responsesAll,
} from 'koa-swagger-decorator';

import {
  ROUTE_REGISTER, ROUTE_AUTH, ROUTE_LOGOUT, ROUTE_REFRESH_TOKEN,
} from 'routes/constants';

import { User, userSwaggerSchema } from '../models/userModel';
import * as refreshTokenService from '../shared/helpers/refreshToken';

@tagsAll(['Auth'])
@responsesAll({
  200: { description: 'Success' },
  400: { description: 'Bad request' },
  401: { description: 'Wrong password' },
  403: { description: 'Email is used' },
  404: { description: 'User not found' },
})
export class AuthController {
  @request('post', ROUTE_REGISTER)
  @summary('Register new user')
  @requestBody(userSwaggerSchema)
  public static async registerNewUser(ctx: Context) {
    try {
      const newUser = new User(ctx.request.body);
      if (await User.findOne({ email: ctx.request.body.email })) {
        return ctx.throw(httpStatus.FORBIDDEN, 'Email is used');
      }
      await newUser.save();
      ctx.status = httpStatus.CREATED;
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  @request('post', ROUTE_AUTH)
  @summary('Authenticate user')
  @requestBody({
    email: { type: 'string', example: 'email@gmail.com' },
    password: { type: 'string', example: 'password' },
  })
  public static async authenticate(ctx: Context) {
    try {
      const user = await AuthController.getUser(ctx, '+password +tokens');
      if (!user.comparePassword(ctx.request.body.password)) {
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

  @request('post', ROUTE_LOGOUT)
  @summary('Logout endpoint')
  public static async logout(ctx: Context) {
    const { body: { refreshToken } } = ctx.request;
    try {
      const user = await AuthController.getUser(ctx, '+tokens');
      const updatedTokens = refreshTokenService.remove(user.tokens, refreshToken);
      user.tokens = updatedTokens;
      user.save();
      ctx.status = httpStatus.OK;
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }

  @request('post', ROUTE_REFRESH_TOKEN)
  @summary('Refresh access token endpoint')
  @requestBody({ refreshToken: { type: 'string', required: true } })
  public static async refreshAccessToken(ctx: Context) {
    const { body: { refreshToken } } = ctx.request;
    try {
      const user = await AuthController.getUser(ctx, '+tokens');
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

  private static async getUser(ctx: Context, selectQuery: string) {
    const { body: { email } } = ctx.request;
    const user = await User.findOne({ email }).select(selectQuery);
    return user || ctx.throw(httpStatus.NOT_FOUND, 'User not found');
  }
}
