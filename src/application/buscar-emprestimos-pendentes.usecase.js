const { AppError, Either } = require('../shared/errors');

module.exports = function buscarEmprestimosPendentesUseCase({
  emprestimosRepository,
}) {
  if (!emprestimosRepository) throw new AppError(AppError.dependencias);

  return async function () {
    const emprestimos =
      await emprestimosRepository.buscarPendentesComLivroComUsuario();
    return Either.Right(emprestimos);
  };
};
