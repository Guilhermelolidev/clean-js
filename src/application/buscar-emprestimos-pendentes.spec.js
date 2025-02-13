// - Emprestimo (usuario_id, livro_id, data_retorno, data_devolucao, data_saida)

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
    emprestimosRepository.buscarPendentesComLivroComUsuario.mockResolvedValue([
      {
        usuario: {
          nome: 'qualquer_nome_valido',
          CPF: 'qualquer_cpf',
        },
        livro: {
          nome: 'qualquer_nome_livro',
        },
        data_saida: '2024-10-01',
        data_saida: '2024-10-02',
      },
      {
        usuario: {
          nome: 'qualquer_nome_usuario',
          CPF: 'qualquer_cpf_valido',
        },
        livro: {
          nome: 'qualquer_nome_livro_valido',
        },
        data_saida: '2024-10-01',
        data_saida: '2024-10-02',
      },
    ]);

    const sut = buscarEmprestimosPendentesUsecase({ emprestimosRepository });
    const output = await sut();

    expect(output.right).toHaveLength(2);
    expect(output.right[0].usuario.nome).toBe('qualquer_nome_valido');
    expect(output.right[0].usuario.CPF).toBe('qualquer_cpf');
  });
});
