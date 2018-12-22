import * as mongoose from 'mongoose';
import { Request, Response } from 'express';

import { UserSchema } from '../models/userModel';

const User = mongoose.model('User', UserSchema);

export default class UserController {
  public addNewUser(req: Request, res: Response) {
    const newUser = new User(req.body);

    newUser.save((err, user) => {
      err && res.send(err);
      res.json(user);
    });
  }

  public getUsers(_req: Request, res: Response) {
    User.find({}, (err, user) => {
      err && res.send(err);
      res.json(user);
    });
  }

  public getUserWithId(req: Request, res: Response) {
    User.findById(req.params.userId, (err, user) => {
      err && res.send(err);
      res.json(user);
    });
  }

  public updateUser(req: Request, res: Response) {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true }, (err, user) => {
      err && res.send(err);
      res.json(user);
    });
  }

  public deleteUser(req: Request, res: Response) {
    User.remove({ _id: req.params.contactId }, (err) => {
      err && res.send(err);
      res.json({ message: 'Successfully deleted user!' });
    });
  }
}
