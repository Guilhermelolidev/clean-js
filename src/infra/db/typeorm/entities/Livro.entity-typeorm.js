const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Livro',
  tableName: 'livros',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    ISBN: {
      type: 'int',
      unique: true,
    },
    nome: {
      type: 'varchar',
    },
    quantidade: {
      type: 'int',
    },
    autor: {
      type: 'varchar',
    },
    genero: {
      type: 'varchar',
    },
  },
});
