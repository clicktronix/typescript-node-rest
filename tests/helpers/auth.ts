export async function registerUser(server: any, user: any) {
  await server.post('/register').send({
    name: 'Name',
    surname: 'Surname',
    ...user,
  });
}
