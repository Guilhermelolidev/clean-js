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

  test('Deve retornar um array de livros se os livros forem encontrados por Nome', async () => {
    await typeormLivroRepository.save(livroDTO);
    const livroEncontrado = await sut.buscarLivroPorNomeOuISBN('livro_valido');

    expect(livroEncontrado).toHaveLength(1);
    expect(livroEncontrado[0].id).toBeDefined();
    expect(livroEncontrado[0].nome).toBe('livro_valido');
  });

  test('Deve retornar um array de livros se os livros forem encontrados por ISBN', async () => {
    await typeormLivroRepository.save(livroDTO);
    const livroEncontrado = await sut.buscarLivroPorNomeOuISBN('ISBN_valido');

    expect(livroEncontrado).toHaveLength(1);
    expect(livroEncontrado[0].id).toBeDefined();
    expect(livroEncontrado[0].ISBN).toBe('ISBN_valido');
  });

  test('Deve retornar vazio se nenhum livro for encontrado', async () => {
    const livroEncontrado = await sut.buscarLivroPorNomeOuISBN('ISBN_valido');

    expect(livroEncontrado).toHaveLength(0);
  });
});
