const {
  usuariosRepository,
  typeormUsuariosRepository,
} = require('./usuarios.repository');

describe('Usuarios Repository', function () {
  beforeEach(async function () {
    await typeormUsuariosRepository.delete({});
  });

  test('Deve retornar void ao criar um usuario', async () => {
    const sut = usuariosRepository();
    const usuarioCriado = await sut.cadastrar({
      nome_completo: 'nome_valido',
      CPF: 'CPF_valido',
      telefone: 'telefone_valido',
      email: 'email_valido',
      endereco: 'endereco_valido',
    });

    expect(usuarioCriado).toBeUndefined();
  });

  test('Deve retornar um usuario se o mesmo existir buscando por CPF', async () => {
    await typeormUsuariosRepository.save({
      nome_completo: 'nome_valido',
      CPF: 'CPF_valido',
      telefone: 'telefone_valido',
      email: 'email_valido',
      endereco: 'endereco_valido',
    });
    const sut = usuariosRepository();
    const buscarPorCPFCadastrado = await sut.buscarUsuarioPorCPF('CPF_valido');

    expect(buscarPorCPFCadastrado.id).toBeDefined();
    expect(buscarPorCPFCadastrado.nome_completo).toBe('nome_valido');
  });
});
