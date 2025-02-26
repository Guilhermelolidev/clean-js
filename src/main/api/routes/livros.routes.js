const { Router } = require('express');
const { request } = require('http');
const cadastrarLivroComposer = require('../composer/cadastrar-livro.composer');
const buscarLivroPorNomeOuIsbnComposer = require('../composer/buscar-livro-por-nome-ou-isbn.composer');

const livrosRoutes = Router();

livrosRoutes.post('/', async (request, response) => {
  const httpRequest = {
    body: request.body,
  };

  const { statusCode, body } = await cadastrarLivroComposer(httpRequest);
  return response.status(statusCode).json(body);
});

livrosRoutes.get('/', async (request, response) => {
  const httpRequest = {
    query: request.query,
  };

  const { statusCode, body } = await buscarLivroPorNomeOuIsbnComposer(
    httpRequest
  );
  return response.status(statusCode).json(body);
});

module.exports = { livrosRoutes };
