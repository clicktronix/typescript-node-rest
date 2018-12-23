import { Request, Response } from 'express';

import User from '../models/userModel';

export default class UserController {
  public async getUsers(_req: Request, res: Response) {
    await User.find({}, (err, user) => {
      if (err || !user) { return res.send(err); }
      res.json(user);
      res.end();
    });
  }

  public async getUserById(req: Request, res: Response) {
    await User.findById(req.params.userId, (err, user) => {
      if (err || !user) { return res.send(err); }
      res.json(user);
      res.end();
    });
  }

  public async updateUser(req: Request, res: Response) {
    await User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true }, (err, user) => {
      if (err || !user) { return res.send(err); }
      res.json(user);
      res.end();
    });
  }

  public async deleteUser(req: Request, res: Response) {
    await User.remove({ _id: req.params.contactId }, (err) => {
      if (err) { return res.send(err); }
      res.json({ message: 'Successfully deleted user!' });
      res.end();
    });
  }
}
