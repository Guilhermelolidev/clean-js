const { AppError } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');

module.exports = async function buscarEmprestimosPendentes({
  buscarEmprestimosPendentesUseCase,
}) {
  if (!buscarEmprestimosPendentesUseCase)
    throw new AppError(AppError.dependencias);

  const output = await buscarEmprestimosPendentesUseCase();

  console.log('output', output);

  return output.fold(
    error => httpResponse(400, error.message),
    emprestimos => httpResponse(200, emprestimos)
  );
};
