const {
  typeormLivroRepository,
  livrosRepository,
} = require('./livro.repository');

describe('Livro Repository', () => {
  let sut;

  beforeEach(async function () {
    await typeormLivroRepository.delete({});
  });

  beforeAll(function () {
    sut = livrosRepository();
  });

  const livroDTO = {
    nome: 'livro_valido',
    quantidade: 3,
    autor: 'autor_valido',
    genero: 'genero_valido',
    ISBN: 'ISBN_valido',
  };

  test('Deve retornar void ao criar um livro novo', async () => {
    const livroCadastrado = await sut.cadastrar(livroDTO);
    expect(livroCadastrado).toBeUndefined();
  });
});
