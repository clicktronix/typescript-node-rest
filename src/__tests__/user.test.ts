import { expect } from 'chai';
import { Response } from 'koa';
import * as httpStatus from 'http-status';
import * as R from 'ramda';
import supertest from 'supertest';

import { app } from '../index';
import { ROUTE_AUTH, ROUTE_USERS, ROUTE_REGISTER } from '../routes/constants';
import { registerUser } from './helpers/auth';

const userRequest = {
  email: 'userEmail@gmail.com',
  password: '123456',
};

const INVALID_ID = '5c535bec1234352055129874';

describe('User module', () => {
  let server: any;
  let userResponseData: Response;

  before(async () => {
    try {
      server = supertest(app);
      await registerUser(server, userRequest);
      userResponseData = await server.post(ROUTE_AUTH).send(userRequest);
    } catch (err) {
      console.error(err);
    }
  });

  describe(ROUTE_USERS, () => {
    it('Should get users', async () => {
      const res = await server
        .get(ROUTE_USERS)
        .set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.data).to.be.an('array');
    });

    it('Should return user by id', async () => {
      const res = await server
        .get(`${ROUTE_USERS}/${userResponseData.body.data._id}`)
        .set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.OK);
      expect(R.omit(['updatedAt'], res.body.data)).to.deep.equal(R.omit(['updatedAt'], userResponseData.body.data));
    });

    it('Should return error if user does not exist', async () => {
      const res = await server
        .get(`${ROUTE_USERS}/${INVALID_ID}`)
        .set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.error.message).to.be.an('string');
    });

    it('Should return error on get user if access token is invalid', async () => {
      const res = await server
        .get(`${ROUTE_USERS}/${userResponseData.body.data._id}`)
        .set('Authorization', INVALID_ID);

      expect(res.status).to.equal(httpStatus.UNAUTHORIZED);
      expect(res.error.message).to.be.an('string');
    });

    it('Should update user by id', async () => {
      const res = await server
        .put(`${ROUTE_USERS}/${userResponseData.body.data._id}`).send(userResponseData.body.data)
        .set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.OK);
      expect(R.omit(['updatedAt'], res.body.data)).to.deep.equal(R.omit(['updatedAt'], userResponseData.body.data));
    });

    it('Should return error if user does not exist, when it updating', async () => {
      const res = await server
        .put(`${ROUTE_USERS}/${INVALID_ID}`)
        .send({
          ...userResponseData.body.data,
          email: '123@mail.ru',
        })
        .set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.error.message).to.be.an('string');
    });

    it('Should return error on put user if access token is invalid', async () => {
      const res = await server
        .put(`${ROUTE_USERS}/${userResponseData.body.data._id}`)
        .send({
          ...userResponseData.body.data,
          email: '123@mail.ru',
        })
        .set('Authorization', INVALID_ID);

      expect(res.status).to.equal(httpStatus.UNAUTHORIZED);
      expect(res.error.message).to.be.an('string');
    });

    it('Should delete user', async () => {
      const newUser = {
        name: 'Name',
        surname: 'Surname',
        email: 'emailForDelete@gmail.com',
        password: '123456',
      };
      await server
        .post(ROUTE_REGISTER)
        .send(newUser).set('Authorization', userResponseData.body.token.accessToken);

      const registeredUser = await server
        .post(ROUTE_AUTH)
        .send(newUser)
        .set('Authorization', userResponseData.body.token.accessToken);
      const res = await server
        .delete(`${ROUTE_USERS}/${registeredUser.body.data._id}`)
        .set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.NO_CONTENT);
    });

    it('Should throw error if the userId being deleted does not exist', async () => {
      const res = await server.delete(ROUTE_USERS).set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.METHOD_NOT_ALLOWED);
      expect(res.error.message).to.be.an('string');
    });

    it('Should return error on delete user if access token is invalid', async () => {
      const res = await server
        .delete(`${ROUTE_USERS}/${userResponseData.body.data._id}`)
        .set('Authorization', INVALID_ID);

      expect(res.status).to.equal(httpStatus.UNAUTHORIZED);
      expect(res.error.message).to.be.an('string');
    });
  });
});
