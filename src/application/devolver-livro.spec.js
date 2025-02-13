const devolverLivroUsecase = require('./devolver-livro.usecase');

describe('Devolver livro UseCase', function () {
  const emprestimosRepository = {
    devolver: jest.fn(),
  };

  test('Deve ser possivel devolver um livro sem multa', async () => {
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
});
