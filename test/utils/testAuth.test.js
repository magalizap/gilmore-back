import supertest from 'supertest';
import { app } from '../../src/index.js';

/*export const authenticateUser = async () => {
  const agent = supertest.agent(app)

  await agent.post('/api/sessions/login').send({
    email: 'user@test.com',
    password: '123456',
  })

  return agent
}*/

export const authenticateUser = async (role) => {
  const agent = supertest.agent(app);

  // Autenticar al usuario según el rol
  const userCredentials = {
    email: 'user@test.com',
    password: '123456',
  };

  if (role === 'Admin') {
    userCredentials.email = 'admin@test.com'; // Cambiar a las credenciales de un admin
  } else if (role === 'Premium') {
    userCredentials.email = 'premium@test.com'; // Cambiar a las credenciales de un premium
  }

  await agent.post('/api/sessions/login').send(userCredentials);

  return agent;
};

