const { AppError } = require('../../shared/errors');
const emprestimoEntity = require('./emprestimo.entity');

describe('Emprestimo Entity', function () {
  test('Calcular multa - Retornar throw app error se parametros não forem fornecidos', () => {
    expect(() => emprestimoEntity.calcularMulta({})).toThrow(
      AppError.parametrosObrigatorios
    );
  });

  test('Calcular multa - sem atraso', () => {
    const resultado = emprestimoEntity.calcularMulta({
      data_devolucao: '2025-01-01',
      data_retorno: '2025-01-01',
    });

    expect(resultado).toBe('Multa por atraso R$ 0');
  });

  test('Calcular multa - com atraso', () => {
    const resultado = emprestimoEntity.calcularMulta({
      data_devolucao: '2025-01-02',
      data_retorno: '2025-01-01',
    });

    expect(resultado).toBe('Multa por atraso R$ 10,00');
  });
});
