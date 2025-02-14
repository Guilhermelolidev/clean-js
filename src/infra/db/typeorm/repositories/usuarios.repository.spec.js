const { usuariosRepository } = require('./usuarios.repository');

describe('Usuarios Repository', function () {
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
});
