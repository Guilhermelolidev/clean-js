// - Emprestimo (usuario_id, livro_id, data_retorno, data_devolucao, data_saida)

const emprestimosPendentesFixture = require('../../tests/fixtures/buscar-emprestimos-pendentes');
const { AppError } = require('../shared/errors');
const buscarEmprestimosPendentesUsecase = require('./buscar-emprestimos-pendentes.usecase');

describe('Buscar emprestimos pendentes UseCase', function () {
  const emprestimosRepository = {
    buscarPendentesComLivroComUsuario: jest.fn(),
  };

  test('Retornar throw app error caso emprestimosRepository não for fornecido', () => {
    expect(() => buscarEmprestimosPendentesUsecase({})).toThrow(
      AppError.dependencias
    );
  });

  test('Buscar emprestimos pendentes', async () => {
    emprestimosRepository.buscarPendentesComLivroComUsuario.mockResolvedValue(
      emprestimosPendentesFixture
    );

    const sut = buscarEmprestimosPendentesUsecase({ emprestimosRepository });
    const output = await sut();

    expect(output.right).toHaveLength(2);
    expect(output.right[0].usuario.nome).toBe('qualquer_nome_valido');
    expect(output.right[0].usuario.CPF).toBe('qualquer_cpf');
  });
});
