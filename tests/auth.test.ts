import { expect } from 'chai';
import * as httpStatus from 'http-status';

import { default as app } from '../src';
import { CONFIG } from 'config';

const agent = require('supertest-koa-agent');

const userRequest = {
  email: 'authEmail@gmail.com',
  password: '123456',
};

describe('Auth module', () => {
  let server: any;

  before(async () => {
    try {
      server = agent(app);
      await server.post('/register').send({
        ...userRequest,
        name: 'Name',
        surname: 'Surname',
      });
    } catch (err) {
      console.error(err);
    }
  });

  after(() => {
    server.app.close();
  });

  describe('/authenticate', () => {
    it('Should successfully login user', async () => {
      const res = await server.post('/authenticate').send(userRequest);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.data).to.be.an('object');
      expect(res.body.token.accessToken).to.be.an('string');
      expect(res.body.token.refreshToken).to.be.an('string');
    });

    it('Should return 403, if password is wrong', async () => {
      const res = await server.post('/authenticate').send({
        ...userRequest,
        password: 'INVALID',
      });

      expect(res.status).to.equal(httpStatus.UNAUTHORIZED);
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

    it('Should set invalid refresh token after logout', async () => {
      const user = await server.post('/authenticate').send(userRequest);
      const res = await server
        .post('/logout')
        .set('Authorization', `${user.body.token.accessToken}`)
        .send({
          email: user.body.data.email,
          refreshToken: user.body.token.refreshToken,
        });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body.success).to.equal(true);
    });

    it('Should return 401 on expired token', async () => {
      const expiration = CONFIG.jwt_expiration;
      CONFIG.jwt_expiration = '0';
      const user = await server.post('/authenticate').send(userRequest);
      const res = await server
        .get('/users')
        .set('Authorization', user.body.token.accessToken);
      CONFIG.jwt_expiration = expiration;

      expect(res.status).to.equal(httpStatus.UNAUTHORIZED);
    });
  });

  describe('/authenticate/refresh', () => {
    it('Should set new access token using refresh token', async () => {
      const user = await server.post('/authenticate').send(userRequest);
      const res = await server
        .post('/authenticate/refresh')
        .set('Authorization', `${user.body.token.accessToken}`)
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
        .set('Authorization', `${user.body.token.accessToken}`)
        .send({
          email: user.body.data.email,
          refreshToken: 'INVALID',
        });

      expect(res.status).to.equal(httpStatus.UNAUTHORIZED);
      expect(res.error.message).to.be.an('string');
    });

    it('Should use refresh token only once', async () => {
      const user = await server.post('/authenticate').send(userRequest);
      const firstRes = await server
        .post('/authenticate/refresh')
        .set('Authorization', `${user.body.token.accessToken}`)
        .send({
          email: user.body.data.email,
          refreshToken: user.body.token.refreshToken,
        });

      expect(firstRes.status).to.equal(httpStatus.OK);
      expect(firstRes.body.token.accessToken).to.be.an('string');
      expect(firstRes.body.token.refreshToken).to.be.an('string');

      const secondRes = await server
        .post('/authenticate/refresh')
        .set('Authorization', `${user.body.token.accessToken}`)
        .send({
          email: user.body.data.email,
          refreshToken: user.body.token.refreshToken,
        });

      expect(secondRes.status).to.equal(httpStatus.UNAUTHORIZED);
      expect(secondRes.error.message).to.be.an('string');
    });

    it('Must be valid multiple refresh tokens', async () => {
      const firstRes = await server.post('/authenticate').send(userRequest);
      const secondRes = await server.post('/authenticate').send(userRequest);

      expect(firstRes.status).to.equal(httpStatus.OK);
      expect(secondRes.status).to.equal(httpStatus.OK);

      const firstRefreshTokenRes = await server
        .post('/authenticate/refresh')
        .set('Authorization', `${firstRes.body.token.accessToken}`)
        .send({
          email: firstRes.body.data.email,
          refreshToken: firstRes.body.token.refreshToken,
        });
      const secondRefreshTokenRes = await server
        .post('/authenticate/refresh')
        .set('Authorization', `${secondRes.body.token.accessToken}`)
        .send({
          email: secondRes.body.data.email,
          refreshToken: secondRes.body.token.refreshToken,
        });

      expect(firstRefreshTokenRes.status).to.equal(httpStatus.OK);
      expect(firstRefreshTokenRes.body.token.accessToken).to.be.an('string');
      expect(firstRefreshTokenRes.body.token.refreshToken).to.be.an('string');
      expect(secondRefreshTokenRes.status).to.equal(httpStatus.OK);
      expect(secondRefreshTokenRes.body.token.accessToken).to.be.an('string');
      expect(secondRefreshTokenRes.body.token.refreshToken).to.be.an('string');
    });
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
        password: '123456',
        name: 'name',
        surname: 'surname',
      });

      expect(res.status).to.equal(httpStatus.CREATED);
    });
  });
});
