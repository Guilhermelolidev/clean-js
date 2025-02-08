const AppError = require('../shared/errors/AppError');

module.exports = function cadastrarUsuarioUseCase({ usuariosRepository }) {
  if (!usuariosRepository) throw new AppError(AppError.dependencias);

  return async function ({ nome_completo, CPF, telefone, endereco, email }) {
    const checaCampos = nome_completo && CPF && telefone && endereco && email;

    if (!checaCampos) throw new AppError(AppError.parametrosObrigatorios);

    const CPFJaCadastrado = await usuariosRepository.buscarPorCPF(CPF);

    if (CPFJaCadastrado) throw new AppError('CPF já cadastrado');

    await usuariosRepository.cadastrar({
      nome_completo,
      CPF,
      telefone,
      endereco,
      email,
    });
  };
};
