import { Application } from 'express';

import { AuthController } from '../controllers';

export default class AuthRoutes {
  private authController: AuthController = new AuthController();
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public getRoutes() {
    this.app.route('/register')
      .post(this.authController.registerNewUser);

    this.app.route('/login')
      .post(this.authController.registerNewUser);
  }
}
