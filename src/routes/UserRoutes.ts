
import { Application } from 'express';
import { UserController } from '../controllers';

export default class UserRouter {
  public userController: UserController = new UserController();
  public app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public getRoutes() {
    this.app.route('/users')
      .get(this.userController.getUsers)
      .post(this.userController.addNewUser);

    this.app.route('/users/:userId')
      .get(this.userController.getUserWithId)
      .put(this.userController.updateUser)
      .delete(this.userController.deleteUser);
  }
}
