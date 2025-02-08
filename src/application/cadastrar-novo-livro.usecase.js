const { AppError, Either } = require('../shared/errors');

module.exports = function cadastrarNovoLivroUseCase({ livrosRepository }) {
  if (!livrosRepository) throw new AppError(AppError.dependencias);

  return async function ({ nome, quantidade, autor, genero, ISBN }) {
    const camposObrigatorios = nome && quantidade && autor && genero && ISBN;

    if (!camposObrigatorios)
      throw new AppError(AppError.parametrosObrigatorios);

    const ISBNJaExiste = await livrosRepository.buscarLivroPorISBN(ISBN);

    if (ISBNJaExiste) return Either.Left(Either.valorJaCadastrado('ISBN'));

    await livrosRepository.cadastrar({
      nome,
      quantidade,
      autor,
      genero,
      ISBN,
    });

    return Either.Right(null);
  };
};
