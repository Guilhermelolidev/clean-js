const { typeormServer } = require('../setup');

const typeormLivroRepository = typeormServer.getRepository('Livro');

const livrosRepository = function () {
  const cadastrar = async ({ nome, quantidade, autor, genero, ISBN }) => {
    await typeormLivroRepository.save({
      nome,
      quantidade,
      autor,
      genero,
      ISBN,
    });
  };

  return { cadastrar };
};

module.exports = { typeormLivroRepository, livrosRepository };
