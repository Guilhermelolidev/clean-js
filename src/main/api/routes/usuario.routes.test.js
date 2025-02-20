const request = require('supertest');
const { app } = require('../app');
const {
  typeormUsuariosRepository,
} = require('../../../infra/db/typeorm/repositories/usuarios.repository');

describe('Usuarios Routes', () => {
  beforeEach(async function () {
    await typeormUsuariosRepository.query('DELETE FROM usuarios');
  });

  test('Deve retonar um erro com os campos obrigatórios ausentes', async function () {
    const { statusCode, body } = await request(app).post('/usuarios').send({});

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Erro de validação');
    expect(body.erros.fieldErrors).toEqual({
      CPF: ['CPF é obrigatório'],
      email: ['Email é obrigatório'],
      endereco: ['Endereço é obrigatório'],
      nome_completo: ['Nome completo é obrigatório'],
      telefone: ['Telefone é obrigatório'],
    });
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

  test('Deve retornar um usuário ao buscar pelo CPF', async function () {
    const usuarioDTO = {
      nome_completo: 'nome_valido',
      CPF: '123.123.123-12',
      endereco: 'endereco_valido',
      telefone: 'telefone_valido',
      email: 'email_valido',
    };
    await typeormUsuariosRepository.save(usuarioDTO);

    const { statusCode, body } = await request(app).get(
      '/usuarios/cpf/123.123.123-12'
    );
    expect(body.id).toBeDefined();
    expect(statusCode).toBe(200);
    expect(body).toEqual(expect.objectContaining(usuarioDTO));
  });
});
