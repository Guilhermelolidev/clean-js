const { Router, request } = require('express');
const cadastrarUsuarioComposer = require('../composer/cadastrar-usuario.composer');

const usuariosRoutes = Router();

usuariosRoutes.post('/', async (request, response) => {
  const httpRequest = {
    body: request.body,
  };

  const { statusCode, body } = await cadastrarUsuarioComposer(httpRequest);

  return response.status(statusCode).json(body);
});

module.exports = { usuariosRoutes };
