import { expect } from 'chai';
import { Server } from 'http';
import { default as app } from '../src/app';
const agent = require('supertest-koa-agent');

const userRequest = {
  firstName: 'Vladislav',
  lastName: 'Manakov',
  email: 'asdfg@gmail.com',
  password: '123',
};

describe('Auth module', () => {
  let server: any;
  let appInstance: Server;
  let userResponseData: any;

  before(async () => {
    appInstance = app.listen(8080);
    server = agent(app);
    userResponseData = await server.post('/register').send(userRequest);
  });

  after(() => {
    appInstance.close();
  });

  describe('/authenticate', () => {
    it('Should successfully login user', async () => {
      const res = await server.post('/authenticate').send(userRequest);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.deep.equal(userResponseData.body.data);
    });

    it('Should return 403 forbidden, if password is wrong', async () => {
      const res = await server.post('/authenticate').send({
        ...userRequest,
        password: 'INVALID',
      });

      expect(res.status).to.equal(403);
      expect(res.error.message).to.be.an('string');
    });

    it('Should return 404, if user does not exist', async () => {
      const res = await server.post('/authenticate').send({
        ...userRequest,
        email: 'INVALID',
      });

      expect(res.status).to.equal(404);
      expect(res.error.message).to.be.an('string');
    });

    it('Should return 403, if email is empty', async () => {
      const res = await server.post('/authenticate').send({
        password: '123',
      });

      expect(res.status).to.equal(403);
      expect(res.error.message).to.be.an('string');
    });

    it('Should return 403, if password is empty', async () => {
      const res = await server.post('/authenticate').send({
        email: 'mail',
      });

      expect(res.status).to.equal(403);
      expect(res.error.message).to.be.an('string');
    });
  });

  describe('/register', () => {
    it('Should throw error when register exists user', async () => {
      const res = await server.post('/register').send(userRequest);

      expect(res.status).to.equal(403);
      expect(res.error.message).to.be.an('string');
    });

    it('Should register new user', async () => {
      const res = await server.post('/register').send({
        email: 'newEmail123@gmail.com',
        password: '123',
        firstName: 'firstName',
        lastName: 'lastName',
      });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('User registered');
      await server.delete(`/users/${res.body.data._id}`);
    });
  });
});
