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
      expect(res.body).to.deep.equal({
        success: false,
        message: 'Wrong password',
        data: null,
      });
    });

    it('Should return 404 not found, if user does not exist', async () => {
      const res = await server.post('/authenticate').send({
        ...userRequest,
        email: 'INVALID',
      });

      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'User not found',
        data: null,
      });
    });

    it('Should return 403 forbidden, if email is empty', async () => {
      const res = await server.post('/authenticate').send({
        password: '123',
      });

      expect(res.status).to.equal(403);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'Please enter an email to login',
        data: null,
      });
    });

    it('Should return 403 forbidden, if password is empty', async () => {
      const res = await server.post('/authenticate').send({
        email: 'mail',
      });

      expect(res.status).to.equal(403);
      expect(res.body).to.deep.equal({
        success: false,
        message: 'Please enter a password to login',
        data: null,
      });
    });
  });

  // describe('/register', () => {
  //   it('Should return 403 forbidden, if email is used', async () => {
  //     const res = await server.post('/register').send({
  //       ...userRequest,
  //       firstName: 'firstName',
  //       lastName: 'lastName',
  //     });

  //     expect(res.status).to.equal(403);
  //     expect(res.body).to.deep.equal({
  //       message: 'Email is used.',
  //       success: false,
  //       data: null,
  //     });
  //   });
  // });
});
