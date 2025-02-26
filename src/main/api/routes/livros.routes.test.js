const request = require('supertest');
const { app } = require('../app');
const {
  typeormLivroRepository,
} = require('../../../infra/db/typeorm/repositories/livro.repository');

describe('Livros Routes', () => {
  beforeEach(async function () {
    await typeormLivroRepository.query('DELETE FROM livros');
  });

  test('Deve ser possível cadastrar um livro', async function () {
    const { statusCode, body } = await request(app).post('/livros').send({
      nome: 'qualquer_nome',
      quantidade: 3,
      autor: 'qualquer_autor',
      genero: 'qualquer_genero',
      ISBN: 123,
    });

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });
});
