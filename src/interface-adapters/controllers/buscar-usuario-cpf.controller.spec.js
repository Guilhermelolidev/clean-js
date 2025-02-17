const { ZodError } = require('zod');
const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');
const buscarUsuarioPorCPFController = require('./buscar-usuario-cpf.controller');

describe('Buscar usuario por CPF controller', () => {
  const buscarUsuarioPorCPFUseCase = jest.fn();

  test('Deve retornar um throw new app error se as dependencias não forem fornecidas', () => {
    expect(() => buscarUsuarioPorCPFController({})).rejects.toThrow(
      new AppError(AppError.dependencias)
    );
  });

  test('Deve retornar um erro do zod validator se der erro na validação dos dados', () => {
    const httpRequest = {
      params: {},
    };

    expect(() =>
      buscarUsuarioPorCPFController({ buscarUsuarioPorCPFUseCase, httpRequest })
    ).rejects.toBeInstanceOf(ZodError);
  });

  test('Deve retornar um httpResponse 200 e um usuario se o mesmo for encontrado', async function () {
    const usuarioDTO = {
      id: 'qualquer_id',
      nome_completo: 'qualquer_nome',
      CPF: '123.123.123-12',
      endereco: 'qualquer_endereco',
      telefone: 'qualquer_telefone',
      email: 'qualquer_email',
    };

    buscarUsuarioPorCPFUseCase.mockResolvedValue(Either.Right(usuarioDTO));

    const httpRequest = {
      params: {
        CPF: '123.123.123-12',
      },
    };

    const response = await buscarUsuarioPorCPFController({
      buscarUsuarioPorCPFUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(200, usuarioDTO));
    expect(buscarUsuarioPorCPFUseCase).toHaveBeenCalledTimes(1);
    expect(buscarUsuarioPorCPFUseCase).toHaveBeenCalledWith(httpRequest.params);
  });

  test('Deve retornar um httpResponse 200 e null caso o usuario nao for encontrado por CPF', async () => {
    buscarUsuarioPorCPFUseCase.mockResolvedValue(Either.Right(null));
    const httpRequest = {
      params: {
        CPF: '123.123.123-12',
      },
    };

    const response = await buscarUsuarioPorCPFController({
      buscarUsuarioPorCPFUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(200, null));
    expect(buscarUsuarioPorCPFUseCase).toHaveBeenCalledTimes(1);
    expect(buscarUsuarioPorCPFUseCase).toHaveBeenCalledWith(httpRequest.params);
  });
});
