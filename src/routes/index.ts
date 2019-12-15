import Router from 'koa-router';
import jwtMiddleware from 'koa-jwt';

import { UserController, AuthController, MessageController } from 'controllers';
import { CONFIG } from 'config';

const router = new Router();

// Public routes
router.post('/register', AuthController.registerNewUser);
router.post('/authenticate', AuthController.authenticate);

// Private routes
router.use(jwtMiddleware({ secret: CONFIG.jwt_encryption }));
router.post('/authenticate/refresh', AuthController.refreshAccessToken);
router.post('/logout', AuthController.logout);

router.get('/users', UserController.getUsers);
router.get('/users/:userId', UserController.getUserById);
router.put('/users', UserController.updateUser);
router.delete('/users/:userId', UserController.deleteUser);

router.get('/messages', MessageController.getMessages);
router.post('/messages', MessageController.postMessage);
router.patch('/messages/:messageId', MessageController.updateMessage);
router.delete('/messages/:messageId', MessageController.deleteMessage);
router.get('/messages/:messageId', MessageController.getMessage);

export { router };
