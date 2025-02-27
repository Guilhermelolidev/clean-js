const request = require('supertest');
const {
  typeormLivroRepository,
} = require('../../../infra/db/typeorm/repositories/livro.repository');
const {
  typeormUsuariosRepository,
} = require('../../../infra/db/typeorm/repositories/usuarios.repository');
const { app } = require('../app');
const {
  typeormEmprestimoRepository,
} = require('../../../infra/db/typeorm/repositories/emprestimo.repository');

describe('Emprestimos Routes', () => {
  beforeEach(async function () {
    await typeormEmprestimoRepository.query('DELETE FROM emprestimos');
    await typeormLivroRepository.query('DELETE FROM livros');
    await typeormUsuariosRepository.query('DELETE FROM usuarios');
  });

  test('Deve ser possível emprestar um livro', async function () {
    const livro = await typeormLivroRepository.save({
      nome: 'qualquer_nome',
      quantidade: 3,
      autor: 'qualquer_autor',
      genero: 'qualquer_genero',
      ISBN: 'qualquer_ISBN',
    });

    const usuario = await typeormUsuariosRepository.save({
      nome_completo: 'nome_completo_qualquer',
      CPF: '123.123.123-12',
      endereco: 'qualquer_endereco',
      telefone: 'qualquer_telefone',
      email: 'qualquer_email@gmail.com',
    });

    const { statusCode, body } = await request(app).post('/emprestimos').send({
      livro_id: livro.id,
      usuario_id: usuario.id,
      data_saida: '2024-02-15',
      data_retorno: '2024-02-16',
    });

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });
});
