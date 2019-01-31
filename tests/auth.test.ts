import { expect } from 'chai';
import { App } from '../src/app';
const agent = require('supertest-koa-agent');

const app = new App().app;
const userRequest = {
  email: 'asdfg@gmail.com',
  password: '23031994',
};
const userResponseData = {
  '_id': '5c2fae70baade40ee5982dc3',
  'firstName': 'Vladislav',
  'lastName': 'Manakov',
  'email': 'asdfg@gmail.com',
  'password': '$2b$10$L34AyEt4Wd0kx4J7FOTUz.b9Oo3hMhxl9Kc2DQCEKGAQKzPQoiPCq',
  'createdAt': '2019-01-04T19:05:20.650Z',
  'updatedAt': '2019-01-04T19:05:20.650Z',
  '__v': 0,
};

describe('Auth module', () => {
  let server: any;
  let appInstance: any;

  before(() => {
    appInstance = app.listen(8080);
    server = agent(app);
  });

  after(() => {
    appInstance.close();
  });

  describe('/authenticate', () => {
    it('Should successfully login user', async () => {
      const res = await server.post('/authenticate').send(userRequest);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.deep.equal(userResponseData);
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
