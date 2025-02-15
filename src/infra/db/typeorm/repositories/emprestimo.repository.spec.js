const {
  typeormEmprestimoRepository,
  emprestimosRepository,
} = require('./emprestimo.repository');
const { typeormLivroRepository } = require('./livro.repository');
const { typeormUsuariosRepository } = require('./usuarios.repository');

describe('Emprestimo Repository', () => {
  let sut;

  beforeEach(async function () {
    await typeormEmprestimoRepository.delete({});
  });

  beforeAll(function () {
    sut = emprestimosRepository();
  });

  test('Deve emprestar um livro ao usuario', async () => {
    const usuario = await typeormUsuariosRepository.save({
      nome_completo: 'nome_valido',
      CPF: 'CPF_valido',
      telefone: 'telefone_valido',
      email: 'email_valido',
      endereco: 'endereco_valido',
    });

    const livro = await typeormLivroRepository.save({
      nome: 'livro_valido',
      quantidade: 3,
      autor: 'autor_valido',
      genero: 'genero_valido',
      ISBN: 'ISBN_valido',
    });

    const emprestimoCriado = await sut.emprestar({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_retorno: '2025-03-10',
      data_devolucao: 'data_devolucao_valido',
      data_saida: '2025-03-10',
    });
    expect(emprestimoCriado).toBeUndefined();
  });
});
