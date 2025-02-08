const { Either } = require('../shared/errors');
const AppError = require('../shared/errors/AppError');
const cadastrarUsuarioUsecase = require('./cadastrar-usuario.usecase');

describe('Cadastrar usuario UseCase', function () {
  const usuariosRepository = {
    cadastrar: jest.fn(),
    buscarPorCPF: jest.fn(),
    buscarPorEmail: jest.fn(),
  };

  test('Deve poder cadastrar um usuario', async function () {
    const usuarioDTO = {
      nome_completo: 'nome_valido',
      CPF: 'CPF_valido',
      telefone: 'telefone_valido',
      endereco: 'endereco_valido',
      email: 'email_valido',
    };

    const sut = cadastrarUsuarioUsecase({ usuariosRepository });
    const output = await sut(usuarioDTO);

    expect(output.right).toBeNull();
    expect(usuariosRepository.cadastrar).toHaveBeenCalledWith(usuarioDTO);
    expect(usuariosRepository.cadastrar).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um throw AppError se o usuariosRepository não for fornecido', function () {
    expect(() => cadastrarUsuarioUsecase({})).toThrow(AppError.dependencias);
  });

  test('Deve retornar um throw AppError se os campos obrigatorios nao forem fornecidos', async function () {
    const sut = cadastrarUsuarioUsecase({ usuariosRepository });
    await expect(() => sut({})).rejects.toThrow(
      new AppError(AppError.parametrosObrigatorios)
    );
  });

  test('Deve existir um erro se já existir um cadastro com o CPF recebido', async function () {
    // quando tem retorno de um metodo para uma variavel, usar mock
    usuariosRepository.buscarPorCPF.mockResolvedValue(true);

    const usuarioDTO = {
      nome_completo: 'nome_valido',
      CPF: 'CPF_ja_cadastrado',
      telefone: 'telefone_valido',
      endereco: 'endereco_valido',
      email: 'email_valido',
    };

    const sut = cadastrarUsuarioUsecase({ usuariosRepository });
    const output = await sut(usuarioDTO);
    expect(output.right).toBeNull();
    expect(output.left).toEqual(Either.valorJaCadastrado('CPF'));
    expect(usuariosRepository.buscarPorCPF).toHaveBeenCalledWith(
      usuarioDTO.CPF
    );
    expect(usuariosRepository.buscarPorCPF).toHaveBeenCalledTimes(1);
  });

  test('Deve existir um erro se já existir um cadastro com o Email recebido', async function () {
    // quando tem retorno de um metodo para uma variavel, usar mock
    usuariosRepository.buscarPorCPF.mockResolvedValue(false);
    usuariosRepository.buscarPorEmail.mockResolvedValue(true);

    const usuarioDTO = {
      nome_completo: 'nome_valido',
      CPF: 'cpf_valido',
      telefone: 'telefone_valido',
      endereco: 'endereco_valido',
      email: 'email_ja_cadastrado',
    };

    const sut = cadastrarUsuarioUsecase({ usuariosRepository });
    const output = await sut(usuarioDTO);
    expect(output.right).toBeNull();
    expect(output.left).toEqual(Either.valorJaCadastrado('Email'));
    expect(usuariosRepository.buscarPorEmail).toHaveBeenCalledWith(
      usuarioDTO.email
    );
    expect(usuariosRepository.buscarPorEmail).toHaveBeenCalledTimes(1);
  });
});
