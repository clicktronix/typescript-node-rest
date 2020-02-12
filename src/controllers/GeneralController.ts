import { Context } from 'koa';
import * as httpStatus from 'http-status';
import { request, summary, tagsAll } from 'koa-swagger-decorator';

import { ROUTE_ROOT } from 'routes/constants';

@tagsAll(['General'])
export class GeneralController {
  @request('get', ROUTE_ROOT)
  @summary('Base route')
  public static async helloWorld(ctx: Context) {
    try {
      ctx.status = httpStatus.OK;
      ctx.body = 'Hello world!';
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }
}
