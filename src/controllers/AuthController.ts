import { Request, Response } from 'express';

import { ReE } from 'shared/helpers/common';
import { IUser } from 'shared/types';

import User from '../models/userModel';

export default class AuthController {
  public async registerNewUser(req: Request, res: Response) {
    res.setHeader('Content-Type', 'application/json');
    const newUser = new User(req.body);

    await newUser.save((err, user) => {
      if (err) { return res.send(err); }
      res.json({
        ...user,
        token: user.getJWT(),
      });
      res.end();
    });
  }

  public async login({ body }: Request, res: Response) {
    if (!body.email) { return ReE(res, new Error('Please enter an email to login'), 442); }
    if (!body.password) { return ReE(res, new Error('Please enter a password to login'), 442); }

    const verifiedUser = await User.findOne({ email: body.email }, (err, user): IUser => {
      if (err || !user) { throw new Error(err); }
      if (!user.comparePassword(body.password)) { throw new Error('Wrong password'); }
      return user;
    });
    res.json({
      ...verifiedUser,
      token: verifiedUser!.getJWT(),
    });
    res.end();
  }
}
