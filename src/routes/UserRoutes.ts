
import { Application } from 'express';
import { default as passport } from 'passport';

import { UserController } from '../controllers';
export default class UserRoutes {
  private userController: UserController = new UserController();
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public getRoutes() {
    this.app.route('/users')
      .get(passport.authenticate('jwt', { session: false }), this.userController.getUsers);

    this.app.route('/users/:userId')
      .get(passport.authenticate('jwt', { session: false }), this.userController.getUserById)
      .put(passport.authenticate('jwt', { session: false }), this.userController.updateUser)
      .delete(passport.authenticate('jwt', { session: false }), this.userController.deleteUser);
  }
}
