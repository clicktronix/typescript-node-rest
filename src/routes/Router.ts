import { Router } from 'express';

import { userRoutes } from './UserRoutes';
import { authRoutes } from './AuthRoutes';

export class BaseRouter {
  private router: Router;

  public constructor() {
    this.router = Router();
    this.router.use('/', authRoutes);
    this.router.use('/users', userRoutes);
  }
}
