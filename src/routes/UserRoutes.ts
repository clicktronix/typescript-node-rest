
import { Application } from 'express';
import { default as passport } from 'passport';

import { UserController } from '../controllers';
export default class UserRouter {
  public userController: UserController = new UserController();
  public app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public getRoutes() {
    this.app.route('/users')
      .get(passport.authenticate('jwt', { session: false }), this.userController.getUsers)
      .post(this.userController.addNewUser);

    this.app.route('/users/:userId')
      .get(passport.authenticate('jwt', { session: false }), this.userController.getUserWithId)
      .put(passport.authenticate('jwt', { session: false }), this.userController.updateUser)
      .delete(passport.authenticate('jwt', { session: false }), this.userController.deleteUser);
  }
}
