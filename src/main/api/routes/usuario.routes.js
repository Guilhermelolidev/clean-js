const { Router } = require('express');
const cadastrarUsuarioComposer = require('../composer/cadastrar-usuario.composer');
const buscarUsuarioPorCpfComposer = require('../composer/buscar-usuario-por-cpf.composer');

const usuariosRoutes = Router();

usuariosRoutes.post('/', async (request, response) => {
  const httpRequest = {
    body: request.body,
  };

  const { statusCode, body } = await cadastrarUsuarioComposer(httpRequest);

  return response.status(statusCode).json(body);
});
usuariosRoutes.get('/cpf/:cpf', async (request, response) => {
  const httpRequest = {
    params: request.params,
  };

  const { statusCode, body } = await buscarUsuarioPorCpfComposer(httpRequest);
  return response.status(statusCode).json(body);
});

module.exports = { usuariosRoutes };
