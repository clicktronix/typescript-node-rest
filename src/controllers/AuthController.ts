import { Request, Response } from 'express';
import * as httpStatus from 'http-status';

import { IUser } from 'shared/types';

import User from '../models/userModel';

export default class AuthController {
  public async registerNewUser(req: Request, res: Response) {
    res.setHeader('Content-Type', 'application/json');
    const newUser = new User(req.body);

    await newUser.save((err, user) => {
      if (err) { return res.status(httpStatus.BAD_REQUEST).send(err); }
      res.status(httpStatus.OK).json({
        ...user,
        token: user.getJWT(),
      });
      res.end();
    });
  }

  public async login({ body }: Request, res: Response) {
    if (!body.email) {
      return res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        message: 'Please enter an email to login',
        data: null,
      });
    }
    if (!body.password) {
      return res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        message: 'Please enter a password to login',
        data: null,
      });
    }

    const verifiedUser = await User.findOne({ email: body.email }, (err, user): IUser => {
      if (err || !user) { throw new Error(err); }
      if (!user.comparePassword(body.password)) { throw new Error('Wrong password'); }
      return user;
    });
    res.status(httpStatus.OK).json({
      ...verifiedUser,
      token: verifiedUser!.getJWT(),
    });
    res.end();
  }
}
