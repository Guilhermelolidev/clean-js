const { Either, AppError } = require('../shared/errors');

module.exports = function buscarLivroPorISBNOuNomeUseCase({
  livrosRepository,
}) {
  if (!livrosRepository) throw new AppError(AppError.dependencias);

  return async function ({ valor }) {
    if (!valor) throw new AppError(AppError.parametrosObrigatorios);

    const results = await livrosRepository.buscarLivroPorNomeOuISBN(valor);

    if (!results) return Either.Right([]);

    return Either.Right(results);
  };
};
