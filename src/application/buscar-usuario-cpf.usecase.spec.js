const { AppError, Either } = require('../shared/errors');
const buscarUsuarioCpfUsecase = require('./buscar-usuario-cpf.usecase');

describe('Buscar Usuario Por CPF UseCase', function () {
  const usuariosRepository = {
    buscarUsuarioPorCPF: jest.fn(),
  };

  test('Deve retornar um throw AppError se o usuariosRepository não for fornecido', function () {
    expect(() => buscarUsuarioCpfUsecase({})).toThrow(AppError.dependencias);
  });

  test('Deve retornar o usuario encontrado', async function () {
    const cpfDTO = {
      CPF: 'CPF_cadastrado',
    };
    const outputDTO = {
      nome_completo: 'nome_valido',
      CPF: 'CPF_cadastrado',
      telefone: 'telefone_valido',
      endereco: 'endereco_valido',
      email: 'email_valido',
    };

    usuariosRepository.buscarUsuarioPorCPF.mockResolvedValue(outputDTO);

    const sut = buscarUsuarioCpfUsecase({ usuariosRepository });
    const output = await sut(cpfDTO);
    expect(output.right).toEqual(outputDTO);
    expect(usuariosRepository.buscarUsuarioPorCPF).toHaveBeenCalledWith(
      cpfDTO.CPF
    );
    expect(usuariosRepository.buscarUsuarioPorCPF).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar null se nao existir nenhum usuario com o CPF informado', async function () {
    const cpfDTO = {
      CPF: 'cpf_valido',
    };
    usuariosRepository.buscarUsuarioPorCPF.mockResolvedValue(null);
    const sut = buscarUsuarioCpfUsecase({ usuariosRepository });
    const output = await sut(cpfDTO);
    expect(output.right).toBeNull();
    expect(usuariosRepository.buscarUsuarioPorCPF).toHaveBeenCalledWith(
      cpfDTO.CPF
    );
    expect(usuariosRepository.buscarUsuarioPorCPF).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um throw AppError se os campos obrigatorios não forem fornecidos', async function () {
    const sut = buscarUsuarioCpfUsecase({ usuariosRepository });
    await expect(() => sut({})).rejects.toThrow(
      new AppError(AppError.parametrosObrigatorios)
    );
  });
});
