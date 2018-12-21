import { Application } from 'express';
import UserRoutes from './UserRoutes';
import { UserController } from '../controllers';

export class Router {
  public userController: UserController = new UserController();

  public constructor(app: Application) {
    const userRoutes = new UserRoutes(app);
    userRoutes.getRoutes();
  }
}
