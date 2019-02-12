import { default as Router } from 'koa-router';
import { default as jwtMiddleware } from 'koa-jwt';

import { UserController, AuthController } from 'controllers';
import { CONFIG } from 'config';

const router = new Router();
const userController: UserController = new UserController();
const authController: AuthController = new AuthController();

// Public routes
router.post('/register', authController.registerNewUser);
router.post('/authenticate', authController.authenticate);

// Private routes
router.post('/authenticate/refresh', authController.refreshAccessToken);
router.use(jwtMiddleware({
  secret: CONFIG.jwt_encryption,
}));
router.get('/users', userController.getUsers);
router.get('/users/:userId', userController.getUserById);
router.put('/users', userController.updateUser);
router.delete('/users/:userId', userController.deleteUser);

export { router };
