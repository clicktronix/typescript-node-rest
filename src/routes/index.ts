import Router from 'koa-router';
import jwtMiddleware from 'koa-jwt';

import { UserController, AuthController, MessageController } from 'controllers';
import { CONFIG } from 'config';

import {
  ROUTE_REGISTER, ROUTE_AUTH, ROUTE_REFRESH_TOKEN, ROUTE_LOGOUT, ROUTE_USERS, ROUTE_USERS_ID,
  ROUTE_MESSAGES, ROUTE_MESSAGES_ID,
} from './constants';

const router = new Router();

// Public routes
router.post(ROUTE_REGISTER, AuthController.registerNewUser);
router.post(ROUTE_AUTH, AuthController.authenticate);

// Private routes
router.use(jwtMiddleware({ secret: CONFIG.jwt_encryption }));
router.post(ROUTE_REFRESH_TOKEN, AuthController.refreshAccessToken);
router.post(ROUTE_LOGOUT, AuthController.logout);

router.get(ROUTE_USERS, UserController.getUsers);
router.get(ROUTE_USERS_ID, UserController.getUserById);
router.put(ROUTE_USERS, UserController.updateUser);
router.delete(ROUTE_USERS_ID, UserController.deleteUser);

router.get(ROUTE_MESSAGES, MessageController.getMessages);
router.post(ROUTE_MESSAGES, MessageController.postMessage);
router.patch(ROUTE_MESSAGES_ID, MessageController.updateMessage);
router.delete(ROUTE_MESSAGES_ID, MessageController.deleteMessage);
router.get(ROUTE_MESSAGES_ID, MessageController.getMessage);

export { router };
