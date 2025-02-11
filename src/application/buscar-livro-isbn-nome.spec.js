const { AppError, Either } = require('../shared/errors');
const buscarLivroPorISBNOuNomeUseCase = require('./buscar-livro-isbn-nome.usecase');

describe('Buscar livro por ISBN ou nome UseCase', function () {
  const livrosRepository = {
    buscarLivroPorNomeOuISBN: jest.fn(),
  };

  test('Deve retornar um throw AppError se livrosRepository não for fornecido', function () {
    expect(() => buscarLivroPorISBNOuNomeUseCase({})).toThrow(
      AppError.dependencias
    );
  });

  test('Deve retornar um throw AppError se os parametros nao forem fornecidos', async function () {
    const sut = buscarLivroPorISBNOuNomeUseCase({ livrosRepository });
    const output = sut({});

    expect(output).rejects.toThrow(
      new AppError(AppError.parametrosObrigatorios)
    );
  });

  test('Deve retornar um array vazio caso livro não seja encontrado por ISBN ou nome', async function () {
    livrosRepository.buscarLivroPorNomeOuISBN.mockResolvedValue([]);
    const inputDTO = {
      valor: 'valor_valido',
    };
    const sut = buscarLivroPorISBNOuNomeUseCase({ livrosRepository });
    const output = await sut(inputDTO);

    expect(output.right).toEqual([]);
    expect(livrosRepository.buscarLivroPorNomeOuISBN).toHaveBeenCalledTimes(1);
    expect(livrosRepository.buscarLivroPorNomeOuISBN).toHaveBeenCalledWith(
      inputDTO.valor
    );
  });

  test('Deve buscar o livro por ISBN ou nome', async function () {
    const inputDTO = {
      valor: 'valor_valido',
    };
    const outputDTO = {
      id: 'id_valido',
      nome: 'nome_valido',
      quantidade: 'quantidade_valida',
      autor: 'autor_valido',
      genero: 'genero_valido',
      ISBN: 'ISBN_valido',
    };
    livrosRepository.buscarLivroPorNomeOuISBN.mockResolvedValue(outputDTO);

    const sut = buscarLivroPorISBNOuNomeUseCase({ livrosRepository });
    const output = await sut(inputDTO);

    expect(output.right).toEqual(outputDTO);
    expect(livrosRepository.buscarLivroPorNomeOuISBN).toHaveBeenCalledTimes(1);
    expect(livrosRepository.buscarLivroPorNomeOuISBN).toHaveBeenCalledWith(
      inputDTO.valor
    );
  });
});
