const { AppError, Either } = require('../shared/errors');
const cadastrarNovoLivroUsecase = require('./cadastrar-novo-livro.usecase');

describe('Cadastrar novo livro UseCase', function () {
  const livrosRepository = {
    buscarLivroPorISBN: jest.fn(),
    cadastrar: jest.fn(),
  };

  test('Deve retornar um throw AppError se o livrosRepository não for fornecido', function () {
    expect(() => cadastrarNovoLivroUsecase({})).toThrow(AppError.dependencias);
  });

  test('Deve retornar um throw AppError se os campos obrigatorios nao forem fornecidos', function () {
    const sut = cadastrarNovoLivroUsecase({ livrosRepository });
    const output = sut({});
    expect(output).rejects.toThrow(
      new AppError(AppError.parametrosObrigatorios)
    );
  });

  test('Deve verificar se o ISBN recebido ja esta cadastrado', async function () {
    livrosRepository.buscarLivroPorISBN.mockResolvedValue(true);
    const livroDTO = {
      nome: 'livro_valido',
      quantidade: 1,
      autor: 'autor_valido',
      genero: 'genero valido',
      ISBN: 'isbn_ja_existe',
    };
    const sut = cadastrarNovoLivroUsecase({ livrosRepository });
    const output = await sut(livroDTO);
    expect(output.left).toEqual(Either.valorJaCadastrado('ISBN'));
  });

  test('Deve cadastrar um novo livro', async function () {
    livrosRepository.buscarLivroPorISBN.mockResolvedValue(false);
    const livroDTO = {
      nome: 'livro_valido',
      quantidade: 1,
      autor: 'autor_valido',
      genero: 'genero valido',
      ISBN: 'isbn_valido',
    };
    const sut = cadastrarNovoLivroUsecase({ livrosRepository });
    const output = await sut(livroDTO);

    expect(livrosRepository.cadastrar).toHaveBeenCalledWith(livroDTO);
    expect(livrosRepository.cadastrar).toHaveBeenCalledTimes(1);
    expect(output.right).toBeNull();
  });
});
