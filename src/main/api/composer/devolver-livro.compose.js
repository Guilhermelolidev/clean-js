const devolverLivroUsecase = require('../../../application/devolver-livro.usecase');
const {
  emprestimosRepository,
} = require('../../../infra/db/typeorm/repositories/emprestimo.repository');
const devolverLivroController = require('../../../interface-adapters/controllers/devolver-livro.controller');

module.exports = function devolverLivroComposer(httpRequest) {
  const emprestimosReposityFn = emprestimosRepository();
  const devolverLivroUseCaseFn = devolverLivroUsecase({
    emprestimosRepository: emprestimosReposityFn,
  });

  const controller = devolverLivroController({
    devolverLivroUseCase: devolverLivroUseCaseFn,
    httpRequest,
  });

  return controller;
};
