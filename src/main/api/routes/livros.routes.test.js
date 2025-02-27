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

  test('Deve retornar um array vazio ao buscar um livro por nome ou ISBN se nada for encontrado', async function () {
    const { statusCode, body } = await request(app)
      .get('/livros')
      .query({ valor: 'qualquer_ISBN' });

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(0);
  });

  test('Deve retornar um erro se ao cadastrar os campos obrigatórios estiverem ausentes', async function () {
    const { statusCode, body } = await request(app).post('/livros').send({});
    expect(statusCode).toBe(400);
    expect(body.message).toBe('Erro de validação');
    expect(body.erros.fieldErrors).toEqual({
      nome: ['Nome é obrigatório'],
      quantidade: ['Quantidade é obrigatório'],
      autor: ['Autor é obrigatório'],
      genero: ['Genero é obrigatório'],
      ISBN: ['ISBN é obrigatório'],
    });
  });

  test('Deve retornar um erro se o campo obrigatório valor não for fornecido', async function () {
    const { statusCode, body } = await request(app).get('/livros');

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Erro de validação');
    expect(body.erros.fieldErrors).toEqual({
      valor: ['Valor é obrigatório'],
    });
  });
});
