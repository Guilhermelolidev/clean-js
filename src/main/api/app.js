require('express-async-errors');

const express = require('express');
const { routes } = require('./routes');
const { z, ZodError } = require('zod');
const { typeormServer } = require('../../infra/db/typeorm/setup');
const app = express();

app.use(express.json());

typeormServer
  .initialize()
  .then(() => {
    app.use(routes);

    app.use(function (error, request, response, next) {
      if (error instanceof ZodError) {
        return response
          .status(400)
          .json({ message: 'Erro de validação', erros: error.flatten() });
      }
      if (process.env.NODE !== 'production') console.log(error);
      return response.status(500).json({ message: 'Erro interno do servidor' });
    });
  })
  .catch(error => {
    console.log(`Error ao iniciar o servidor`, error);
  });

module.exports = { app };
