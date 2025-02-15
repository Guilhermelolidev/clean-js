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

  const usuarioDTO = {
    nome_completo: 'nome_valido',
    CPF: 'CPF_valido',
    telefone: 'telefone_valido',
    email: 'email_valido',
    endereco: 'endereco_valido',
  };

  const livroDTO = {
    nome: 'livro_valido',
    quantidade: 3,
    autor: 'autor_valido',
    genero: 'genero_valido',
    ISBN: 'ISBN_valido',
  };

  test('Deve retornar void ao criar um emprestimo', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivroRepository.save(livroDTO);
    const emprestimoCriado = await sut.emprestar({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_retorno: '2025-03-10',
      data_saida: '2025-03-11',
    });
    expect(emprestimoCriado).toBeUndefined();
  });

  test('Deve verificar se o usuario devolveu o livro na data de retorno correta', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivroRepository.save(livroDTO);
    const emprestimo = await typeormEmprestimoRepository.save({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_retorno: '2025-03-11',
      data_saida: '2025-03-11',
    });
    const devolver = await sut.devolver({
      emprestimo_id: emprestimo.id,
      data_devolucao: '2025-03-11',
    });
    expect(devolver.data_retorno).toBe(emprestimo.data_retorno);
  });
});
