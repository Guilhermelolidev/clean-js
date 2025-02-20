const { ZodError } = require('zod');
const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');
const emprestarLivroProUsuarioController = require('./emprestar-livro-ao-usuario.controller');

describe('Emprestar livro ao usuario Controller', () => {
  const emprestarLivroProUsuarioUseCase = jest.fn();
  test('Deve retornar um httpResponse 200 e null se o livro for emprestado para o usuario', async () => {
    emprestarLivroProUsuarioUseCase.mockResolvedValue(Either.Right(null));
    const httpRequest = {
      body: {
        usuario_id: 1,
        livro_id: 1,
        data_retorno: '2025-02-02',
        data_saida: '2025-02-02',
      },
    };

    const response = await emprestarLivroProUsuarioController({
      emprestarLivroProUsuarioUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(201, null));
    expect(emprestarLivroProUsuarioUseCase).toHaveBeenCalledWith({
      usuario_id: 1,
      livro_id: 1,
      data_retorno: expect.any(Date),
      data_saida: expect.any(Date),
    });
    expect(emprestarLivroProUsuarioUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um httpResponse 400 e error.message se o empréstimo falhar por lógica do useCase', async () => {
    emprestarLivroProUsuarioUseCase.mockResolvedValue(
      Either.Left({ message: 'erro_validacao' })
    );
    const httpRequest = {
      body: {
        usuario_id: 1,
        livro_id: 1,
        data_retorno: '2025-02-02',
        data_saida: '2025-02-02',
      },
    };

    const response = await emprestarLivroProUsuarioController({
      emprestarLivroProUsuarioUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(400, 'erro_validacao'));
    expect(emprestarLivroProUsuarioUseCase).toHaveBeenCalledWith({
      usuario_id: 1,
      livro_id: 1,
      data_retorno: expect.any(Date),
      data_saida: expect.any(Date),
    });
    expect(emprestarLivroProUsuarioUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um erro do zod validator se der erro na validação dos dados', () => {
    const httpRequest = {
      body: {},
    };

    expect(() =>
      emprestarLivroProUsuarioController({
        emprestarLivroProUsuarioUseCase,
        httpRequest,
      })
    ).rejects.toBeInstanceOf(ZodError);
  });

  test('Deve retornar um throw App Error se o useCase e o httpRequest não forem fornecidos', async () => {
    await expect(() => emprestarLivroProUsuarioController({})).rejects.toThrow(
      new AppError(AppError.dependencias)
    );
  });
});
