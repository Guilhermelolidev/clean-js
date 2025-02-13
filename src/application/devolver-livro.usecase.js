const emprestimoEntity = require('../enterprise/entities/emprestimo.entity');
const { AppError, Either } = require('../shared/errors');

module.exports = function devolverLivroUseCase({ emprestimosRepository }) {
  if (!emprestimosRepository) throw new AppError(AppError.dependencias);

  return async function ({ emprestimo_id, data_devolucao }) {
    const parametrosObrigatorios = emprestimo_id && data_devolucao;

    if (!parametrosObrigatorios) {
      throw new AppError(AppError.parametrosObrigatorios);
    }

    const { data_retorno } = await emprestimosRepository.devolver({
      emprestimo_id,
      data_devolucao,
    });

    const calcularMulta = emprestimoEntity.calcularMulta({
      data_retorno,
      data_devolucao,
    });

    return Either.Right(calcularMulta);
  };
};
