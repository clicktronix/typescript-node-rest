import { Request, Response } from 'express';
import * as httpStatus from 'http-status';

import User from 'models/userModel';

export default class UserController {
  public async getUsers(_request: Request, response: Response) {
    await User.find({}, (error, users) => {
      if (error || !users) {
        return response
          .status(httpStatus.NOT_FOUND)
          .send(error);
      }
      response
        .status(httpStatus.OK)
        .send({
          data: users.forEach(u => u.toJSON()),
        });
    });
  }

  public async getUserById(request: Request, response: Response) {
    await User.findById(request.params.userId, (error, user) => {
      if (error || !user) {
        return response
          .status(httpStatus.NOT_FOUND)
          .send(error);
      }
      response
        .status(httpStatus.OK)
        .send({
          data: user.toJSON(),
        });
    });
  }

  public async updateUser(request: Request, response: Response) {
    await User.findOneAndUpdate({ _id: request.params.userId }, request.body, { new: true }, (error, user) => {
      if (error || !user) {
        return response
          .status(httpStatus.NOT_FOUND)
          .send(error);
      }
      response
        .status(httpStatus.OK)
        .send({
          data: user.toJSON(),
        });
    });
  }

  public async deleteUser(request: Request, response: Response) {
    await User.remove({ _id: request.params.contactId }, (error) => {
      if (error) {
        return response
          .status(httpStatus.NOT_FOUND)
          .send(error);
      }
      response
        .status(httpStatus.OK)
        .json({ message: 'Successfully deleted user!' })
        .end();
    });
  }
}
