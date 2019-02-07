import { expect } from 'chai';
import { Server } from 'http';
import * as httpStatus from 'http-status';

import { default as app } from '../src/app';

const agent = require('supertest-koa-agent');

const userRequest = {
  name: 'Name',
  surname: 'Surname',
  email: 'userEmail@gmail.com',
  password: '123456',
};

const INVALID_USER_ID = '5c535bec1234352055129874';

describe('User module', () => {
  let server: any;
  let appInstance: Server;
  let userResponseData: any;

  before(async () => {
    try {
      appInstance = app.listen(8080);
      server = agent(app);
      await server.post('/register').send(userRequest);
      userResponseData = await server.post('/authenticate').send(userRequest);
    } catch (err) {
      console.error(err);
    }
  });

  after(() => {
    appInstance.close();
  });

  describe('/users', () => {
    it('Should get users', async () => {
      const res = await server.get('/users');

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.data).to.be.an('array');
    });

    it('Should return user by id', async () => {
      const res = await server.get(`/users/${userResponseData.body.data._id}`);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.data).to.deep.equal(userResponseData.body.data);
    });

    it('Should return error if user does not exist', async () => {
      const res = await server.get(`/users/${INVALID_USER_ID}`);

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.error.message).to.be.an('string');
    });

    it('Should update user by id', async () => {
      const res = await server.put('/users').send(userResponseData.body.data);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.data).to.deep.equal(userResponseData.body.data);
    });

    it('Should return error if user does not exist, when it updating', async () => {
      const res = await server.put('/users').send({
        ...userResponseData.body.data,
        email: '123@mail.ru',
      });

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
      await server.post('/register').send(newUser);
      const registeredUser = await server.post('/authenticate').send(newUser);
      const res = await server.delete(`/users/${registeredUser.body.data._id}`);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.message).to.be.an('string');
    });

    it('Should throw error if the userId being deleted does not exist', async () => {
      const res = await server.delete(`/users`);

      expect(res.status).to.equal(httpStatus.METHOD_NOT_ALLOWED);
      expect(res.error.message).to.be.an('string');
    });
  });
});
