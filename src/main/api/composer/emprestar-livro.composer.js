const emprestarLivroAoUsuarioUsecase = require('../../../application/emprestar-livro-ao-usuario.usecase');
const {
  emprestimosRepository,
} = require('../../../infra/db/typeorm/repositories/emprestimo.repository');
const nodemailerService = require('../../../infra/email/nodemailer');
const emprestarLivroAoUsuarioController = require('../../../interface-adapters/controllers/emprestar-livro-ao-usuario.controller');

module.exports = function emprestarLivroComposer(httpRequest) {
  const emprestimosRepositoryFn = emprestimosRepository();
  const emailServiceFn = nodemailerService();
  const emprestarLivroUseCaseFn = emprestarLivroAoUsuarioUsecase({
    emprestimosRepository: emprestimosRepositoryFn,
    emailService: emailServiceFn,
  });
  const controller = emprestarLivroAoUsuarioController({
    emprestarLivroProUsuarioUseCase: emprestarLivroUseCaseFn,
    httpRequest,
  });

  return controller;
};
