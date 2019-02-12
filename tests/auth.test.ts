import { expect } from 'chai';
import { Server } from 'http';
import * as httpStatus from 'http-status';
import * as R from 'ramda';

import { default as app } from '../src/app';

const agent = require('supertest-koa-agent');

const userRequest = {
  name: 'Name',
  surname: 'Surname',
  email: 'email@gmail.com',
  password: '123456',
};

describe('Auth module', () => {
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

  describe('/authenticate', () => {
    it('Should successfully login user', async () => {
      const res = await server.post('/authenticate').send(userRequest);

      expect(res.status).to.equal(httpStatus.OK);
      expect(R.omit(['updatedAt'], res.body.data)).to.deep.equal(R.omit(['updatedAt'], userResponseData.body.data));
      expect(res.body.token.accessToken).to.be.an('string');
      expect(res.body.token.refreshToken).to.be.an('string');
    });

    it('Should return 403, if password is wrong', async () => {
      const res = await server.post('/authenticate').send({
        ...userRequest,
        password: 'INVALID',
      });

      expect(res.status).to.equal(httpStatus.FORBIDDEN);
      expect(res.error.message).to.be.an('string');
    });

    it('Should return 404, if user does not exist', async () => {
      const res = await server.post('/authenticate').send({
        ...userRequest,
        email: 'INVALID',
      });

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.error.message).to.be.an('string');
    });

    it('Should return 404, if email is empty', async () => {
      const res = await server.post('/authenticate').send({
        password: '12345',
      });

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.error.message).to.be.an('string');
    });

    it('Should return 404, if password is empty', async () => {
      const res = await server.post('/authenticate').send({
        email: 'mail',
      });

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.error.message).to.be.an('string');
    });

    it('Should return 401 on expired token', async () => {
      const res = await server
        .get('/users')
        .set('Authorization', userResponseData.body.token.accessToken);

      await setTimeout(() => {
        expect(res.status).to.equal(httpStatus.UNAUTHORIZED);
      }, 5000);
    });
  });

  describe('/authenticate/refresh', () => {
    it('Should set new access token using refresh token', async () => {
      const user = await server.post('/authenticate').send(userRequest);
      const res = await server
        .post('/authenticate/refresh')
        .send({
          email: user.body.data.email,
          refreshToken: user.body.token.refreshToken,
        });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.token.accessToken).to.be.an('string');
      expect(res.body.token.refreshToken).to.be.an('string');
    });

    it('Should return 403 on invalid refresh token', async () => {
      const user = await server.post('/authenticate').send(userRequest);
      const res = await server
        .post('/authenticate/refresh')
        .send({
          email: user.body.data.email,
          refreshToken: 'INVALID',
        });

      expect(res.status).to.equal(httpStatus.FORBIDDEN);
      expect(res.error.message).to.be.an('string');
    });
    it('Should use refresh token only once');
    it('Should set invalid refresh token after logout');
    it('Must be valid multiple refresh tokens');
  });

  describe('/register', () => {
    it('Should throw error when register exists user', async () => {
      const res = await server.post('/register').send(userRequest);

      expect(res.status).to.equal(httpStatus.FORBIDDEN);
      expect(res.error.message).to.be.an('string');
    });

    it('Should register new user', async () => {
      const res = await server.post('/register').send({
        email: 'newEmail123@gmail.com',
        password: '12345',
        name: 'name',
        surname: 'surname',
      });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.message).to.equal('User successfully registered');
    });
  });
});
