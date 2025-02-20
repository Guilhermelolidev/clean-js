require('express-async-errors');

const express = require('express');
const { routes } = require('./routes');
const { z, ZodError } = require('zod');
const app = express();

app.use(express.json());

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

module.exports = { app };
