import { expect } from 'chai';
import { App } from '../src/app';
const agent = require('supertest-koa-agent');

const app = new App().app;
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

describe('User module', () => {
  let server: any;
  let appInstance: any;

  before(() => {
    appInstance = app.listen(8080);
    server = agent(app);
  });

  after(() => {
    appInstance.close();
  });

  describe('/users', () => {
    it('Should get users', async () => {
      const res = await server.get('/users');

      expect(res.status).to.equal(200);
      expect(res.body.data).to.be.an('array');
    });

    it('Should return user by id', async () => {
      const res = await server.get(`/users/${userResponseData._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.deep.equal(userResponseData);
    });

    it('Should return error if user is not exist', async () => {
      const res = await server.get('/users/123');

      expect(res.status).to.equal(500);
      expect(res.error.message).to.be.an('string');
    });

    it('Should update user by id', async () => {
      const res = await server.put('/users').send(userResponseData);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.deep.equal(userResponseData);
    });

    it('Should return error if user is not exist, when it updating', async () => {
      const res = await server.put('/users').send({
        ...userResponseData,
        email: '123@mail.ru',
      });

      expect(res.status).to.equal(404);
      expect(res.error.message).to.be.an('string');
    });

    it('Should delete user', async () => {
      const registeredUser = await server.post('/register').send({
        email: 'emailForDelete@gmail.com',
        password: '123',
        firstName: 'firstName',
        lastName: 'lastName',
      });
      const res = await server.delete(`/users/${registeredUser.body.data._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.message).to.be.an('string');
    });

    it('Should throw error if deleting user is not exist', async () => {
      const res = await server.delete(`/users/123`);

      expect(res.status).to.equal(500);
      expect(res.error.message).to.be.an('string');
    });
  });
});
