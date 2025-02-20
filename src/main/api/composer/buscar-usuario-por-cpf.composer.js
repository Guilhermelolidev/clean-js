const buscarUsuarioCpfUsecase = require('../../../application/buscar-usuario-cpf.usecase');
const {
  usuariosRepository,
} = require('../../../infra/db/typeorm/repositories/usuarios.repository');
const buscarUsuarioPorCPFController = require('../../../interface-adapters/controllers/buscar-usuario-cpf.controller');

module.exports = async function buscarUsuarioPorCPFCompose(httpRequest) {
  const usuariosRepositoryFn = usuariosRepository();
  const buscarUsuarioPorCPFUseCaseFn = buscarUsuarioCpfUsecase({
    usuariosRepository: usuariosRepositoryFn,
  });
  const controller = await buscarUsuarioPorCPFController({
    buscarUsuarioPorCPFUseCase: buscarUsuarioPorCPFUseCaseFn,
    httpRequest,
  });
  return controller;
};
