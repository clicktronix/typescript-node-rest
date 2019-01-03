import { Request, Response } from 'express';
import * as httpStatus from 'http-status';

import { getNullErrorData } from 'shared/helpers/errorHandler';
import User from 'models/userModel';

export default class AuthController {
  /**
   * POST /register
   */
  public async registerNewUser({ body }: Request, response: Response) {
    const newUser = new User(body);
    try {
      await newUser.save((err, user) => {
        if (err) {
          return response
            .status(httpStatus.BAD_REQUEST)
            .send(getNullErrorData('Email is used.'));
        }
        response
          .status(httpStatus.OK)
          .send({
            message: 'User registered',
            token: user.getJWT(),
            data: user.toJSON(),
          });
      });
    } catch (err) {
      response
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(getNullErrorData(err.message));
    }
  }

  /**
   * POST /authenticate
   * Sign in using email and password.
   */
  public async authenticate({ body }: Request, response: Response) {
    try {
      if (!body.email) {
        return response
          .status(httpStatus.BAD_REQUEST)
          .send(getNullErrorData('Please enter an email to login'));
      }
      if (!body.password) {
        return response
          .status(httpStatus.BAD_REQUEST)
          .send(getNullErrorData('Please enter a password to login'));
      }

      await User.findOne({ email: body.email }, (err, user) => {
        if (!user || err) {
          return response
            .status(httpStatus.NOT_FOUND)
            .send(getNullErrorData('User not found'));
        }
        const isPassMatch = user.comparePassword(body.password);
        if (!isPassMatch) {
          return response
            .status(httpStatus.BAD_REQUEST)
            .send(getNullErrorData('Wrong password'));
        }
        if (isPassMatch instanceof Error) {
          return response
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send(getNullErrorData('Server error'));
        }
        response
          .status(httpStatus.OK)
          .send({
            token: user.getJWT(),
            data: user.toJSON(),
          });
      });
    } catch (err) {
      response
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send(getNullErrorData(err.message));
    }
  }
}
