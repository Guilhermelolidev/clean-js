const { ZodError } = require('zod');
const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');
const devolverLivroController = require('./devolver-livro.controller');

describe('Devolver livro Controller', () => {
  const devolverLivroUseCase = jest.fn();

  test('Deve retornar um httpResponse 200 com o resultado ao devolver o livro', async () => {
    devolverLivroUseCase.mockResolvedValue(Either.Right(null));
    const httpRequest = {
      params: {
        emprestimo_id: 1,
      },
      body: {
        data_devolucao: '2025-01-01',
      },
    };

    const response = await devolverLivroController({
      devolverLivroUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(200, null));
    expect(devolverLivroUseCase).toHaveBeenCalledWith({
      emprestimo_id: 1,
      data_devolucao: '2025-01-01',
    });
    expect(devolverLivroUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar uma mensagem ao devolver um livro informando uma multa ou não', async () => {
    devolverLivroUseCase.mockResolvedValue(
      Either.Right('Multa por atraso: R$ 0')
    );

    const httpRequest = {
      params: {
        emprestimo_id: 1,
      },
      body: {
        data_devolucao: '2025-01-01',
      },
    };

    const response = await devolverLivroController({
      devolverLivroUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(200, 'Multa por atraso: R$ 0'));
    expect(devolverLivroUseCase).toHaveBeenCalledWith({
      emprestimo_id: 1,
      data_devolucao: '2025-01-01',
    });
    expect(devolverLivroUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um throw app error se o useCase e o httpRequest não forem fornecedidos', () => {
    expect(() => devolverLivroController({})).rejects.toThrow(
      new AppError(AppError.dependencias)
    );
  });

  test('Deve retornar um erro do zod validator se der erro na validação dos dados', () => {
    const httpRequest = {
      body: {},
      params: {
        emprestimo_id: 1,
      },
    };

    expect(() =>
      devolverLivroController({
        devolverLivroUseCase,
        httpRequest,
      })
    ).rejects.toBeInstanceOf(ZodError);
  });
});
