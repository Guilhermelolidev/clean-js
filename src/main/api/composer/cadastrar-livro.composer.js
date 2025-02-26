const cadastrarNovoLivroUsecase = require('../../../application/cadastrar-novo-livro.usecase');
const {
  livrosRepository,
} = require('../../../infra/db/typeorm/repositories/livro.repository');
const cadastrarNovoLivroController = require('../../../interface-adapters/controllers/cadastrar-novo-livro.controller');

module.exports = async function cadastrarLivroCompose(httpRequest) {
  const livrosRepositoryFn = livrosRepository();
  const cadastrarLivroUseCaseFn = cadastrarNovoLivroUsecase({
    livrosRepository: livrosRepositoryFn,
  });

  const controller = await cadastrarNovoLivroController({
    cadastrarNovoLivroUseCase: cadastrarLivroUseCaseFn,
    httpRequest,
  });

  return controller;
};
