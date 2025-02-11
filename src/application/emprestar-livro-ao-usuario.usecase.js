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

    if (!parametrosObrigatorios)
      throw new AppError(AppError.parametrosObrigatorios);

    if (new Date(data_retorno) < new Date(data_saida))
      throw new AppError(
        'A data de retorno não pode ser menor que a data de saída'
      );

    const usuarioJaAlugou =
      await emprestimosRepository.verificaSeUsuarioJaAlugouOlivro({
        usuario_id,
        livro_id,
      });

    if (usuarioJaAlugou) {
      throw new AppError('Esse usuário já está com o livro alugado!');
    }

    await emprestimosRepository.cadastrar({
      usuario_id,
      livro_id,
      data_retorno,
      data_devolucao,
      data_saida,
    });

    return Either.Right(null);
  };
};
