import { expect } from 'chai';
import { Server } from 'http';
import { default as app } from '../src/app';
const agent = require('supertest-koa-agent');

const userRequest = {
  email: 'asdfg@gmail.com',
  password: '123',
};
const INVALID_USER_ID = '5c535bec1234352055129874';

describe('User module', () => {
  let server: any;
  let appInstance: Server;
  let userResponseData: any;

  before(async () => {
    appInstance = app.listen(8080);
    server = agent(app);
    userResponseData = await server.post('/authenticate').send(userRequest);
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
      const res = await server.get(`/users/${userResponseData.body.data._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.deep.equal(userResponseData.body.data);
    });

    it('Should return error if user does not exist', async () => {
      const res = await server.get(`/users/${INVALID_USER_ID}`);

      expect(res.status).to.equal(404);
      expect(res.error.message).to.be.an('string');
    });

    it('Should update user by id', async () => {
      const res = await server.put('/users').send(userResponseData.body.data);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.deep.equal(userResponseData.body.data);
    });

    it('Should return error if user does not exist, when it updating', async () => {
      const res = await server.put('/users').send({
        ...userResponseData.body.data,
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

    it('Should throw error if the userId being deleted does not exist', async () => {
      const res = await server.delete(`/users`);

      expect(res.status).to.equal(405);
      expect(res.error.message).to.be.an('string');
    });
  });
});
