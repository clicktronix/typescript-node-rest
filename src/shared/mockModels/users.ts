import * as uuid from 'uuid';
import { User } from 'models/userModel';
import { IUser } from 'shared/types';

const mockUsers: IUser[] = [
  {
    name: 'Name',
    surname: 'Surname',
    email: 'email@gmail.com',
    password: '123456',
    tokens: [uuid.v4()],
  },
  {
    name: 'Name1',
    surname: 'Surname1',
    email: 'email1@gmail.com',
    password: '123456',
    tokens: [uuid.v4(), uuid.v4()],
  },
  {
    name: 'Name2',
    surname: 'Surname2',
    email: 'email2@gmail.com',
    password: '123456',
    tokens: [uuid.v4()],
  },
  {
    name: 'Name3',
    surname: 'Surname3',
    email: 'email3@gmail.com',
    password: '123456',
    tokens: [uuid.v4(), uuid.v4(), uuid.v4()],
  },
  {
    name: 'Name4',
    surname: 'Surname4',
    email: 'email4@gmail.com',
    password: '123456',
    tokens: [],
  },
];

export function initMockedUsers() {
  mockUsers.forEach((i) => new User(i).save());
}
