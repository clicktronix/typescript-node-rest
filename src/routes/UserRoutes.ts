
import { Router } from 'express';
import { default as passport } from 'passport';
import { UserController } from 'controllers';

class UserRoutes {
  public router: Router;
  private userController: UserController = new UserController();

  constructor() {
    this.router = Router();
    this.router.route('/')
      .get(this.userController.getUsers);

    this.router.route('/:userId')
      .get(passport.authenticate('jwt', { session: false }), this.userController.getUserById)
      .put(passport.authenticate('jwt', { session: false }), this.userController.updateUser)
      .delete(passport.authenticate('jwt', { session: false }), this.userController.deleteUser);
  }
}

export const userRoutes = new UserRoutes().router;
