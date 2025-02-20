const emprestimosPendentesFixture = require('../../../tests/fixtures/buscar-emprestimos-pendentes');
const { Either, AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');
const buscarEmprestimosPendentesController = require('./buscar-emprestimos-pendentes.controller');

describe('Buscar emprestimos pendentes Controller', () => {
  const buscarEmprestimosPendentesUseCase = jest.fn();

  test('Deve retornar um httpResponse 200 e os empréstimos pendentes', async () => {
    buscarEmprestimosPendentesUseCase.mockResolvedValue(
      Either.Right(emprestimosPendentesFixture)
    );
    const response = await buscarEmprestimosPendentesController({
      buscarEmprestimosPendentesUseCase,
    });

    expect(response).toEqual(httpResponse(200, emprestimosPendentesFixture));
    expect(buscarEmprestimosPendentesUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um throw app error se o useCase não for fornecido', () => {
    expect(() => buscarEmprestimosPendentesController({})).rejects.toThrow(
      new AppError(AppError.dependencias)
    );
  });
});
