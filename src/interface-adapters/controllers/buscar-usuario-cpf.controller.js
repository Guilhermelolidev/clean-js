const { AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');

const { z } = require('zod');

const zodValidator = z.object({
  CPF: z
    .string({
      required_error: 'CPF é obrigatório',
    })
    .refine(value => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)),
});

module.exports = async function buscarUsuarioPorCPFController({
  buscarUsuarioPorCPFUseCase,
  httpRequest,
}) {
  const { CPF } = zodValidator.parse(httpRequest.params);
  const output = await buscarUsuarioPorCPFUseCase({ CPF });
  return output.fold(
    error => httpResponse(400, error.message),
    usuario => httpResponse(200, usuario)
  );
};
