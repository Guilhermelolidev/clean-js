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
    await typeormUsuariosRepository.delete({});
    await typeormLivroRepository.delete({});
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

  test('Deve atualizar a data de devolucao no banco de dados corretamente', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivroRepository.save(livroDTO);
    const emprestimo = await typeormEmprestimoRepository.save({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_retorno: '2025-03-11',
      data_saida: '2025-03-11',
    });
    await sut.devolver({
      emprestimo_id: emprestimo.id,
      data_devolucao: '2025-03-11',
    });
    const buscarEmprestimoPorID = await typeormEmprestimoRepository.findOneBy({
      id: emprestimo.id,
    });
    expect(buscarEmprestimoPorID.data_devolucao).toBe('2025-03-11');
  });

  test('Deve retornar os emprestimos pendentes', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivroRepository.save(livroDTO);

    await typeormEmprestimoRepository.save([
      {
        usuario_id: usuario.id,
        livro_id: livro.id,
        data_retorno: '2025-03-13',
        data_saida: '2025-03-11',
        data_devolucao: '2025-03-13',
      },
      {
        usuario_id: usuario.id,
        livro_id: livro.id,
        data_retorno: '2025-03-11',
        data_saida: '2025-03-10',
      },
    ]);

    const emprestimosPendentes = await sut.buscarPendentesComLivroComUsuario();

    expect(emprestimosPendentes).toHaveLength(1);
    expect(emprestimosPendentes[0].id).toBeDefined();
    expect(emprestimosPendentes[0].data_saida).toBe('2025-03-10');
    expect(emprestimosPendentes[0].data_retorno).toBe('2025-03-11');
    expect(emprestimosPendentes[0].data_devolucao).toBeUndefined();
    expect(emprestimosPendentes[0].usuario.nome_completo).toBe('nome_valido');
    expect(emprestimosPendentes[0].livro.nome).toBe('livro_valido');
  });

  test('Deve retornar true se existir um emprestimo pendente para o usuario e o livro', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivroRepository.save(livroDTO);

    await typeormEmprestimoRepository.save({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_retorno: '2025-03-11',
      data_saida: '2025-03-11',
    });

    const existeEmprestimoPendenteLivroUsuario =
      await sut.verificaSeUsuarioJaAlugouOlivro({
        usuario_id: usuario.id,
        livro_id: livro.id,
      });

    expect(existeEmprestimoPendenteLivroUsuario).toBe(true);
  });

  test('Deve retornar false se não existir um emprestimo pendente para o usuario e o livro', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivroRepository.save(livroDTO);

    const existeEmprestimoPendenteLivroUsuario =
      await sut.verificaSeUsuarioJaAlugouOlivro({
        usuario_id: usuario.id,
        livro_id: livro.id,
      });

    expect(existeEmprestimoPendenteLivroUsuario).toBe(false);
  });

  test('Deve retornar o emprestimo buscado por ID com o usuario e o livro', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO);
    const livro = await typeormLivroRepository.save(livroDTO);

    const emprestimo = await typeormEmprestimoRepository.save({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_retorno: '2025-03-11',
      data_saida: '2025-03-11',
    });

    const buscarEmprestimoComLivroComUsuario =
      await sut.buscarEmprestimoComLivroEUsuarioPorID(emprestimo.id);

    expect(buscarEmprestimoComLivroComUsuario).toEqual({
      id: emprestimo.id,
      data_saida: '2025-03-11',
      data_retorno: '2025-03-11',
      usuario: {
        nome_completo: 'nome_valido',
        CPF: 'CPF_valido',
        email: 'email_valido',
      },
      livro: {
        nome: 'livro_valido',
      },
    });
  });
});
