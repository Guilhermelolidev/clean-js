const { AppError } = require('../shared/errors');
const devolverLivroUsecase = require('./devolver-livro.usecase');

describe('Devolver livro UseCase', function () {
  const emprestimosRepository = {
    devolver: jest.fn(),
  };

  test('Deve retornar um throw new AppError caso o emprestimosRepository não for fornecido', () => {
    expect(() => devolverLivroUsecase({})).toThrow(
      new AppError(AppError.dependencias)
    );
  });

  test('Deve retornar um throw new AppError caso os parametros não sejam fornecidos', () => {
    const sut = devolverLivroUsecase({ emprestimosRepository });
    const output = sut({});

    expect(output).rejects.toThrow(
      new AppError(AppError.parametrosObrigatorios)
    );
  });

  test('Deve ser possivel devolver um livro sem multa', async () => {
    emprestimosRepository.devolver.mockResolvedValue({
      data_retorno: new Date('2025-02-14'),
    });
    const inputDTO = {
      emprestimo_id: 'id_valido',
      data_devolucao: new Date('2025-02-13'),
    };

    const sut = devolverLivroUsecase({ emprestimosRepository });
    const output = await sut(inputDTO);

    expect(output.right).toBe('Multa por atraso R$ 0');
    expect(emprestimosRepository.devolver).toHaveBeenCalledWith(inputDTO);
    expect(emprestimosRepository.devolver).toHaveBeenCalledTimes(1);
  });

  test('Retornar multa de R$10,00 quando houver atraso na devolucao', async () => {
    emprestimosRepository.devolver.mockResolvedValue({
      data_retorno: new Date('2025-02-12'),
    });
    const inputDTO = {
      emprestimo_id: 'id_valido',
      data_devolucao: new Date('2025-02-13'),
    };

    const sut = devolverLivroUsecase({ emprestimosRepository });
    const output = await sut(inputDTO);

    expect(output.right).toBe('Multa por atraso R$ 10,00');
    expect(emprestimosRepository.devolver).toHaveBeenCalledWith(inputDTO);
    expect(emprestimosRepository.devolver).toHaveBeenCalledTimes(1);
  });
});
