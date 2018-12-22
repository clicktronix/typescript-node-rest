import { Application, Request, Response, NextFunction } from 'express';
import { default as cors } from 'cors';
import { ServerError } from 'shared/types';

import UserRoutes from './UserRoutes';
import { UserController } from '../controllers';

export class Router {
  public userController: UserController = new UserController();
  private corsOptions: cors.CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    credentials: true,
    methods: 'GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE',
    preflightContinue: true,
    optionsSuccessStatus: 200,
  };

  public constructor(app: Application) {
    // CORS
    app.use(cors(this.corsOptions));
    app.use('/', (_req, res) => {
      // send the appropriate status code
      res.statusCode = 200;
      res.json({ status: 'success', message: 'Parcel Pending API', data: {} });
    });

    // catch 404 and forward to error handler
    app.use((_req, _res, next) => {
      const err = new Error('Not Found');
      const serverErr: ServerError = {
        ...err,
        status: 404,
      };
      next(serverErr);
    });

    // error handler
    app.use((err: ServerError, req: Request, res: Response, _next: NextFunction) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

    const userRoutes = new UserRoutes(app);
    userRoutes.getRoutes();
  }
}
