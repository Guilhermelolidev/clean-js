const { typeormServer } = require('../setup');

const typeormEmprestimoRepository = typeormServer.getRepository('Emprestimo');

const emprestimosRepository = function () {
  const emprestar = async ({
    usuario_id,
    livro_id,
    data_retorno,
    data_saida,
  }) => {
    await typeormEmprestimoRepository.save({
      usuario_id,
      livro_id,
      data_saida,
      data_retorno,
    });
  };

  return { emprestar };
};

module.exports = { typeormEmprestimoRepository, emprestimosRepository };
