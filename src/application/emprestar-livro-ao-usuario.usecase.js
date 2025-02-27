const { Either, AppError } = require('../shared/errors');

module.exports = function emprestarLivroProUsuarioUseCase({
  emprestimosRepository,
  emailService,
}) {
  if (!emprestimosRepository || !emailService)
    throw new AppError(AppError.dependencias);

  return async function ({ usuario_id, livro_id, data_retorno, data_saida }) {
    const parametrosObrigatorios =
      usuario_id && livro_id && data_retorno && data_saida;
    if (!parametrosObrigatorios) {
      throw new AppError(AppError.parametrosObrigatorios);
    }
    if (data_saida.getTime() > data_retorno.getTime()) {
      return Either.Left(Either.dataRetornoMenorQueDataSaida);
    }
    const usuarioJaAlugou =
      await emprestimosRepository.verificaSeUsuarioJaAlugouOlivro({
        usuario_id,
        livro_id,
      });
    if (usuarioJaAlugou) {
      return Either.Left(Either.livroJaFoiAlugado);
    }
    const id = await emprestimosRepository.emprestar({
      usuario_id,
      livro_id,
      data_retorno,
      data_saida,
    });

    const { usuario, livro } =
      await emprestimosRepository.buscarEmprestimoComLivroEUsuarioPorID(id);

    await emailService.enviarEmail({
      data_saida,
      data_retorno,
      nome_usuario: usuario.nome_completo,
      CPF: usuario.CPF,
      email: usuario.email,
      nome_livro: livro.nome,
    });

    return Either.Right(null);
  };
};
