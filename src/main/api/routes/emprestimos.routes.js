const { Router } = require('express');
const emprestarLivroComposer = require('../composer/emprestar-livro.composer');
const { request } = require('http');
const devolverLivroCompose = require('../composer/devolver-livro.compose');

const emprestimosRoutes = Router();

emprestimosRoutes.post('/', async (request, response) => {
  const httpRequest = {
    body: request.body,
  };

  const { statusCode, body } = await emprestarLivroComposer(httpRequest);
  return response.status(statusCode).json(body);
});

emprestimosRoutes.put('/devolver/:emprestimo_id', async (request, response) => {
  const httpRequest = {
    body: request.body,
    params: request.params,
  };

  const { statusCode, body } = await devolverLivroCompose(httpRequest);
  return response.status(statusCode).json(body);
});

module.exports = { emprestimosRoutes };
