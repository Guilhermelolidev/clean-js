const { Either } = require('../../shared/errors');
const httpResponse = require('../../shared/helpers/http.response');
const buscarLivroPorISBNOuNomeController = require('./buscar-livro-isbn-nome.controller');

describe('Buscar livro por nome ou ISBN Controller', () => {
  const buscarLivroPorISBNOuNomeUseCase = jest.fn();
  test('Deve retornar um httpResponse 200 e os livros encontrados com o valor informado', async () => {
    const livrosDTO = [
      {
        id: 'qualquer_id',
        nome: 'qualquer_nome',
        quantidade: 1,
        autor: 'qualquer_autor',
        genero: 'qualquer_genero',
        ISBN: 'qualquer_ISBN',
      },
    ];

    const httpRequest = {
      query: {
        valor: 'nome_valido',
      },
    };

    buscarLivroPorISBNOuNomeUseCase.mockResolvedValue(Either.Right(livrosDTO));

    const response = await buscarLivroPorISBNOuNomeController({
      buscarLivroPorISBNOuNomeUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(200, livrosDTO));
    expect(buscarLivroPorISBNOuNomeUseCase).toHaveBeenCalledWith(
      httpRequest.query
    );
    expect(buscarLivroPorISBNOuNomeUseCase).toHaveBeenCalledTimes(1);
  });

  test('Deve retornar um array vazio se nenhum livro for encontrado com o valor fornecido', async () => {
    buscarLivroPorISBNOuNomeUseCase.mockResolvedValue(Either.Right([]));

    const httpRequest = {
      query: {
        valor: 'nome_valido',
      },
    };

    const response = await buscarLivroPorISBNOuNomeController({
      buscarLivroPorISBNOuNomeUseCase,
      httpRequest,
    });

    expect(response).toEqual(httpResponse(200, []));
    expect(buscarLivroPorISBNOuNomeUseCase).toHaveBeenCalledWith(
      httpRequest.query
    );
    expect(buscarLivroPorISBNOuNomeUseCase).toHaveBeenCalledTimes(1);
  });
});
