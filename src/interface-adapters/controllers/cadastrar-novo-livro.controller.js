const { AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');

const { z } = require('zod');

const zodValidator = z.object({
  nome: z.string({
    required_error: 'Nome é obrigatório',
  }),
  quantidade: z.number({
    required_error: 'Quantidade é obrigatório',
  }),
  autor: z.string({
    required_error: 'Autor é obrigatório',
  }),
  genero: z.string({
    required_error: 'Genero é obrigatório',
  }),
  ISBN: z.number({
    required_error: 'ISBN é obrigatório',
  }),
});

module.exports = async function cadastrarNovoLivroController({
  cadastrarNovoLivroUseCase,
  httpRequest,
}) {
  if (!cadastrarNovoLivroUseCase || !httpRequest || !httpRequest.body)
    throw new AppError(AppError.dependencias);
  const { nome, quantidade, autor, genero, ISBN } = zodValidator.parse(
    httpRequest.body
  );

  const output = await cadastrarNovoLivroUseCase({
    nome,
    quantidade,
    autor,
    genero,
    ISBN,
  });

  return output.fold(
    error => httpResponse(400, error.message),
    usuario => httpResponse(201, usuario)
  );
};
