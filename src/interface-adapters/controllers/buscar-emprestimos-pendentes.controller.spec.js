const { Either } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');
const buscarEmprestimosPendentesController = require('./buscar-emprestimos-pendentes.controller');

describe('Buscar emprestimos pendentes Controller', () => {
  const buscarEmprestimosPendentesUseCase = jest.fn();
  test('Deve retornar os empréstimos pendentes', async () => {
    const emprestimosDTO = [
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
    ];
    buscarEmprestimosPendentesUseCase.mockResolvedValue(
      Either.Right(emprestimosDTO)
    );
    const response = await buscarEmprestimosPendentesController({
      buscarEmprestimosPendentesUseCase,
    });

    expect(response).toEqual(httpResponse(200, emprestimosDTO));
    expect(buscarEmprestimosPendentesUseCase).toHaveBeenCalledTimes(1);
  });
});
