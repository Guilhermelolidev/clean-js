<!-- Reuniao -->

Somos uma biblioteca pequena e gostariamos de controlar a nossa entrada e saida de livros. Queremos cadastrar o usuario que irá pegar
o livro emprestado, cadastrar os livros da nossa biblioteca e poder emprestar os livros para qualquer usuario, alem de buscar os registros de emprestimos.

<!-- Dados -->

- Usuario (nome_completo, CPF, telefone, endereco, email)
- Livro (nome, quantidade, autor, genero, ISBN)
- Emprestimo (usuario_id, livro_id, data_retorno, data_devolucao, data_saida)

<!-- UseCases (Regras de negócio) -->

[x] Cadastrar um novo usuário
[x] - CPF ou email devem ser únicos

[x] Buscar um cadastro de usuário por CPF
[x] - Retornar um usuario ou vazio

[x] Cadastrar um novo livro
[x] - ISBN deve ser unico

[x] Buscar um livro por nome ou ISBN
[x] - Retornar os livros ou vazio

[x] Emprestar um livro ao usuario
[x] - A data de retorno nao pode ser menor que a data de saida
[x] - Um usuario nao pode estar com mais de um livro com o mesmo ISBN ao mesmo tempo
[x] - Um usuario pode estar com mais de um livro com ISBN diferentes ao mesmo tempo
[x] - Ao cadastrar um empréstimo, será enviado um email automaticamente informando o nome do livro, nome de usuario, CPF, data de saida e a data de retorno

[x] Devolver o livro emprestado (sem multa)
[x] - Caso o usuario tenha atrasado, será gerado uma multa fixa de R$ 10,00

[x] Listar todos os empréstimos pendentes, com o nome do livro, nome do usuario, CPF, data de saida, data de retorno. Ordenados pela data de
retorno mais antiga

<!-- Estruturas -->

<!-- Usuarios Repository -->

[x] cadastrar: ({ nome_completo, CPF, telefone, endereco, email }) => Promise<void>
[x] buscarUsuarioPorCPF(CPF) => Promise<usuario | null>
[x] buscarPorCPF(CPF) => Promise<boolean>
[x] buscarPorEmail(email) => Promise<boolean>

<!-- Livros Repository -->

[] cadastrar: ({ nome, quantidade, autor, genero, ISBN }) => Promise<void>
[] buscarLivroPorISBN: (ISBN) => Promise<boolean>
[] buscarLivroPorNomeOuISBN: (valor) => Promise<array<Livro>>

<!-- Emprestimos Repository -->

[] emprestar: ({ usuario_id, livro_id, data_retorno, data_devolucao, data_saida }) => Promise<void>
[] verificaSeUsuarioJaAlugouOlivro: ({ usuario_id, livro_id }) => Promise<boolean>
[] buscarEmprestimoComLivroEUsuarioPorID: (id) => Promise<emprestimo & {Livro{nome}, Usuario{nome_completo}, CPF, email}>
[] devolver: ({ emprestimo_id, data_retorno }) => Promise<{data_retorno}>
[] buscarPendentesComLivroComUsuario: () => Promise<emprestimos: { data_saida, data_retorno, & Livro: { Nome }, Usuario: { nome_completo, CPF } }>
