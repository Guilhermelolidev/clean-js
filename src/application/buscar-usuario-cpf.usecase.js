const { AppError, Either } = require('../shared/errors');

module.exports = function buscarUsuarioPorCPFUseCase({ usuariosRepository }) {
  if (!usuariosRepository) throw new AppError(AppError.dependencias);

  return async function ({ CPF }) {
    if (!CPF) throw new AppError(AppError.parametrosObrigatorios);

    const usuario = await usuariosRepository.buscarUsuarioPorCPF(CPF);

    if (!usuario) return null;

    return Either.Right(usuario);
  };
};
