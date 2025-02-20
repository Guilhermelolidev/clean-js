const request = require('supertest');
const { app } = require('../app');
const {
  typeormUsuariosRepository,
} = require('../../../infra/db/typeorm/repositories/usuarios.repository');

describe('Usuarios Routes', () => {
  beforeEach(async function () {
    await typeormUsuariosRepository.query('DELETE FROM usuarios');
  });

  test('Deve ser possível cadastrar um usuário', async function () {
    const { statusCode, body } = await request(app).post('/usuarios').send({
      nome_completo: 'nome_completo_valido',
      CPF: '123.123.123-12',
      endereco: 'endereco_valido',
      telefone: 'telefone_valido',
      email: 'email_valido123@gmail.com',
    });

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });
});
