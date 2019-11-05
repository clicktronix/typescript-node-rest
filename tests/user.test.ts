import { expect } from 'chai';
import { Response } from 'koa';
import * as httpStatus from 'http-status';
import * as R from 'ramda';
import supertest from 'supertest';

import app from '../src';
import { registerUser } from './helpers/auth';

const userRequest = {
  email: 'userEmail@gmail.com',
  password: '123456',
};

const INVALID_USER_ID = '5c535bec1234352055129874';

describe('User module', () => {
  let server: any;
  let userResponseData: Response;

  before(async () => {
    try {
      server = supertest(app);
      await registerUser(server, userRequest);
      userResponseData = await server.post('/authenticate').send(userRequest);
    } catch (err) {
      console.error(err);
    }
  });

  describe('/users', () => {
    it('Should get users', async () => {
      const res = await server
        .get('/users')
        .set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.data).to.be.an('array');
    });

    it('Should return user by id', async () => {
      const res = await server
        .get(`/users/${userResponseData.body.data._id}`)
        .set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.OK);
      expect(R.omit(['updatedAt'], res.body.data)).to.deep.equal(R.omit(['updatedAt'], userResponseData.body.data));
    });

    it('Should return error if user does not exist', async () => {
      const res = await server
        .get(`/users/${INVALID_USER_ID}`)
        .set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.error.message).to.be.an('string');
    });

    it('Should update user by id', async () => {
      const res = await server
        .put('/users').send(userResponseData.body.data)
        .set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.OK);
      expect(R.omit(['updatedAt'], res.body.data)).to.deep.equal(R.omit(['updatedAt'], userResponseData.body.data));
    });

    it('Should return error if user does not exist, when it updating', async () => {
      const res = await server
        .put('/users')
        .send({
          ...userResponseData.body.data,
          email: '123@mail.ru',
        })
        .set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.error.message).to.be.an('string');
    });

    it('Should delete user', async () => {
      const newUser = {
        name: 'Name',
        surname: 'Surname',
        email: 'emailForDelete@gmail.com',
        password: '123456',
      };
      await server.post('/register').send(newUser).set('Authorization', userResponseData.body.token.accessToken);

      const registeredUser = await server
        .post('/authenticate')
        .send(newUser)
        .set('Authorization', userResponseData.body.token.accessToken);
      const res = await server
        .delete(`/users/${registeredUser.body.data._id}`)
        .set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.NO_CONTENT);
    });

    it('Should throw error if the userId being deleted does not exist', async () => {
      const res = await server.delete(`/users`).set('Authorization', userResponseData.body.token.accessToken);

      expect(res.status).to.equal(httpStatus.METHOD_NOT_ALLOWED);
      expect(res.error.message).to.be.an('string');
    });
  });
});
