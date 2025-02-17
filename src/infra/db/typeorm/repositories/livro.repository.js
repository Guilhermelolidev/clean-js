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

  const buscarLivroPorISBN = async ISBN => {
    const livro = await typeormLivroRepository.count({
      where: {
        ISBN,
      },
    });

    return !!livro;
  };

  const buscarLivroPorNomeOuISBN = async valor => {
    const livros = await typeormLivroRepository.find({
      where: [{ nome: valor }, { ISBN: valor }],
    });

    return livros;
  };

  return { cadastrar, buscarLivroPorISBN, buscarLivroPorNomeOuISBN };
};

module.exports = { typeormLivroRepository, livrosRepository };
