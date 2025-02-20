const { Either } = require('../shared/errors');
const AppError = require('../shared/errors/AppError');

module.exports = function cadastrarUsuarioUseCase({ usuariosRepository }) {
  if (!usuariosRepository) throw new AppError(AppError.dependencias);

  return async function ({ nome_completo, CPF, telefone, endereco, email }) {
    const checaCampos = nome_completo && CPF && telefone && endereco && email;

    if (!checaCampos) throw new AppError(AppError.parametrosObrigatorios);

    const CPFJaCadastrado = await usuariosRepository.buscarPorCPF(CPF);

    if (CPFJaCadastrado) return Either.Left(Either.valorJaCadastrado('CPF'));

    const EmailJaCadastrado = await usuariosRepository.buscarPorEmail(email);

    if (EmailJaCadastrado)
      return Either.Left(Either.valorJaCadastrado('Email'));

    await usuariosRepository.cadastrar({
      nome_completo,
      CPF,
      telefone,
      endereco,
      email,
    });

    return Either.Right(null);
  };
};
