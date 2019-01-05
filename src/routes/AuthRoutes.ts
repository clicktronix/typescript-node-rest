import { Router } from 'express';
import { AuthController } from 'controllers';

class AuthRoutes {
  public router: Router;
  private authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.router.route('/register')
      .post(this.authController.registerNewUser);

    this.router.route('/authenticate')
      .post(this.authController.authenticate);
  }
}

export const authRoutes = new AuthRoutes().router;
