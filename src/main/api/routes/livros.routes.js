const { Router } = require('express');
const { request } = require('http');
const cadastrarLivroComposer = require('../composer/cadastrar-livro.composer');

const livrosRoutes = Router();

livrosRoutes.post('/', async (request, response) => {
  const httpRequest = {
    body: request.body,
  };

  const { statusCode, body } = await cadastrarLivroComposer(httpRequest);
  return response.status(statusCode).json(body);
});

module.exports = { livrosRoutes };
