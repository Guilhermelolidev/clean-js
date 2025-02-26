const request = require('supertest');
const { app } = require('../app');
const {
  typeormLivroRepository,
} = require('../../../infra/db/typeorm/repositories/livro.repository');

describe('Livros Routes', () => {
  beforeEach(async function () {
    await typeormLivroRepository.query('DELETE FROM livros');
  });

  test('Deve ser possível buscar um livro por nome', async function () {
    const livroDTO = {
      nome: 'qualquer_nome',
      quantidade: 3,
      autor: 'qualquer_autor',
      genero: 'qualquer_genero',
      ISBN: 'qualquer_ISBN',
    };

    await typeormLivroRepository.save(livroDTO);

    const { statusCode, body } = await request(app)
      .get('/livros')
      .query({ valor: 'qualquer_nome' });

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0]).toEqual(expect.objectContaining(livroDTO));
  });
  test('Deve ser possível buscar um livro por ISBN', async function () {
    const livroDTO = {
      nome: 'qualquer_nome',
      quantidade: 3,
      autor: 'qualquer_autor',
      genero: 'qualquer_genero',
      ISBN: 'qualquer_ISBN',
    };

    await typeormLivroRepository.save(livroDTO);

    const { statusCode, body } = await request(app)
      .get('/livros')
      .query({ valor: 'qualquer_ISBN' });

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0]).toEqual(expect.objectContaining(livroDTO));
  });

  test('Deve ser possível cadastrar um livro', async function () {
    const { statusCode, body } = await request(app).post('/livros').send({
      nome: 'qualquer_nome',
      quantidade: 3,
      autor: 'qualquer_autor',
      genero: 'qualquer_genero',
      ISBN: 'qualquer_ISBN',
    });

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });
});
