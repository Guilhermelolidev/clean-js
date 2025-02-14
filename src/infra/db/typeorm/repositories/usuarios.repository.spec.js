const {
  usuariosRepository,
  typeormUsuariosRepository,
} = require('./usuarios.repository');

describe('Usuarios Repository', function () {
  let sut;
  beforeEach(async function () {
    await typeormUsuariosRepository.delete({});
  });

  beforeAll(function () {
    sut = usuariosRepository();
  });

  const usuarioDTO = {
    nome_completo: 'nome_valido',
    CPF: 'CPF_valido',
    telefone: 'telefone_valido',
    email: 'email_valido',
    endereco: 'endereco_valido',
  };

  test('Deve retornar void ao criar um usuario', async () => {
    const usuarioCriado = await sut.cadastrar(usuarioDTO);
    expect(usuarioCriado).toBeUndefined();
  });

  test('Deve retornar um usuario se o mesmo existir buscando por CPF', async () => {
    await typeormUsuariosRepository.save(usuarioDTO);
    const buscarPorCPFCadastrado = await sut.buscarUsuarioPorCPF('CPF_valido');

    expect(buscarPorCPFCadastrado.id).toBeDefined();
    expect(buscarPorCPFCadastrado.nome_completo).toBe('nome_valido');
  });

  test('Deve retornar null se o usuario não for encontrado', async () => {
    const buscarPorCPFCadastrado = await sut.buscarUsuarioPorCPF('CPF_valido');
    expect(buscarPorCPFCadastrado).toBeNull();
  });

  test('Deve retornar true se o usuario for encontrado por CPF', async () => {
    await typeormUsuariosRepository.save(usuarioDTO);
    const buscarPorCPFCadastrado = await sut.buscarPorCPF('CPF_valido');
    expect(buscarPorCPFCadastrado).toBe(true);
  });
});
