import { Context } from 'koa';

export class GeneralController {
  public static async helloWorld(ctx: Context) {
    ctx.body = 'Hello World!';
  }
}
