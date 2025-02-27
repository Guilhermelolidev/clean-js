const { Router } = require('express');
const emprestarLivroComposer = require('../composer/emprestar-livro.composer');

const emprestimosRoutes = Router();

emprestimosRoutes.post('/', async (request, response) => {
  const httpRequest = {
    body: request.body,
  };

  const { statusCode, body } = await emprestarLivroComposer(httpRequest);
  return response.status(statusCode).json(body);
});

module.exports = { emprestimosRoutes };
