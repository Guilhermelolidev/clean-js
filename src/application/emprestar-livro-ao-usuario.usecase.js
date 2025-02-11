const { Either, AppError } = require('../shared/errors');

module.exports = function emprestarLivroProUsuarioUseCase({
  emprestimosRepository,
}) {
  if (!emprestimosRepository) throw new AppError(AppError.dependencias);

  return async function ({
    usuario_id,
    livro_id,
    data_retorno,
    data_devolucao,
    data_saida,
  }) {
    const parametrosObrigatorios =
      usuario_id && livro_id && data_retorno && data_devolucao && data_saida;

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

    await emprestimosRepository.emprestar({
      usuario_id,
      livro_id,
      data_retorno,
      data_devolucao,
      data_saida,
    });

    return Either.Right(null);
  };
};
