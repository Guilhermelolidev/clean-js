const buscarLivroIsbnNomeUsecase = require('../../../application/buscar-livro-isbn-nome.usecase');
const {
  livrosRepository,
} = require('../../../infra/db/typeorm/repositories/livro.repository');
const buscarLivroIsbnNomeController = require('../../../interface-adapters/controllers/buscar-livro-isbn-nome.controller');

module.exports = async function buscarLivroPorNomeOuISBNCompose(httpRequest) {
  const livrosRepositoryFn = livrosRepository();
  const buscarLivroPorNomeOuIsbnUseCaseFn = buscarLivroIsbnNomeUsecase({
    livrosRepository: livrosRepositoryFn,
  });

  const controller = buscarLivroIsbnNomeController({
    buscarLivroPorISBNOuNomeUseCase: buscarLivroPorNomeOuIsbnUseCaseFn,
    httpRequest,
  });

  return controller;
};
