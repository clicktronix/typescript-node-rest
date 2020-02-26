import { ROUTE_REGISTER } from '../../routes/constants';

export async function registerUser(server: any, user: any) {
  await server.post(ROUTE_REGISTER).send({
    name: 'Name',
    surname: 'Surname',
    ...user,
  });
}
