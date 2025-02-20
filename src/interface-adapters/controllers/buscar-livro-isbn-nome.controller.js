const { AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');

const { z } = require('zod');

const zodValidator = z.object({
  valor: z.string({
    required_error: 'Valor é obrigatório',
  }),
});

module.exports = async function buscarLivroPorISBNOuNomeController({
  buscarLivroPorISBNOuNomeUseCase,
  httpRequest,
}) {
  const { valor } = zodValidator.parse(httpRequest.query);

  const output = await buscarLivroPorISBNOuNomeUseCase({ valor });

  return output.fold(
    error => httpResponse(400, error.message),
    livros => httpResponse(200, livros)
  );
};
