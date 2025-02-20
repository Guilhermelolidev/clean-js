const { z } = require('zod');
const { AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');

const zodResolver = z.object({
  data_devolucao: z.string({
    required_error: 'Data de devolução é obrigatório',
  }),
});

module.exports = async function devolverLivroController({
  devolverLivroUseCase,
  httpRequest,
}) {
  if (!devolverLivroUseCase || !httpRequest)
    throw new AppError(AppError.dependencias);

  const { emprestimo_id } = httpRequest.params;
  const { data_devolucao } = zodResolver.parse(httpRequest.body);

  const output = await devolverLivroUseCase({
    emprestimo_id,
    data_devolucao,
  });

  return output.fold(
    error => httpResponse(400, error.message),
    result => httpResponse(200, result)
  );
};
