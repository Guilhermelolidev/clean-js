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

  test('Deve retornar true se livro for encontrado por ISBN', async () => {
    await typeormLivroRepository.save(livroDTO);
    const livroEncontrado = await sut.buscarLivroPorISBN('ISBN_valido');

    expect(livroEncontrado).toBe(true);
  });

  test('Deve retornar false se livro não for encontrado por ISBN', async () => {
    const livroEncontrado = await sut.buscarLivroPorISBN('ISBN_valido');

    expect(livroEncontrado).toBe(false);
  });
});
