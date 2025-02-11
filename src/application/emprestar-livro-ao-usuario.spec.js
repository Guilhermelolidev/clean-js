const { AppError } = require('../shared/errors');
const emprestarLivroAoUsuarioUsecase = require('./emprestar-livro-ao-usuario.usecase');

describe('Emprestar livro para o usuário UseCase', function () {
  const emprestimosRepository = {
    cadastrar: jest.fn(),
    verificaSeUsuarioJaAlugouOlivro: jest.fn(),
  };

  beforeEach(() => {
    emprestimosRepository.cadastrar.mockClear();
    emprestimosRepository.verificaSeUsuarioJaAlugouOlivro.mockClear();
  });

  test('Deve retornar um throw App Error se o emprestimosRepository não for fornecido', () => {
    expect(() => emprestarLivroAoUsuarioUsecase({})).toThrow(
      new AppError(AppError.dependencias)
    );
  });

  test('Deve retornar um throw App Error se os parametros não forem fornecidos', async () => {
    const sut = emprestarLivroAoUsuarioUsecase({ emprestimosRepository });
    const output = sut({});

    await expect(output).rejects.toThrow(
      new AppError(AppError.parametrosObrigatorios)
    );
  });

  test('Deve retornar um throw new AppError se a data de retorno for menor que a data de saída', async () => {
    const sut = emprestarLivroAoUsuarioUsecase({ emprestimosRepository });

    const inputDTO = {
      usuario_id: 1,
      livro_id: 111,
      data_retorno: '2025-02-09',
      data_devolucao: '2025-02-15',
      data_saida: '2025-02-10',
    };

    await expect(sut(inputDTO)).rejects.toThrow(
      new AppError('A data de retorno não pode ser menor que a data de saída')
    );
  });

  test('Deve retornar um throw new AppError se o usuario tentar alugar um livro com o mesmo ISBN', async () => {
    const sut = emprestarLivroAoUsuarioUsecase({ emprestimosRepository });
    emprestimosRepository.verificaSeUsuarioJaAlugouOlivro.mockResolvedValue(
      true
    );

    const inputDTO = {
      usuario_id: 1,
      livro_id: 111,
      data_retorno: '2025-02-11',
      data_devolucao: '2025-02-15',
      data_saida: '2025-02-10',
    };

    await expect(sut(inputDTO)).rejects.toThrow(
      new AppError('Esse usuário já está com o livro alugado!')
    );

    expect(emprestimosRepository.cadastrar).not.toHaveBeenCalled();
  });

  test('Emprestar livro pro usuário', async () => {
    emprestimosRepository.verificaSeUsuarioJaAlugouOlivro.mockResolvedValue(
      false
    );
    const inputDTO = {
      usuario_id: 'usuario_valido',
      livro_id: 'livro_valido',
      data_retorno: 'data_retorno_valido',
      data_devolucao: 'data_devoluacao_valido',
      data_saida: 'data_saida_valida',
    };
    const sut = emprestarLivroAoUsuarioUsecase({ emprestimosRepository });
    const output = await sut(inputDTO);

    expect(output.right).toBeNull();
    expect(emprestimosRepository.cadastrar).toHaveBeenCalledTimes(1);
    expect(emprestimosRepository.cadastrar).toHaveBeenCalledWith(inputDTO);
  });
});
