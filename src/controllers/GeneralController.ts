import { Context } from 'koa';
import * as httpStatus from 'http-status';

export class GeneralController {
  public static async helloWorld(ctx: Context) {
    try {
      ctx.status = httpStatus.OK;
      ctx.body = 'Hello world!';
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }
}
