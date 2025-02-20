const { AppError } = require('../../shared/errors');
const { z } = require('zod');
const httpResponse = require('../../shared/helpers/http.response');

const zodValidator = z.object({
  usuario_id: z.number({
    required_error: 'Usuario é obrigatório',
  }),
  livro_id: z.number({
    required_error: 'Livro é obrigatório',
  }),
  data_retorno: z.string({
    required_error: 'Data de retorno é obrigatório',
  }),
  data_saida: z.string({
    required_error: 'Data de saída é obrigatório',
  }),
});

module.exports = async function emprestarLivroProUsuarioController({
  emprestarLivroProUsuarioUseCase,
  httpRequest,
}) {
  if (!emprestarLivroProUsuarioUseCase || !httpRequest)
    throw new AppError(AppError.dependencias);

  const { usuario_id, livro_id, data_retorno, data_saida } = zodValidator.parse(
    httpRequest.body
  );

  const output = await emprestarLivroProUsuarioUseCase({
    usuario_id,
    livro_id,
    data_retorno: new Date(data_retorno),
    data_saida: new Date(data_saida),
  });

  return output.fold(
    error => httpResponse(400, error.message),
    () => httpResponse(201, null)
  );
};
