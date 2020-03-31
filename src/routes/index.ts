import { SwaggerRouter } from 'koa-swagger-decorator';
import jwtMiddleware from 'koa-jwt';

import * as controllers from '../controllers';
import { CONFIG } from '../config';
import {
  ROUTE_REGISTER, ROUTE_AUTH, ROUTE_REFRESH_TOKEN, ROUTE_LOGOUT, ROUTE_USERS, ROUTE_USERS_ID,
  ROUTE_MESSAGES, ROUTE_MESSAGES_ID, ROUTE_ROOT, ROUTE_TOKEN_AUTH,
} from './constants';

const router = new SwaggerRouter();

// Public routes
router.get(ROUTE_ROOT, controllers.GeneralController.helloWorld);
router.get(ROUTE_TOKEN_AUTH, controllers.AuthController.tokenAuthenticate);
router.post(ROUTE_REGISTER, controllers.AuthController.registerNewUser);
router.post(ROUTE_AUTH, controllers.AuthController.authenticate);
router.post(ROUTE_REFRESH_TOKEN, controllers.AuthController.refreshAccessToken);
router.post(ROUTE_LOGOUT, controllers.AuthController.logout);

// Private routes
router.use(jwtMiddleware({ secret: CONFIG.jwt_encryption }).unless({ path: [/^\/swagger-/] }));

router.get(ROUTE_USERS, controllers.UserController.getUsers);
router.get(ROUTE_USERS_ID, controllers.UserController.getUserById);
router.put(ROUTE_USERS, controllers.UserController.updateUser);
router.delete(ROUTE_USERS_ID, controllers.UserController.deleteUser);

router.get(ROUTE_MESSAGES, controllers.MessageController.getMessages);
router.post(ROUTE_MESSAGES, controllers.MessageController.postMessage);
router.patch(ROUTE_MESSAGES_ID, controllers.MessageController.updateMessage);
router.delete(ROUTE_MESSAGES_ID, controllers.MessageController.deleteMessage);
router.get(ROUTE_MESSAGES_ID, controllers.MessageController.getMessage);

// Swagger
router.swagger({
  title: 'node-typescript-koa-rest',
  description: 'API REST using NodeJS and KOA framework, typescript.',
  version: '1.0.0',
});

Object.values(controllers).forEach((x) => {
  router.map(x, {
    doValidation: false,
  });
});

export { router };
