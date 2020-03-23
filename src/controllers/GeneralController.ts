import { Context } from 'koa';
import httpStatus from 'http-status';
import {
  request, summary, tagsAll, responsesAll,
} from 'koa-swagger-decorator';

import { ROUTE_ROOT } from 'routes/constants';

@tagsAll(['General'])
@responsesAll({
  200: { description: 'Success' },
  400: { description: 'Bad request' },
  404: { description: 'Not found' },
})
export class GeneralController {
  @request('get', ROUTE_ROOT)
  @summary('Root endpoint')
  public static async helloWorld(ctx: Context) {
    try {
      ctx.status = httpStatus.OK;
      ctx.body = 'Hello world!';
    } catch (err) {
      ctx.throw(err.status, err.message);
    }
  }
}
