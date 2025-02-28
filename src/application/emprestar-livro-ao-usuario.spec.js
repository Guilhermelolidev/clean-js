const { AppError, Either } = require('../shared/errors');
const emprestarLivroAoUsuarioUsecase = require('./emprestar-livro-ao-usuario.usecase');

describe('Emprestar livro para o usuário UseCase', function () {
  const emprestimosRepository = {
    emprestar: jest.fn(),
    verificaSeUsuarioJaAlugouOlivro: jest.fn(),
    buscarEmprestimoComLivroEUsuarioPorID: jest.fn(),
  };

  const emailService = {
    enviarEmail: jest.fn(),
  };

  test('Deve retornar um throw App Error se o emprestimosRepository não for fornecido', () => {
    expect(() => emprestarLivroAoUsuarioUsecase({})).toThrow(
      new AppError(AppError.dependencias)
    );
  });

  test('Deve retornar um throw App Error se os parametros não forem fornecidos', async () => {
    const sut = emprestarLivroAoUsuarioUsecase({
      emprestimosRepository,
      emailService,
    });
    const output = sut({});

    await expect(output).rejects.toThrow(
      new AppError(AppError.parametrosObrigatorios)
    );
  });

  test('Deve retornar um Either.left se a data de retorno for menor que a data de saída', async () => {
    const sut = emprestarLivroAoUsuarioUsecase({
      emprestimosRepository,
      emailService,
    });

    const inputDTO = {
      usuario_id: 'usuario_valido',
      livro_id: 'livro_valido',
      data_retorno: new Date('2025-01-01'),
      data_devolucao: new Date('2025-01-02'),
      data_saida: new Date('2025-01-02'),
    };
    const output = await sut(inputDTO);

    expect(output.left).toBe(Either.dataRetornoMenorQueDataSaida);
  });

  test('Deve retornar um Either.left se o usuario tentar alugar um livro com o mesmo ISBN', async () => {
    const sut = emprestarLivroAoUsuarioUsecase({
      emprestimosRepository,
      emailService,
    });
    emprestimosRepository.verificaSeUsuarioJaAlugouOlivro.mockResolvedValue(
      true
    );

    const inputDTO = {
      usuario_id: 'usuario_valido',
      livro_id: 'livro_valido',
      data_retorno: new Date('2025-01-02'),
      data_devolucao: new Date('2025-01-02'),
      data_saida: new Date('2025-01-01'),
    };

    const output = await sut(inputDTO);

    expect(output.left).toBe(Either.livroJaFoiAlugado);

    expect(emprestimosRepository.emprestar).not.toHaveBeenCalled();
  });

  test('Emprestar livro pro usuário', async () => {
    emprestimosRepository.verificaSeUsuarioJaAlugouOlivro.mockResolvedValue(
      false
    );
    emprestimosRepository.emprestar.mockResolvedValue('qualquer_id');
    emprestimosRepository.buscarEmprestimoComLivroEUsuarioPorID.mockResolvedValue(
      {
        usuario: {
          nome: 'qualquer_nome_usuario',
          CPF: 'qualquer_CPF',
          email: 'qualquer_email',
        },
        livro: {
          nome: 'nome_livro',
        },
      }
    );
    const inputDTO = {
      usuario_id: 'usuario_valido',
      livro_id: 'livro_valido',
      data_retorno: new Date('2025-01-02'),
      data_saida: new Date('2025-01-01'),
    };
    const sut = emprestarLivroAoUsuarioUsecase({
      emprestimosRepository,
      emailService,
    });
    const output = await sut(inputDTO);

    expect(output.right).toBeNull();
    expect(emprestimosRepository.emprestar).toHaveBeenCalledTimes(1);
    expect(emprestimosRepository.emprestar).toHaveBeenCalledWith(inputDTO);
    expect(emailService.enviarEmail).toHaveBeenCalledWith({
      data_saida: inputDTO.data_saida,
      data_retorno: inputDTO.data_retorno,
      nome_usuario: 'qualquer_nome_usuario',
      CPF: 'qualquer_CPF',
      email: 'qualquer_email',
      nome_livro: 'nome_livro',
    });
  });
});
