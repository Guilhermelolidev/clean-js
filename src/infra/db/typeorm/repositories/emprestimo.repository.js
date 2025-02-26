const { IsNull } = require('typeorm');
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

  const devolver = async function ({ emprestimo_id, data_devolucao }) {
    await typeormEmprestimoRepository.update(emprestimo_id, {
      data_devolucao,
    });

    const { data_retorno } = await typeormEmprestimoRepository.findOneBy({
      id: emprestimo_id,
    });

    return { data_retorno };
  };

  const buscarPendentesComLivroComUsuario = async function () {
    const emprestimosPendentes = await typeormEmprestimoRepository.find({
      where: {
        data_devolucao: IsNull(),
      },
      relations: ['usuario', 'livro'],
      select: {
        id: true,
        data_saida: true,
        data_retorno: true,
        usuario: {
          nome_completo: true,
          CPF: true,
        },
        livro: {
          nome: true,
        },
      },
    });

    return emprestimosPendentes;
  };

  const verificaSeUsuarioJaAlugouOlivro = async function ({
    usuario_id,
    livro_id,
  }) {
    const emprestimoLivro = await typeormEmprestimoRepository.count({
      where: {
        data_devolucao: IsNull(),
        livro_id,
        usuario_id,
      },
    });

    return emprestimoLivro === 0 ? false : true;
  };

  const buscarEmprestimoComLivroEUsuarioPorID = async function (id) {
    const emprestimo = await typeormEmprestimoRepository.findOne({
      where: {
        id,
      },
      relations: ['usuario', 'livro'],
      select: {
        id: true,
        data_saida: true,
        data_retorno: true,
        usuario: {
          nome_completo: true,
          CPF: true,
          email: true,
        },
        livro: {
          nome: true,
        },
      },
    });

    return emprestimo;
  };

  return {
    emprestar,
    devolver,
    buscarPendentesComLivroComUsuario,
    verificaSeUsuarioJaAlugouOlivro,
    buscarEmprestimoComLivroEUsuarioPorID,
  };
};

module.exports = { typeormEmprestimoRepository, emprestimosRepository };
