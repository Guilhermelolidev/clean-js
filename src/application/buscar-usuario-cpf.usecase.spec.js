const { AppError } = require('../shared/errors');
const buscarUsuarioCpfUsecase = require('./buscar-usuario-cpf.usecase');

describe('Buscar Usuario Por CPF UseCase', function () {
  const usuariosRepository = {
    buscarUsuarioPorCPF: jest.fn(),
  };

  test('Deve retornar um throw AppError se o usuariosRepository não for fornecido', function () {
    expect(() => buscarUsuarioCpfUsecase({})).toThrow(AppError.dependencias);
  });

  test('Deve retornar o usuario encontrado', async function () {
    const CPF = 'cpf_valido';
    const usuarioDTO = {
      nome_completo: 'nome_valido',
      CPF: 'cpf_valido',
      telefone: 'telefone_valido',
      endereco: 'endereco_valido',
      email: 'email_valido',
    };
    usuariosRepository.buscarUsuarioPorCPF.mockResolvedValue(usuarioDTO);
    const sut = buscarUsuarioCpfUsecase({ usuariosRepository });
    const output = await sut({ CPF });
    expect(output).toBe(usuarioDTO);
  });

  test('Deve retornar null se o usuario não for encontrado', async function () {
    const CPF = 'cpf_valido';
    usuariosRepository.buscarUsuarioPorCPF.mockResolvedValue(null);
    const sut = buscarUsuarioCpfUsecase({ usuariosRepository });
    const output = await sut({ CPF });
    expect(output).toBeNull();
  });

  test('Deve retornar um throw AppError se os campos obrigatorios nao forem fornecidos', async function () {
    const sut = buscarUsuarioCpfUsecase({ usuariosRepository });
    await expect(() => sut({})).rejects.toThrow(
      new AppError(AppError.parametrosObrigatorios)
    );
  });
});
