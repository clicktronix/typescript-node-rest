import { default as Router } from 'koa-router';

import { UserController, AuthController } from 'controllers';

const router = new Router();
const userController: UserController = new UserController();
const authController: AuthController = new AuthController();

// Auth routes
router.post('/register', authController.registerNewUser);
router.post('/authenticate', authController.authenticate);

// User routes
router.get('/users', userController.getUsers);
router.get('/users/:userId', userController.getUserById);
router.put('/users', userController.updateUser);
router.delete('/users/:userId', userController.deleteUser);

export { router };
