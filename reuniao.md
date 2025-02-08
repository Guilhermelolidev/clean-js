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

[] Cadastrar um novo livro
[] - ISBN deve ser unico

[] Buscar um livro por nome ou ISBN
[] - Retornar os livros ou vazio

[] Emprestar um livro ao usuario
[] - A data de retorno nao pode ser menor que a data de saida
[] - Um usuario nao pode estar com mais de um livro com o mesmo ISBN ao mesmo tempo
[] - Um usuario pode estar com mais de um livro com ISBN diferentes ao mesmo tempo
[] - Ao cadastrar um empréstimo, será enviado um email automaticamente informando o nome do livro, nome de usuario, CPF, data de saida e a data de retorno

[] Devolver o livro emprestado
[] - Caso o usuario tenha atrasado, será gerado uma multa fixa de R$ 10,00

[] Mostrar todos os empréstimos pendentes, com o nome do livro, nome do usuario, CPF, data de saida, data de retorno. Ordenados pela data de
retorno mais antiga

<!-- Estruturas -->

<!-- Usuarios Repository -->

[] cadastrar: ({ nome_completo, CPF, telefone, endereco, email }) => Promise<void>
[] buscarPorCPF(CPF) => Promise<boolean>
[] buscarPorEmail(email) => Promise<boolean>
