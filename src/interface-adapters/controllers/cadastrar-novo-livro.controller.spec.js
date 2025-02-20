const { ZodError } = require('zod');
const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');
const cadastrarNovoLivroController = require('./cadastrar-novo-livro.controller');

describe('Cadastrar Novo livro Controller', function () {
  const cadastrarNovoLivroUseCase = jest.fn();
  test('Deve retornar um httpResponse 201 e null se o livro for cadastrado com sucesso', async () => {
    cadastrarNovoLivroUseCase.mockResolvedValue(Either.Right(null));
    const httpRequest = {
      body: {
        nome: 'nome_valido',
        quantidade: 1,
        autor: 'autor_valido',
        genero: 'genero_valido',
        ISBN: 'isbn_valido',
      },
    };

    const response = await cadastrarNovoLivroController({
      cadastrarNovoLivroUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(201, null));
    expect(cadastrarNovoLivroUseCase).toHaveBeenCalledWith(httpRequest.body);
    expect(cadastrarNovoLivroUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um httpResponse 400 e message se o livro não for cadastrado com sucesso no useCase', async () => {
    cadastrarNovoLivroUseCase.mockResolvedValue(
      Either.Left({ message: 'erro_validacao' })
    );
    const httpRequest = {
      body: {
        nome: 'nome_valido',
        quantidade: 1,
        autor: 'autor_valido',
        genero: 'genero_valido',
        ISBN: 'isbn_valido',
      },
    };

    const response = await cadastrarNovoLivroController({
      cadastrarNovoLivroUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(400, 'erro_validacao'));
    expect(cadastrarNovoLivroUseCase).toHaveBeenCalledWith(httpRequest.body);
    expect(cadastrarNovoLivroUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um throw App Error se o useCase e o httpRequest não forem fornecidos', async () => {
    await expect(() => cadastrarNovoLivroController({})).rejects.toThrow(
      new AppError(AppError.dependencias)
    );
  });

  test('Deve retornar um erro do zod validator se der erro na validação dos dados', () => {
    const httpRequest = {
      body: {},
    };

    expect(() =>
      cadastrarNovoLivroController({ cadastrarNovoLivroUseCase, httpRequest })
    ).rejects.toBeInstanceOf(ZodError);
  });
});
